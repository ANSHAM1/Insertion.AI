from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "InsertionAI"
    APP_VERSION: str = "0.1.0"

    DATABASE_URL: str

    OPENCODE_API_KEY: str = ""
    OPENROUTER_API_KEY: str = ""
    NVIDIA_API_KEY: str = ""

    GMAIL_CLIENT_ID: str = ""
    GMAIL_CLIENT_SECRET: str = ""

    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


@lru_cache
def get_settings():
    return Settings() # type: ignore