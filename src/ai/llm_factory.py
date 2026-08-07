from typing import Any
from pydantic import SecretStr

from langchain_openai import ChatOpenAI

from src.config.settings import get_settings


class LLMFactory:

    def __init__(self, *, temperature : float) -> None:
        self._clients: list[ChatOpenAI] = []
        self._idx = 0

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

        self._clients = [
            ChatOpenAI(
                api_key=SecretStr(api_key),
                base_url=settings.OPENROUTER_URL,
                model="nvidia/nemotron-3-super-120b-a12b:free",
                temperature=temperature,
                extra_body={
                    "reasoning": {
                        "enabled": True,
                    }
                },
            )
            for api_key in api_keys
        ]

    def next_llm(self) -> ChatOpenAI:
        if not self._clients:
            raise RuntimeError("No LLM clients have been configured.")

        if self._idx >= self.get_clients_count():
            raise RuntimeError("All llms failed")

        llm = self._clients[self._idx]
        self._idx += 1
        return llm

    def get_clients_count(self) -> int:
        return len(self._clients)



class FailoverLLM:

    @staticmethod
    def get_structured_output_from_llm(input: Any, *, schema: Any, temperature: float, **kwargs: Any) -> Any:

        llms : LLMFactory = LLMFactory(temperature=temperature)

        for _ in range(llms.get_clients_count()):
            llm : ChatOpenAI = llms.next_llm()

            try:
                return llm.with_structured_output(schema=schema).invoke(input, **kwargs) # type: ignore

            except Exception:
                import traceback

                print("LLM FAILED:")
                traceback.print_exc()

                continue

        return None