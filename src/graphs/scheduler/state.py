from typing import TypedDict
from datetime import date

from src.database.models import Event, ReadingArticle, DailySchedule
from src.database.repository import RssRepository, DailyScheduleRepository, EventRepository


class PlannerState(TypedDict):
    date         : date

    rss_repo      : RssRepository
    schedule_repo : DailyScheduleRepository
    event_repo    : EventRepository

    events       : list[Event] | None
    article      : ReadingArticle | None
    schedule     : DailySchedule | None

    prompt       : str