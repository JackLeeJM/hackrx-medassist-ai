"""
Security utilities and authentication handlers.
"""

from typing import Optional, Annotated
from fastapi import HTTPException, Header, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config.logging_setup import get_logger
from app.config.settings import get_settings

logger = get_logger(__name__)
settings = get_settings()

bearer_scheme = HTTPBearer(
    bearerFormat="API_KEY",
    scheme_name="Bearer Token",
    description="Enter your API key as the bearer token",
    auto_error=False  # We'll handle errors manually for better control
)


class SecurityError(HTTPException):
    """Custom security exception."""
    
    def __init__(self, detail: str = "Authentication failed"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


async def verify_api_key_bearer(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme)
) -> str:
    """
    Verify API key from Authorization Bearer header.
    
    Args:
        credentials: HTTP Authorization credentials
        
    Returns:
        str: The validated API key
        
    Raises:
        SecurityError: If API key is invalid or missing
    """
    if not credentials or credentials.credentials != settings.API_KEY:
        logger.warning(f"Invalid bearer token authentication attempt")
        raise SecurityError("Invalid or missing API key")
    
    return credentials.credentials


async def verify_api_key(
    x_api_key: Annotated[Optional[str], Header()] = None
) -> str:
    """
    Verify API key from custom X-API-Key header.
    
    Args:
        x_api_key: API key from X-API-Key header
        
    Returns:
        str: The validated API key
        
    Raises:
        SecurityError: If API key is invalid or missing
    """
    if not x_api_key or x_api_key != settings.API_KEY:
        logger.warning(f"Invalid X-API-Key authentication attempt")
        raise SecurityError("Invalid or missing API key")
    
    return x_api_key
