"""
Pasya Stock Market — FastAPI Backend
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.core.config import settings
from app.core.database import engine, Base
from app.core.redis import redis_client
from app.api.v1 import router as api_v1_router
from app.api.websocket import router as ws_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await redis_client.ping()
    print("✅ Pasya Stock Market API started")
    yield
    # Shutdown
    await redis_client.close()
    await engine.dispose()
    print("👋 Pasya Stock Market API stopped")


app = FastAPI(
    title="Pasya Stock Market API",
    description="Professional Stock Analytics Platform for IDX",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ===== MIDDLEWARE =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# ===== ROUTERS =====
app.include_router(api_v1_router, prefix="/api/v1")
app.include_router(ws_router)


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "pasya-stock-market"}
