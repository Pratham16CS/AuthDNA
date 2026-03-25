from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    appwrite_endpoint: str = "https://cloud.appwrite.io/v1"
    appwrite_project_id: str = ""
    appwrite_api_key: str = ""
    appwrite_database_id: str = "authdna_db"
    admin_secret: str = "change-me"
    webhook_signing_secret: str = "whsec_change_me"
    mistral_api_key: Optional[str] = None
    environment: str = "development"
    allowed_origins: str = "http://localhost:5173,http://localhost:8080"
    free_rate_limit: int = 100
    pro_rate_limit: int = 1000
    enterprise_rate_limit: int = 10000


settings = Settings()