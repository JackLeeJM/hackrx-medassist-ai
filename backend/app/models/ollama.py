from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator


class OllamaModelInfo(BaseModel):
    name: str
    size: int
    digest: str
    modified_at: datetime


class OllamaHealthStatus(BaseModel):
    is_healthy: bool
    response_time_ms: Optional[float] = None
    available_models: List[str] = []
    error_message: Optional[str] = None
    last_checked: datetime
    total_models: int = 0


class DetailedHealthResponse(BaseModel):
    """Extended health response with service details"""
    status: str
    timestamp: datetime
    version: str = "1.0.0"
    services: Dict[str, Any]
    uptime_seconds: float
    environment: str = "production"
