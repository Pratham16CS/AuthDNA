from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum


class TierEnum(str, Enum):
    free = "free"
    pro = "pro"
    enterprise = "enterprise"


class ClientContext(BaseModel):
    user_agent: str = ""
    screen_resolution: str = ""
    timezone: str = ""
    language: str = ""
    platform: str = ""
    color_depth: int = 0
    cookie_enabled: bool = True
    hardware_concurrency: int = 0
    device_memory: float = 0
    touch_support: bool = False
    canvas_hash: str = ""
    webgl_renderer: str = ""


class TenantRegisterRequest(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5)
    admin_secret: str
    tier: TierEnum = TierEnum.free
    webhook_url: Optional[str] = None


class TenantRegisterResponse(BaseModel):
    tenant_id: str
    api_key: str
    company_name: str
    tier: str
    message: str


class EvaluateRequest(BaseModel):
    user_id: str = Field(..., min_length=1)
    ip: Optional[str] = None
    device_fp: Optional[str] = None
    client_context: Optional[ClientContext] = None
    resource: str = "general"
    failed_attempts: int = Field(0, ge=0)
    user_agent: Optional[str] = None
    timestamp: Optional[str] = None
    role: Optional[str] = "viewer"


class RiskFactor(BaseModel):
    factor: str
    contribution: float
    description: str


class EvaluateResponse(BaseModel):
    decision: str
    score: float
    explanation: str
    risk_factors: List[RiskFactor]
    dna_match: float
    is_new_user: bool
    processing_time_ms: float
    request_id: str
    timestamp: str


class WebhookUpdateRequest(BaseModel):
    url: str = Field(..., min_length=10)