from datetime import date, datetime
from typing import TypedDict

from langchain_core.prompt_values import PromptValue

from src.config.state_manager import StateManager

from src.fetcher.github.models import Question


class GeneratorState(TypedDict):

    curr_date     : date
    timestamp     : datetime

    app_state     : StateManager

    questions     : list[Question]
    old_questions : list[Question]

    user_prompt   : PromptValue
    prompt        : PromptValue

    terminate     : bool