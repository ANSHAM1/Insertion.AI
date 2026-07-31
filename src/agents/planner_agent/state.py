from typing import Any, TypedDict
from datetime import date
from langchain_core.prompt_values import PromptValue

from src.config.state_manager import StateManager

from src.database.models import Event, DailySchedule
from src.database.repository import RssRepository, DailyScheduleRepository, EventRepository

from src.validators.planner_output import PlannerOutput



class PlannerState(TypedDict):
    curr_date      : date

    app_state      : StateManager

    already_synced : bool

    rss_repo       : RssRepository
    schedule_repo  : DailyScheduleRepository
    event_repo     : EventRepository

    events         : list[Event]

    prev_schedule  : DailySchedule | None
    curr_schedule  : PlannerOutput | None

    template       : dict[str, Any]

    prompt         : PromptValue

    llm_failed     : bool