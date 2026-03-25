import os, logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from config.settings import settings
from routers import evaluate, tenant, dashboard, usage, webhook

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(name)s: %(message)s")
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    from routers.evaluate import ml_engine
    ml_engine.load_models()
    logger.info("🚀 AuthDNA started")
    yield

app = FastAPI(title="AuthDNA API", version="2.0.0", lifespan=lifespan)
# Allow all origins so any client website (like Payflow) can send telemetry
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=False, allow_methods=["*"], allow_headers=["*"])
app.include_router(evaluate.router); app.include_router(tenant.router)
app.include_router(dashboard.router); app.include_router(usage.router); app.include_router(webhook.router)
sdk_dir = os.path.join(os.path.dirname(__file__), "sdk")
if os.path.exists(sdk_dir): app.mount("/sdk", StaticFiles(directory=sdk_dir), name="sdk")

@app.get("/health")
async def health():
    from routers.evaluate import ml_engine
    return {"status": "healthy", "models_loaded": ml_engine.is_loaded, "version": "2.0.0"}