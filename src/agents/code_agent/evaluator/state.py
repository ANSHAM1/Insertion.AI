from datetime import date, datetime
from typing import TypedDict

from langchain_core.prompt_values import PromptValue

from src.fetcher.github.models import Question, FrontendMetadata, AIMetadata


class GeneratorState(TypedDict):

    curr_date     : date
    timestamp     : datetime

    question      : Question
    solution      : str

    frontend_meta : FrontendMetadata

    metadata      : AIMetadata

    prompt        : PromptValue

    llm_failed    : bool