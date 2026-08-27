from functools import lru_cache

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class EnvironmentConfig(BaseSettings):
    APP_NAME             : str = "Insertion.AI-llm"
    APP_VERSION          : str = "1.0.0"

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
def Configs() -> EnvironmentConfig:
    return EnvironmentConfig() # type: ignore