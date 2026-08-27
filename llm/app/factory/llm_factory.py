from typing import Any
from pydantic import SecretStr

from langchain_openai import ChatOpenAI

from app.config import Configs
from app.schemas import LLMRequest, LLMExecutionResult


class LLMFactory:

    def __init__(self, *, model: str, temperature: float, reasoning: bool) -> None:
        self._clients: list[ChatOpenAI] = []
        self._idx = 0


        api_keys = [
            key.get_secret_value()
            for key in (
                Configs().OPENROUTER_API_KEY_1,
                Configs().OPENROUTER_API_KEY_2,
                Configs().OPENROUTER_API_KEY_3,
                Configs().OPENROUTER_API_KEY_4,
            )
            if key
        ]

        self._clients = [
            ChatOpenAI(
                api_key=SecretStr(api_key),
                base_url=Configs().OPENROUTER_URL,
                model=model,
                temperature=temperature,
                extra_body={
                    "reasoning": {
                        "enabled": reasoning,
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

    def get_attempts_count(self) -> int:
        return self._idx



class LLM:

    @staticmethod
    def _execute(llm: ChatOpenAI, request: LLMRequest) -> Any:

        if request.response_schema is not None:
            return llm.with_structured_output( # type: ignore
                schema=request.response_schema,
                method="json_schema",
                strict=True,
            ).invoke(request.prompt, **request.kwargs)

        return llm.invoke(request.prompt, **request.kwargs)


    @staticmethod
    def OpenRouter(request: LLMRequest) -> LLMExecutionResult:

        llms = LLMFactory(model=request.llm_model, temperature=request.temperature, reasoning=request.reasoning)

        last_error: str | None = None
        attempts = 0

        for _ in range(llms.get_clients_count()):

            attempts += 1
            llm: ChatOpenAI = llms.next_llm()

            try:
                result = LLM._execute(llm=llm, request=request)

                return LLMExecutionResult(
                    success=True,
                    response=result,
                    provider_attempts=attempts
                )

            except Exception as exc:
                last_error = str(exc)

        return LLMExecutionResult(
            success=False,
            error=last_error or "All LLM providers failed",
            provider_attempts=attempts
        )

    @staticmethod
    def OpenAI(request: LLMRequest) -> LLMExecutionResult:

        try:
            llm = ChatOpenAI(model=request.llm_model, api_key=Configs().OPENAI_API_KEY, temperature=request.temperature)

            result = LLM._execute(llm=llm, request=request)

            return LLMExecutionResult(
                success=True,
                response=result,
                provider_attempts=1
            )

        except Exception as exc:

            return LLMExecutionResult(
                success=False,
                error=str(exc),
                provider_attempts=1
            )