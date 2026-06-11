from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "TokenSave API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Allowed CORS origins
    # Can be a string "*" or comma-separated list of origins
    ALLOWED_ORIGINS: Union[str, List[str]] = "*"
    
    # Maximum file size (default 10 MB)
    MAX_FILE_SIZE_BYTES: int = 10 * 1024 * 1024
    
    # AI service configuration (could specify providers later, e.g. "openai", "gemini", etc.)
    AI_PROVIDER: str = "mock"
    
    # Cloudflare Turnstile Bot Protection Secret Key
    # Defaults to empty string (bypassed in development if not configured)
    TURNSTILE_SECRET_KEY: str = ""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    def get_allowed_origins(self) -> List[str]:
        if isinstance(self.ALLOWED_ORIGINS, str):
            if self.ALLOWED_ORIGINS == "*":
                return ["*"]
            return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]
        return self.ALLOWED_ORIGINS

settings = Settings()
