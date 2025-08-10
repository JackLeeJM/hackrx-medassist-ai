from typing import List
from functools import lru_cache
from pydantic import computed_field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv, find_dotenv


load_dotenv(find_dotenv(".env"))


class Settings(BaseSettings):

    # Project details
    PROJECT_NAME: str
    PROJECT_DESC: str
    API_V1_STR: str = "/api/v1"

    # Auth
    API_KEY: str
    BEARER_TOKEN_NAME: str = "Bearer"

    # CORS
    ALLOWED_ORIGINS: List[str]

    # Environment
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"

    # Groq
    GROQ_API_KEY: str
    GROQ_API_URL: str
    GROQ_MODEL_REASONING: str
    GROQ_MODEL_CHAT: str

    # Ollama
    OLLAMA_MODEL: str
    OLLAMA_LOCALHOST: str
    OLLAMA_HOST: str
    OLLAMA_PORT: int

    @computed_field
    @property
    def OLLAMA_API_URL(self) -> str:
        return f"http://{self.OLLAMA_HOST}:{self.OLLAMA_PORT}/"
    
    @computed_field
    @property
    def OLLAMA_API_URL_LOCAL(self) -> str:
        return f"http://{self.OLLAMA_LOCALHOST}:{self.OLLAMA_PORT}/"
    
    @field_validator("API_KEY")
    @classmethod
    def validate_api_key(cls, v: str) -> str:
        if not v or len(v) < 16:
            raise ValueError("API_KEY must be at least 16 characters long for security")
        return v
    
    @field_validator("ALLOWED_ORIGINS")
    @classmethod
    def validate_origins(cls, v: List[str]) -> List[str]:
        if not v:
            return ["http://localhost:3000"]  # Default for development
        return v
    
    @computed_field
    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() in ("production", "hackathon")
    
    @computed_field
    @property
    def cors_allow_credentials(self) -> bool:
        return not self.is_production
    
    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()
