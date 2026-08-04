from typing import Any, TypedDict
from datetime import date, datetime
from langchain_core.prompt_values import PromptValue

from src.config.state_manager import StateManager

from src.fetcher.hirebase.model import JobModel
from src.database.repository import JobRepository

from src.validators.Hirebase_output import JobModelOutput



class JobState(TypedDict):
    curr_date        : date
    timestamp        : datetime

    resume           : dict[str, Any]

    app_state        : StateManager

    jobs             : list[JobModel] 
    output           : JobModelOutput

    job_repo         : JobRepository

    prompt           : PromptValue
    terminate        : bool