from langchain_openai import ChatOpenAI

from src.config.settings import get_settings


class LLMFactory:

    OPENROUTER_URL = "https://openrouter.ai/api/v1"
    OPENCODE_URL = "https://opencode.ai/zen/v1"
    NVIDIA_URL = "https://integrate.api.nvidia.com/v1"

    @staticmethod
    def planner():
        return ChatOpenAI(
            api_key=get_settings().OPENROUTER_API_KEY,
            base_url=LLMFactory.OPENROUTER_URL,
            model="nvidia/nemotron-3-super-120b-a12b:free",
            temperature=0.2,
            extra_body={
                "reasoning": {
                    "enabled": True
                }
            }
        )

    @staticmethod
    def email():
        return ChatOpenAI(
            api_key=get_settings().OPENCODE_API_KEY,
            base_url=LLMFactory.OPENCODE_URL,
            model="deepseek-v4-flash-free",
            temperature=0,
        )

    @staticmethod
    def jobs():
        return ChatOpenAI(
            api_key=get_settings().OPENCODE_API_KEY,
            base_url=LLMFactory.OPENCODE_URL,
            model="deepseek-v4-flash-free",
            temperature=0,
        )

    @staticmethod
    def events():
        return ChatOpenAI(
            api_key=get_settings().OPENCODE_API_KEY,
            base_url=LLMFactory.OPENCODE_URL,
            model="ling-3.0-flash-free",
            temperature=0,
        )

    @staticmethod
    def notification():
        return ChatOpenAI(
            api_key=get_settings().OPENCODE_API_KEY,
            base_url=LLMFactory.OPENCODE_URL,
            model="mimo-v2.5-free",
            temperature=0,
        )