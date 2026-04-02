from datetime import datetime, timezone

from fastapi import APIRouter

from app.core.config import settings

router = APIRouter(prefix="/system", tags=["system"])


@router.get("/health")
def get_health():
    return {
        "status": "ok",
        "time": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/runtime")
def get_runtime():
    return {
        "app_name": settings.app_name,
        "api_prefix": settings.api_prefix,
        "ai_mode": settings.ai_mode,
        "ai_provider": settings.ai_provider,
        "ai_model": settings.ai_model,
    }

