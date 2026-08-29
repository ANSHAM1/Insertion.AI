from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME             : str = "Insertion.AI"
    APP_VERSION          : str = "1.0.0"

    DATABASE_URL         : str


    model_config = SettingsConfigDict(
        env_file = ".env",
        extra    = "ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings() # type: ignore