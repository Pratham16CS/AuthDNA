from fastapi import APIRouter, Depends
from middleware.api_key_auth import verify_api_key
from services.database_service import db_service

router = APIRouter(prefix="/v1/usage", tags=["usage"])
TL = {"free": 100, "pro": 1000, "enterprise": 10000}

@router.get("/current")
async def current(tenant: dict = Depends(verify_api_key)):
    u = await db_service.get_usage(tenant["tenant_id"]) or {}
    r = await db_service.get_current_rate(tenant["tenant_id"])
    l = TL.get(tenant["tier"], 100)
    return {"period": u.get("period",""), "total_calls": u.get("total_calls",0),
        "allow_count": u.get("allow_count",0), "block_count": u.get("block_count",0),
        "otp_count": u.get("otp_count",0), "stepup_count": u.get("stepup_count",0),
        "avg_latency_ms": u.get("avg_latency_ms",0), "avg_score": u.get("avg_score",0),
        "hourly_rate": r, "hourly_limit": l, "remaining": max(0,l-r), "tier": tenant["tier"]}

@router.get("/history")
async def history(tenant: dict = Depends(verify_api_key)):
    return {"history": await db_service.get_usage_history(tenant["tenant_id"])}