from threading import Lock
from typing import Any
from pydantic import SecretStr

from langchain_openai import ChatOpenAI
from openai import ( APIConnectionError, APITimeoutError, InternalServerError, RateLimitError, OpenAIError )

from src.config.settings import get_settings


class LLMFactory:

    _clients: list[ChatOpenAI] = []
    _lock = Lock()
    _idx = 0
    _initialized = False

    @classmethod
    def _initialize(cls) -> None:
        if cls._initialized:
            return

        settings = get_settings()

        api_keys = [
            key.get_secret_value()
            for key in (
                settings.OPENROUTER_API_KEY_1,
                settings.OPENROUTER_API_KEY_2,
                settings.OPENROUTER_API_KEY_3,
                settings.OPENROUTER_API_KEY_4,
            )
            if key
        ]

        cls._clients = [
            ChatOpenAI(
                api_key=SecretStr(api_key),
                base_url=settings.OPENROUTER_URL,
                model="nvidia/nemotron-3-super-120b-a12b:free",
                temperature=0.2,
                extra_body={
                    "reasoning": {
                        "enabled": True,
                    }
                },
            )
            for api_key in api_keys
        ]

        cls._initialized = True

    @classmethod
    def next_llm(cls) -> ChatOpenAI:
        cls._initialize()

        if not cls._clients:
            raise RuntimeError("No LLM clients have been configured.")

        with cls._lock:             
            llm = cls._clients[cls._idx]
            cls._idx = (cls._idx + 1) % len(cls._clients)
            return llm

    @classmethod
    def get_clients_count(cls) -> int:
        cls._initialize()
        return len(cls._clients)



class FailoverLLM:

    @staticmethod
    def get_structured_output_from_llm(input: Any, *, schema: Any, **kwargs: Any) -> Any:

        clients_count = LLMFactory.get_clients_count()

        for _ in range(clients_count):
            llm : ChatOpenAI = LLMFactory.next_llm()

            try:
                return llm.with_structured_output(schema=schema).invoke(input, **kwargs) # type: ignore

            except ( RateLimitError, APITimeoutError, APIConnectionError, InternalServerError, OpenAIError ):
                continue

        return None