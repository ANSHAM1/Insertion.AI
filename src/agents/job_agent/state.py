from typing import Any, TypedDict
from datetime import date, datetime
from langchain_core.prompt_values import PromptValue

from src.config.state_manager import StateManager

from src.fetcher.job.models import JobClass
from src.database.repository import JobRepository

from src.validators.job_output import JobOutput



class JobState(TypedDict):
    curr_date        : date
    timestamp        : datetime

    resume           : dict[str, Any]

    app_state        : StateManager

    jobs             : list[JobClass] 
    output           : JobOutput

    job_repo         : JobRepository

    prompt           : PromptValue
    llm_failed       : bool