from typing import TypedDict
from datetime import date

from langchain_core.prompt_values import PromptValue

from src.config.state_manager import StateManager
from src.database.repository import CollegeDriveRepository

from src.fetcher.gmail.models import ParsedEmail
from src.validators.college_output import CollegeDriveOutput



class CollegeState(TypedDict):
    curr_date        : date

    app_state        : StateManager

    latest_hist_id   : str

    emails           : list[ParsedEmail] 
    output           : CollegeDriveOutput

    drives_repo      : CollegeDriveRepository

    prompt           : PromptValue

    llm_failed       : bool