import hmac
import hashlib
import json
import logging
import asyncio
from datetime import datetime, timezone

import httpx
from config.settings import settings

logger = logging.getLogger(__name__)


class WebhookService:
    async def send(self, url, event, tenant_id, payload):
        secret = settings.webhook_signing_secret
        ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        body = json.dumps({"event": event, "tenant_id": tenant_id, "timestamp": ts, "data": payload}, default=str)
        sig = hmac.new(secret.encode(), body.encode(), hashlib.sha256).hexdigest()
        headers = {"Content-Type": "application/json", "X-Webhook-Event": event,
                    "X-Tenant-ID": tenant_id, "X-Webhook-Signature": f"sha256={sig}"}
        for attempt in range(3):
            try:
                async with httpx.AsyncClient(timeout=5.0) as c:
                    r = await c.post(url, content=body, headers=headers)
                    if r.status_code in (200, 201, 202, 204):
                        return True
            except Exception as e:
                logger.warning(f"Webhook attempt {attempt+1} failed: {e}")
            await asyncio.sleep(2 ** attempt)
        return False