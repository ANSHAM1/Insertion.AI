from typing import Any, TypedDict
from datetime import time, date
from langchain_core.prompt_values import PromptValue

from src.config.state_manager import StateManager

from src.database.repository import RssRepository, DailyScheduleRepository

from src.validators.planner_output import PlannerOutput



class PlannerState(TypedDict):
    curr_date      : date
    start_time     : time 
    end_time       : time

    app_state      : StateManager

    already_synced : bool

    rss_repo       : RssRepository
    schedule_repo  : DailyScheduleRepository

    prev_schedules : dict[str, dict[str, Any]]
    curr_schedule  : PlannerOutput | None

    template       : dict[str, Any]

    prompt         : PromptValue | None

    llm_failed     : bool