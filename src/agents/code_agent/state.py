from datetime import date, datetime
from typing import TypedDict

from langchain_core.prompt_values import PromptValue

from src.config.state_manager import StateManager

from src.database.models import CodingQuestion
from src.database.repository import CodingRepository

from src.fetcher.github.models import (GithubMetadata, GithubQuestion)
from src.fetcher.github.repository import GithubRepository


class CodingState(TypedDict):

    curr_date        : date
    timestamp        : datetime

    app_state        : StateManager

    coding_repo      : CodingRepository
    github_repo      : GithubRepository

    current_question : CodingQuestion | None

    github_question  : GithubQuestion | None
    github_metadata  : GithubMetadata | None

    language         : str | None

    source_code      : str | None

    github_path      : str | None

    prompt           : PromptValue

    llm_failed       : bool