from datetime import date, datetime
from typing import TypedDict

from langchain_core.prompt_values import PromptValue

from src.fetcher.github.models import Question, FrontendMetadata, Metadata
from src.validators.code_output import AIMetadataOutput

from src.database.repository import CodingRepository


class EvaluatorState(TypedDict):

    curr_date      : date
    timestamp      : datetime

    question       : Question
    generated_date : date
    
    solution       : str

    code_repo      : CodingRepository

    frontend_meta  : FrontendMetadata
    ai_metadata    : AIMetadataOutput | None

    metadata       : Metadata | None

    prompt         : PromptValue
    terminate      : bool

    uploaded       : bool