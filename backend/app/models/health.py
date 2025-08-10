from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator


class HealthResponse(BaseModel):
    """Response model for health checks."""
    
    status: str = Field(..., description="Overall system status")
    message: str = Field(..., description="Message for system status")
    timestamp: datetime = Field(..., description="Health check timestamp")
    authenticated: bool = Field(default=False, description="Health check timestamp")
    version: str = Field(..., description="API version")
    uptime_seconds: Optional[float] = Field(None, ge=0, description="System uptime in seconds")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "status": "healthy",
                "message": "HackRx Project Moonshot is running and authenticated successfully!",
                "timestamp": "2025-08-06T15:07:37.853493",
                "authenticated": True,
                "version": "/api/v1",
                "uptime_seconds": 33.33
            }
        }
    )


class OllamaHealthResponse(BaseModel):
    """Response model for health checks of Ollama server."""
    
    status: str = Field(..., description="Overall system status")
    message: str = Field(..., description="Message for system status")
    models: list[str] = Field(..., description="List of model name from Ollama server")
    timestamp: datetime = Field(..., description="Health check timestamp")
    authenticated: bool = Field(default=False, description="Health check timestamp")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "status": "healthy",
                "message": "Ollama server is running and authenticated successfully!",
                "models": ["qwen3:0.6b", "llama3.2:3b"],
                "timestamp": "2025-08-06T15:07:37.853493",
                "authenticated": True
            }
        }
    )    


class PublicResponse(BaseModel):
    """Response model for public endpoint."""

    message: str = Field(..., description="Message for system status")
    description: str = Field(..., description="Description for system status")
    environment: str = Field(..., description="Application environment type")
    docs_url: str = Field(..., description="Docs endpoint for Swagger UI")
    redoc_url: str = Field(..., description="Docs endpoint for ReDoc")
    authentication: dict = Field(..., description="Basic info on authentication type")
    api_version: str = Field(..., description="API version")
    timestamp: datetime = Field(..., description="Current timestamp")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "message": "🚀 HackRx Project Moonshot is running!",
                "description": "An ambitious venture to build an EHR platform from scratch. May fortune favors the bold",
                "environment": "development",
                "docs_url": "/docs",
                "redoc_url": "/redoc",
                "authentication": {
                    "required": True,
                    "type": "X-API-Key",
                    "test_endpoint": "/api/v1/health/"
                },
                "api_version": "/api/v1",
                "timestamp": "2025-08-06T15:09:15.017407"
            }
        }
    )
