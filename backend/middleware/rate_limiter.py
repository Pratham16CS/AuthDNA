from fastapi import HTTPException
from services.database_service import db_service
from config.settings import settings

TIER_LIMITS = {"free": settings.free_rate_limit, "pro": settings.pro_rate_limit,
               "enterprise": settings.enterprise_rate_limit}


async def check_rate_limit(tenant: dict):
    tier = tenant.get("tier", "free")
    limit = TIER_LIMITS.get(tier, 100)
    count = await db_service.check_and_increment_rate(tenant["tenant_id"])
    if count > limit:
        raise HTTPException(429, {"error": "Rate limit exceeded", "limit": limit, "current": count})
    return {"current": count, "limit": limit, "remaining": max(0, limit - count)}