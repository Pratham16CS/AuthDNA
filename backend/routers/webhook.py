from fastapi import APIRouter, Depends, HTTPException
from middleware.api_key_auth import verify_api_key
from services.database_service import db_service
from services.webhook_service import WebhookService
from models.schemas import WebhookUpdateRequest

router = APIRouter(prefix="/v1/webhooks", tags=["webhooks"])
ws = WebhookService()

@router.get("/")
async def get_wh(tenant: dict = Depends(verify_api_key)):
    t = await db_service.get_tenant(tenant["tenant_id"])
    url = t.get("webhook_url") if t else None
    return {"url": url or None, "active": bool(url), "events": ["risk.block","risk.stepup","risk.otp"]}

@router.put("/")
async def update_wh(body: WebhookUpdateRequest, tenant: dict = Depends(verify_api_key)):
    await db_service.update_tenant(tenant["tenant_id"], {"webhook_url": body.url})
    return {"url": body.url, "active": True}

@router.delete("/")
async def delete_wh(tenant: dict = Depends(verify_api_key)):
    await db_service.update_tenant(tenant["tenant_id"], {"webhook_url": ""})
    return {"message": "Removed"}

@router.post("/test")
async def test_wh(tenant: dict = Depends(verify_api_key)):
    t = await db_service.get_tenant(tenant["tenant_id"])
    url = t.get("webhook_url") if t else None
    if not url: raise HTTPException(400, "No webhook URL")
    ok = await ws.send(url, "risk.test", tenant["tenant_id"], {"user_id": "test@example.com", "score": 85.0, "decision": "BLOCK"})
    return {"delivered": ok}