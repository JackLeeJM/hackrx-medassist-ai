from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.v1.api import api_router
from app.models.health import PublicResponse
from app.config.settings import get_settings
from app.config.logging_setup import get_logger


logger = get_logger(__name__)

settings = get_settings()
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESC,
    # lifespan=lifespan,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Public"], response_model=PublicResponse)
async def root():
    """Public root endpoint with project info"""
    return {
        "message": f"🚀 {settings.PROJECT_NAME} is running!",
        "description": settings.PROJECT_DESC,
        "environment": settings.ENVIRONMENT,
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "authentication": {
            "required": True,
            "type": "X-API-Key",
            "test_endpoint": f"{settings.API_V1_STR}/health/"
        },
        "api_version": settings.API_V1_STR,
        "timestamp": datetime.now()
    }
