from typing import Any
from .state import PlannerState


def database_node(state: PlannerState) -> dict[str, Any]:
    schedule_repo = state["schedule_repo"]
    event_repo    = state["event_repo"]

    return {
        "schedule" : schedule_repo.get_schedule(state["date"]),
        "events"   : event_repo.get_events(state["date"]),
    }