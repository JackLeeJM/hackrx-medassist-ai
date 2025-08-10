import logging
from typing import Dict, Any
from fastapi import Request, Depends

from app.core.security import verify_api_key
from app.config.settings import get_settings
from app.services.llm.ollama_client import get_ollama_service

__all__ = ["verify_api_key", "get_settings", "get_ollama_service"]
