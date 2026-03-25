import json
from fastapi import APIRouter, Depends, Query
from middleware.api_key_auth import verify_api_key
from services.database_service import db_service

router = APIRouter(prefix="/v1/dashboard", tags=["dashboard"])
TL = {"free": 100, "pro": 1000, "enterprise": 10000}


@router.get("/stats")
async def stats(tenant: dict = Depends(verify_api_key)):
    tid = tenant["tenant_id"]
    u = await db_service.get_usage(tid) or {}
    logs = await db_service.get_login_logs(tid, limit=8)
    rate = await db_service.get_current_rate(tid)
    limit = TL.get(tenant["tier"], 100)
    return {"total_logins": u.get("total_calls", 0), "blocked": u.get("block_count", 0),
            "otp_triggered": u.get("otp_count", 0), "stepup_count": u.get("stepup_count", 0),
            "avg_risk_score": u.get("avg_score", 0),
            "decisions": {"ALLOW": u.get("allow_count",0), "BLOCK": u.get("block_count",0),
                          "OTP": u.get("otp_count",0), "STEPUP": u.get("stepup_count",0)},
            "recent_evaluations": [{"user_id": l.get("user_id"), "ip": l.get("ip"), "country": l.get("country"),
                "score": l.get("score"), "decision": l.get("decision"), "explanation": l.get("explanation"),
                "resource": l.get("resource"), "timestamp": l.get("timestamp")} for l in logs],
            "usage": {"hourly_rate": rate, "hourly_limit": limit, "remaining": max(0, limit-rate),
                      "total_this_month": u.get("total_calls",0), "avg_latency": u.get("avg_latency_ms",0), "tier": tenant["tier"]}}

@router.get("/logs")
async def logs(tenant: dict = Depends(verify_api_key), user_id: str = Query(None), limit: int = Query(50, ge=1, le=200)):
    return {"logs": await db_service.get_login_logs(tenant["tenant_id"], limit=limit, user_id=user_id)}

@router.get("/users")
async def users(tenant: dict = Depends(verify_api_key)):
    ps = await db_service.get_all_dna_profiles(tenant["tenant_id"])
    return {"users": [{"user_id": p.get("user_id"), "login_count": p.get("login_count",0),
        "devices": json.loads(p.get("known_devices_json","[]")), "locations": json.loads(p.get("known_countries_json","[]")),
        "last_seen": p.get("last_login_timestamp")} for p in ps]}

@router.get("/users/{user_id}/dna")
async def user_dna(user_id: str, tenant: dict = Depends(verify_api_key)):
    p = await db_service.get_dna_profile(tenant["tenant_id"], user_id)
    if not p: return {"profile": None}
    return {"profile": {"user_id": p.get("user_id"), "known_devices": json.loads(p.get("known_devices_json","[]")),
        "known_countries": json.loads(p.get("known_countries_json","[]")), "known_cities": json.loads(p.get("known_cities_json","[]")),
        "avg_login_hour": p.get("avg_login_hour"), "login_count": p.get("login_count"),
        "common_resources": json.loads(p.get("common_resources_json","[]")), "last_login_ip": p.get("last_login_ip"),
        "last_login_country": p.get("last_login_country"), "last_login_timestamp": p.get("last_login_timestamp"), "first_seen": p.get("first_seen")}}