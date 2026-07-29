from typing import TypedDict
from datetime import datetime
from enum import Enum

from src.config.state_manager import StateManager

from src.database.models import Event, ReadingArticle, DailySchedule
from src.database.repository import RssRepository, DailyScheduleRepository, EventRepository

from src.response_models.planner_output import PlannerOutput



class Route(str, Enum):
    SAVE   = "SAVE"
    REPAIR = "REPAIR"
    FAILED = "FAILED"



class PlannerState(TypedDict):
    date          : datetime

    app_state     : StateManager

    retries_left  : int

    rss_repo      : RssRepository
    schedule_repo : DailyScheduleRepository
    event_repo    : EventRepository

    events        : list[Event] | None
    article       : ReadingArticle | None

    prev_schedule : DailySchedule | None
    curr_schedule : PlannerOutput | None

    template      : object

    prompt        : str
    raw_response  : str

    route         : Route