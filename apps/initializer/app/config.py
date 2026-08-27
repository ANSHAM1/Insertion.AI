from functools import lru_cache

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME             : str = "Insertion.AI"
    APP_VERSION          : str = "2.0.0"

    OPENROUTER_URL       : str

    OPENROUTER_API_KEY_1 : SecretStr
    OPENROUTER_API_KEY_2 : SecretStr
    OPENROUTER_API_KEY_3 : SecretStr
    OPENROUTER_API_KEY_4 : SecretStr

    OPENAI_API_KEY       : SecretStr

    model_config = SettingsConfigDict(
        env_file = ".env",
        extra    = "ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings() # type: ignore