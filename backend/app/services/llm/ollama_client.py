import httpx
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta

from app.models.ollama import OllamaModelInfo, OllamaHealthStatus
from app.config.logging_setup import get_logger
from app.config.settings import get_settings


logger = get_logger(__name__)
settings = get_settings()


class OllamaConnectionError(Exception):
    """Custom exception for Ollama connection issues"""
    pass


class OllamaService:
    def __init__(self, base_url: str = settings.OLLAMA_API_URL_LOCAL):
        self.base_url = base_url.rstrip("/")
        self.client: Optional[httpx.AsyncClient] = None
        self._last_health_check: Optional[OllamaHealthStatus] = None
        self._health_check_cache_duration = timedelta(minutes=5)
        
    async def __aenter__(self):
        """Async context manager entry"""
        self.client = httpx.AsyncClient(
            timeout=httpx.Timeout(connect=5.0, read=10.0, write=5.0, pool=5.0),
            limits=httpx.Limits(max_connections=10, max_keepalive_connections=5)
        )
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.client:
            await self.client.aclose()
            
    async def _ensure_client(self):
        """Ensure client is initialized"""
        if not self.client:
            self.client = httpx.AsyncClient(
                timeout=httpx.Timeout(connect=5.0, read=10.0, write=5.0, pool=5.0),
                limits=httpx.Limits(max_connections=10, max_keepalive_connections=5)
            )
    
    async def get_models(self) -> List[OllamaModelInfo]:
        """
        Fetch all available models from Ollama server
        
        Returns:
            List of OllamaModelInfo objects
            
        Raises:
            OllamaConnectionError: If unable to connect or fetch models
        """
        await self._ensure_client()
        
        try:
            start_time = asyncio.get_event_loop().time()
            response = await self.client.get(f"{self.base_url}/api/tags")
            end_time = asyncio.get_event_loop().time()
            
            response.raise_for_status()
            data = response.json()
            
            models = []
            for model_data in data.get("models", []):
                try:
                    model = OllamaModelInfo(
                        name=model_data["name"],
                        size=model_data["size"],
                        digest=model_data["digest"],
                        modified_at=datetime.fromisoformat(
                            model_data["modified_at"].replace("Z", "+00:00")
                        )
                    )
                    models.append(model)
                except (KeyError, ValueError) as e:
                    logger.warning(f"Failed to parse model data {model_data}: {e}")
                    continue
                    
            logger.info(f"Successfully fetched {len(models)} models from Ollama in {(end_time - start_time)*1000:.2f}ms")
            return models
            
        except httpx.TimeoutException:
            raise OllamaConnectionError("Timeout while connecting to Ollama server")
        except httpx.ConnectError:
            raise OllamaConnectionError("Unable to connect to Ollama server")
        except httpx.HTTPStatusError as e:
            raise OllamaConnectionError(f"HTTP error from Ollama server: {e.response.status_code}")
        except Exception as e:
            logger.error(f"Unexpected error fetching models: {e}")
            raise OllamaConnectionError(f"Unexpected error: {str(e)}")
    
    async def health_check(self, use_cache: bool = True) -> OllamaHealthStatus:
        """
        Perform comprehensive health check of Ollama server
        
        Args:
            use_cache: Whether to use cached health check results if available
            
        Returns:
            OllamaHealthStatus object with health information
        """
        now = datetime.now()
        
        # Return cached result if still valid
        if (use_cache and self._last_health_check and 
            now - self._last_health_check.last_checked < self._health_check_cache_duration):
            return self._last_health_check
            
        await self._ensure_client()
        
        start_time = asyncio.get_event_loop().time()
        health_status = OllamaHealthStatus(
            is_healthy=False,
            last_checked=now
        )
        
        try:
            # Test basic connectivity with /api/tags endpoint
            response = await self.client.get(f"{self.base_url}/api/tags")
            end_time = asyncio.get_event_loop().time()
            
            response.raise_for_status()
            response_time_ms = (end_time - start_time) * 1000
            
            data = response.json()
            models = data.get("models", [])
            model_names = [model["name"] for model in models]
            
            health_status.is_healthy = True
            health_status.response_time_ms = response_time_ms
            health_status.available_models = model_names
            health_status.total_models = len(models)
            
            logger.info(f"Ollama health check passed: {len(models)} models available, response time: {response_time_ms:.2f}ms")
            
        except httpx.TimeoutException:
            health_status.error_message = "Connection timeout"
            logger.warning("Ollama health check failed: timeout")
        except httpx.ConnectError:
            health_status.error_message = "Connection refused"
            logger.warning("Ollama health check failed: connection refused")
        except httpx.HTTPStatusError as e:
            health_status.error_message = f"HTTP {e.response.status_code}"
            logger.warning(f"Ollama health check failed: HTTP {e.response.status_code}")
        except Exception as e:
            health_status.error_message = f"Unexpected error: {str(e)}"
            logger.error(f"Ollama health check failed with unexpected error: {e}")
            
        # Cache the result
        self._last_health_check = health_status
        return health_status
    
    async def is_model_available(self, model_name: str) -> bool:
        """
        Check if a specific model is available
        
        Args:
            model_name: Name of the model to check
            
        Returns:
            True if model is available, False otherwise
        """
        try:
            models = await self.get_models()
            return any(model.name == model_name for model in models)
        except OllamaConnectionError:
            return False
    
    async def generate_completion(self, model: str, prompt: str, **kwargs) -> Dict[str, Any]:
        """
        Generate completion using Ollama
        
        Args:
            model: Model name to use
            prompt: The prompt text
            **kwargs: Additional parameters for the generation
            
        Returns:
            Response from Ollama API
            
        Raises:
            OllamaConnectionError: If unable to connect or generate completion
        """
        await self._ensure_client()
        
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            **kwargs
        }
        
        try:
            response = await self.client.post(
                f"{self.base_url}/api/generate",
                json=payload
            )
            response.raise_for_status()
            return response.json()
            
        except httpx.TimeoutException:
            raise OllamaConnectionError("Timeout during completion generation")
        except httpx.ConnectError:
            raise OllamaConnectionError("Unable to connect to Ollama server")
        except httpx.HTTPStatusError as e:
            raise OllamaConnectionError(f"HTTP error during completion: {e.response.status_code}")
        except Exception as e:
            raise OllamaConnectionError(f"Unexpected error during completion: {str(e)}")


# Singleton instance
_ollama_service: Optional[OllamaService] = None

async def get_ollama_service() -> OllamaService:
    """Dependency injection for Ollama service"""
    global _ollama_service
    if _ollama_service is None:
        _ollama_service = OllamaService()
    return _ollama_service

async def cleanup_ollama_service():
    """Cleanup function to close Ollama service connections"""
    global _ollama_service
    if _ollama_service and _ollama_service.client:
        await _ollama_service.client.aclose()
        _ollama_service = None
