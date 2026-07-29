from functools import lru_cache
from pathlib import Path

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME           : str = "InsertionAI"
    APP_VERSION        : str = "1.0.0"

    DATABASE_URL       : str

    OPENCODE_API_KEY   : SecretStr
    OPENROUTER_API_KEY : SecretStr
    NVIDIA_API_KEY     : SecretStr

    ADZUNA_APP_ID      : str = ""
    ADZUNA_APP_KEY     : str = ""

    GMAIL_SECRETS_DIR  : Path

    SYNC_DATA_PATH     : Path
    SCHEDULE_PATH      : Path

    LOG_LEVEL          : str = "INFO"

    model_config = SettingsConfigDict(
        env_file = ".env",
        extra    = "ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings() # type: ignore