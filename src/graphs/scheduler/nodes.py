from typing import Any
from .state import PlannerState


def database_node(state: PlannerState) -> dict[str, Any]:
    rss_repo      = state["rss_repo"]
    schedule_repo = state["schedule_repo"]
    event_repo    = state["event_repo"]

    return {
        "article"  : rss_repo.get_random_article(),
        "schedule" : schedule_repo.get_schedule(state["date"]),
        "events"   : event_repo.get_events(state["date"]),
    }

