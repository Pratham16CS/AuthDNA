import hashlib
import secrets
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from middleware.api_key_auth import verify_api_key
from models.schemas import TenantRegisterRequest, TenantRegisterResponse, WebhookUpdateRequest
from services.database_service import db_service
from config.settings import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/v1/tenants", tags=["tenants"])


def _ts():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


@router.post("/register", response_model=TenantRegisterResponse)
async def register(body: TenantRegisterRequest):
    if body.admin_secret != settings.admin_secret:
        raise HTTPException(403, "Invalid admin secret")
    slug = "".join(c if c.isalnum() else "_" for c in body.company_name.lower())[:20]
    tenant_id = f"{slug}_{secrets.token_hex(4)}"
    raw_key = f"sk_live_{secrets.token_hex(24)}"
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    now = _ts()
    logger.info(f"📝 Registering tenant: {tenant_id} | raw_key={raw_key[:20]}... | key_hash={key_hash[:16]}...")
    try:
        await db_service.create_tenant(tenant_id, {
            "company_name": body.company_name, "email": body.email,
            "tier": body.tier.value, "total_api_calls": 0,
            "webhook_url": body.webhook_url or "", "is_active": True, "created_at": now,
        })
        logger.info(f"✅ Tenant created: {tenant_id}")
        await db_service.save_api_key(key_hash, {
            "tenant_id": tenant_id, "tier": body.tier.value, "status": "active",
            "key_prefix": raw_key[:16], "created_at": now, "last_used": "",
        })
        logger.info(f"✅ API key saved with hash: {key_hash[:16]}...")
        return TenantRegisterResponse(tenant_id=tenant_id, api_key=raw_key,
            company_name=body.company_name, tier=body.tier.value,
            message="Save your API key — it won't be shown again!")
    except Exception as e:
        logger.error(f"❌ Registration failed: {e}", exc_info=True)
        raise HTTPException(500, f"Registration failed: {e}")


@router.get("/me")
async def get_me(tenant: dict = Depends(verify_api_key)):
    t = await db_service.get_tenant(tenant["tenant_id"])
    if not t: raise HTTPException(404, "Not found")
    return {"tenant_id": tenant["tenant_id"], "company_name": t.get("company_name", ""),
            "email": t.get("email", ""), "tier": t.get("tier", "free"),
            "total_api_calls": t.get("total_api_calls", 0),
            "webhook_url": t.get("webhook_url") or None, "is_active": t.get("is_active", True),
            "created_at": t.get("created_at"), "key_prefix": tenant.get("key_prefix", "")}


@router.post("/rotate-key")
async def rotate_key(tenant: dict = Depends(verify_api_key)):
    await db_service.revoke_tenant_keys(tenant["tenant_id"])
    raw = f"sk_live_{secrets.token_hex(24)}"
    kh = hashlib.sha256(raw.encode()).hexdigest()
    await db_service.save_api_key(kh, {"tenant_id": tenant["tenant_id"], "tier": tenant["tier"],
        "status": "active", "key_prefix": raw[:16], "created_at": _ts(), "last_used": ""})
    return {"api_key": raw, "message": "Old key revoked. Save new key!"}


@router.put("/webhook")
async def update_webhook(body: WebhookUpdateRequest, tenant: dict = Depends(verify_api_key)):
    await db_service.update_tenant(tenant["tenant_id"], {"webhook_url": body.url})
    return {"webhook_url": body.url, "status": "active"}