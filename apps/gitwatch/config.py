from functools import lru_cache
from pathlib import Path

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME             : str = "Insertion.AI"
    APP_VERSION          : str = "1.0.0"

    USER_NAME            : str

    DATABASE_URL         : str

    OPENROUTER_URL       : str

    OPENROUTER_API_KEY_1 : SecretStr
    OPENROUTER_API_KEY_2 : SecretStr
    OPENROUTER_API_KEY_3 : SecretStr
    OPENROUTER_API_KEY_4 : SecretStr

    OPENAI_API_KEY       : SecretStr

    GITHUB_TOKEN         : str
    
    GITHUB_OWNER         : str
    GITHUB_REPO          : str
    GITHUB_BRANCH        : str = "main"

    ZONE_INFO            : str

    SYNC_DATA_PATH       : Path
    
    SCHEDULE_PATH        : Path
    RESUME_PATH          : Path
    JOB_SEARCH_PATH      : Path

    DAILY_QUESTION_GENERATION_COUNT : int
    DAILY_JON_SEARCH_LIMIT          : int

    model_config = SettingsConfigDict(
        env_file = ".env",
        extra    = "ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings() # type: ignore