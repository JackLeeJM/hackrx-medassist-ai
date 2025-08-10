import time
import traceback
from datetime import datetime
from fastapi import APIRouter, Depends
from app.config.logging_setup import get_logger
from app.config.settings import Settings
from app.models.health import HealthResponse
from app.models.ollama import OllamaHealthStatus, DetailedHealthResponse
from app.services.llm.ollama_client import OllamaService
from app.api.deps import verify_api_key, get_settings, get_ollama_service


logger = get_logger(__name__)

router = APIRouter()

# Track startup time for uptime calculation
startup_time = time.time()


@router.get("/", response_model=HealthResponse)
async def health_check(
    auth_info: str = Depends(verify_api_key),
    settings: Settings = Depends(get_settings)
):
    """
    Protected health check endpoint that requires X-API-Key authentication.
    
    Example usage:
    curl -H 'Accept: application/json' -H "X-API-Key: your-api-key" https://www.example.com/api/v1/health/
    """
    try:
        # Calculate uptime
        uptime_seconds = time.time() - startup_time
        return HealthResponse(
            status="healthy",
            message=f"{settings.PROJECT_NAME} is running and authenticated successfully!",
            timestamp=datetime.now().isoformat(),
            authenticated=True,
            version=settings.API_V1_STR,
            uptime_seconds=str(round(uptime_seconds, 2))
        )
        
    except Exception as e:
        logger.error(f"Health check failed: {e}\n{traceback.format_exc()}")
        return HealthResponse(
            status="unhealthy",
            timestamp=datetime.now().isoformat(),
            version=settings.API_V1_STR,
            uptime_seconds=str(round(uptime_seconds, 2))
        )


@router.get("/detailed", response_model=DetailedHealthResponse)
async def detailed_health_check(
    auth_info: str = Depends(verify_api_key),
    ollama_service: OllamaService = Depends(get_ollama_service)
):
    """
    Comprehensive health check including all external dependencies
    Use this for monitoring dashboards and detailed health status
    """
    _start_time = time.time()
    
    # Calculate uptime
    uptime_seconds = time.time() - startup_time
    
    # Check Ollama health
    ollama_health = await ollama_service.health_check(use_cache=True)
    
    # Determine overall status
    overall_status = "healthy"
    if not ollama_health.is_healthy:
        overall_status = "degraded"
    
    services_status = {
        "fastapi": {
            "status": "healthy",
            "response_time_ms": 0,
            "details": "FastAPI application is running"
        },
        "ollama": {
            "status": "healthy" if ollama_health.is_healthy else "unhealthy",
            "response_time_ms": ollama_health.response_time_ms,
            "available_models": ollama_health.available_models,
            "total_models": ollama_health.total_models,
            "error_message": ollama_health.error_message,
            "last_checked": ollama_health.last_checked
        }
    }
    
    # Log health check results
    check_duration = time.time() - _start_time
    logger.info(f"Health check completed in {check_duration:.2f}ms - Status: {overall_status}")
    
    return DetailedHealthResponse(
        status=overall_status,
        timestamp=datetime.now().isoformat(),
        services=services_status,
        uptime_seconds=uptime_seconds
    )


@router.get("/ollama", response_model=OllamaHealthStatus)
async def ollama_health_check(
    force_refresh: bool = False,
    auth_info: str = Depends(verify_api_key),
    ollama_service: OllamaService = Depends(get_ollama_service)
):
    """
    Dedicated Ollama health check endpoint
    
    Args:
        force_refresh: Force a fresh health check, bypassing cache
    """
    return await ollama_service.health_check(use_cache=not force_refresh)
