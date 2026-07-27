from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME           : str = "InsertionAI"
    APP_VERSION        : str = "0.1.0"

    DATABASE_URL       : str

    OPENCODE_API_KEY   : str = ""
    OPENROUTER_API_KEY : str = ""
    NVIDIA_API_KEY     : str = ""

    GMAIL_SECRETS_DIR  : Path = Path("secrets")

    GMAIL_SYNC_DATA    : Path = Path("data/app_states")

    LOG_LEVEL          : str = "INFO"

    model_config = SettingsConfigDict(
        env_file = ".env",
        extra    = "ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings() # type: ignore