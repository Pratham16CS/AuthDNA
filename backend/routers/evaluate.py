import time, uuid, json, hashlib, logging, asyncio
from datetime import datetime, timezone
from fastapi import APIRouter, Request, Depends
from middleware.api_key_auth import verify_api_key
from middleware.rate_limiter import check_rate_limit
from models.schemas import EvaluateRequest, EvaluateResponse
from engines.feature_pipeline import FeaturePipeline
from engines.dna_engine import DNAEngine
from engines.graph_engine import GraphEngine
from engines.ml_engine import MLEngine
from engines.risk_engine import RiskEngine
from engines.llm_explainer import LLMExplainer
from services.database_service import db_service
from services.webhook_service import WebhookService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/v1", tags=["evaluate"])
fp = FeaturePipeline(); dna_eng = DNAEngine(); graph_eng = GraphEngine()
ml_engine = MLEngine(); risk_eng = RiskEngine(); llm_exp = LLMExplainer()
wh_svc = WebhookService()


def _ts(): return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
def _ip(r): return (r.headers.get("x-forwarded-for","").split(",")[0].strip() or r.headers.get("x-real-ip","").strip() or (r.client.host if r.client else "0.0.0.0"))
def _dfp(ctx, ua): 
    if ctx is None: return hashlib.md5((ua or "x").encode()).hexdigest()[:16]  # pyre-ignore[16]
    return hashlib.sha256(f"{ctx.user_agent}|{ctx.screen_resolution}|{ctx.timezone}|{ctx.platform}|{ctx.canvas_hash}".encode()).hexdigest()[:32]  # pyre-ignore[16]


@router.post("/evaluate", response_model=EvaluateResponse)
async def evaluate_login(body: EvaluateRequest, request: Request, tenant: dict = Depends(verify_api_key)):
    start = time.time()
    rid = f"req_{uuid.uuid4().hex[:12]}"  # pyre-ignore[16]
    await check_rate_limit(tenant)
    ip = body.ip or _ip(request)
    ua = body.user_agent or (body.client_context.user_agent if body.client_context else None) or request.headers.get("user-agent", "")
    dfp = body.device_fp or _dfp(body.client_context, ua)
    tid = tenant["tenant_id"]
    dna_profile = await dna_eng.get_profile(tid, body.user_id)
    pipe = await fp.extract(body.user_id, ip, dfp, body.resource, body.failed_attempts, ua, body.timestamp, dna_profile, body.role or "viewer")
    ml_scores = ml_engine.predict(pipe["features"])
    dna_features = {
        "new_device": int(pipe["flags"]["new_device"]),
        "country_change": int(pipe["flags"]["country_change"]),
        "impossible_travel": int(pipe["flags"]["impossible_travel"]),
        "hour_deviation": pipe["feature_dict"]["hour_deviation"],
        "failed_attempts": body.failed_attempts
    }
    dna_meta = {"ip_change": ip != dna_profile.get("last_login_ip") if dna_profile else True}
    dna_result = DNAEngine.compute_match_score(dna_profile, dna_features, dna_meta)
    ur = json.loads(dna_profile.get("common_resources_json", "[]")) if dna_profile else []
    gr = graph_eng.evaluate(body.role or "viewer", body.resource, ur)
    risk = risk_eng.evaluate(ml_scores, dna_result["dna_match"], gr["graph_score"], pipe["flags"], body.failed_attempts, pipe["feature_dict"])
    explanation = await llm_exp.explain(risk["score"], risk["decision"], risk["risk_factors"], pipe["geo"]["country"], pipe["geo"]["city"], pipe["parsed_hour"], dna_result["dna_match"], dna_result["is_new_user"])
    pms = round((time.time() - start) * 1000, 1)  # pyre-ignore[6]
    now = _ts()
    resp = EvaluateResponse(decision=risk["decision"], score=risk["score"], explanation=explanation,
        risk_factors=[{"factor":f["factor"],"contribution":f["contribution"],"description":f["description"]} for f in risk["risk_factors"]],
        dna_match=dna_result["dna_match"], is_new_user=dna_result["is_new_user"], processing_time_ms=pms, request_id=rid, timestamp=now)
    asyncio.create_task(_se(tid, body, ip, dfp, pipe, risk, explanation, dna_result, pms, rid, now, tenant))
    return resp


async def _se(tid, body, ip, dfp, pipe, risk, explanation, dna_result, pms, rid, now, tenant):
    try:
        await db_service.save_login_log(tid, {"user_id": body.user_id, "ip": ip[:45], "device_fp": (dfp or "")[:500],
            "country": pipe["geo"]["country"][:100], "city": pipe["geo"]["city"][:100], "score": risk["score"],
            "decision": risk["decision"][:10], "explanation": (explanation or "")[:1000], "resource": (body.resource or "")[:100],
            "risk_factors_json": json.dumps(risk["risk_factors"])[:5000], "dna_match": dna_result["dna_match"],  # pyre-ignore[16]
            "is_new_user": dna_result["is_new_user"], "processing_time_ms": pms, "request_id": rid[:50], "timestamp": now})
        if risk["decision"] != "BLOCK":
            await DNAEngine.update_profile(
                tid, body.user_id,
                metadata={
                    "country": pipe["geo"]["country"],
                    "city": pipe["geo"]["city"],
                    "device_fp": dfp,
                    "ip": ip,
                    "hour": pipe["parsed_hour"],
                    "day_of_week": datetime.now(timezone.utc).weekday(),
                    "resource": body.resource or "general"
                },
                features={}
            )
        await db_service.increment_usage(tid, risk["decision"], pms, risk["score"])
        try:
            t = await db_service.get_tenant(tid)
            if t: await db_service.update_tenant(tid, {"total_api_calls": t.get("total_api_calls", 0) + 1})
        except Exception: pass
        if risk["decision"] != "ALLOW" and tenant.get("webhook_url"):
            await wh_svc.send(tenant["webhook_url"], f"risk.{risk['decision'].lower()}", tid,
                {"user_id": body.user_id, "score": risk["score"], "decision": risk["decision"],
                 "explanation": explanation, "ip": ip, "country": pipe["geo"]["country"], "request_id": rid})
    except Exception as e:
        logger.error(f"Side effect error: {e}", exc_info=True)