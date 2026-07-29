from typing import Any
from datetime import timedelta, datetime

from src.database.models import DailySchedule, ScheduleItem

from src.graphs.scheduler.state import PlannerState, Route

from src.prompts.planner_prompt import planner_prompt
from src.prompts.repair_prompt import repair_prompt

from src.ai.llm_factor import LLMFactory
from src.response_models.planner_output import validate_schedule

from src.services.rss_service import generate_article



def from_database_node(state : PlannerState) -> dict[str, Any]:

    schedule_repo = state["schedule_repo"]
    event_repo    = state["event_repo"]

    prev_day_date = state["date"] - timedelta(days=1)

    return {
        "prev_schedule" : schedule_repo.get_schedule(prev_day_date),
        "events"        : event_repo.get_events(state["date"]),
    }



def build_prompt_node(state : PlannerState) -> dict[str, Any]:

    prompt = planner_prompt.invoke(
        {
            "today_date": state["date"],
            "current_time": datetime.now(),
            "daily_template": state["template"],
            "yesterday_schedule": state["prev_schedule"],
            "today_events": state["events"]
        }
    )

    return {
        "prompt":prompt
    }



def llm_inference_node(state : PlannerState) -> dict[str, Any]:

    llm = LLMFactory.planner()

    response = llm.invoke(state["prompt"])

    return {
        "raw_response": response.content
    }



def validation_node(state : PlannerState) -> dict[str, Any]:

    schedule = validate_schedule(state["raw_response"])

    if schedule is None:
        return {
            "curr_schedule": None
        }

    return {
        "curr_schedule": schedule
    }



def validation_router(state: PlannerState) -> Route:

    if state["curr_schedule"] is not None:
        return Route.SAVE

    if state["retries_left"] <= 0:
        return Route.FAILED

    return Route.REPAIR



def repair_prompt_node(state : PlannerState) -> dict[str, Any]:

    prompt = repair_prompt.invoke({
            "invalid_json": state["raw_response"]
        }
    )

    return {
        "prompt"       : prompt,
        "retries_left" : state["retries_left"] - 1
    }



def save_schedule_node(state: PlannerState) -> dict[None, None]:

    planner_output = state["curr_schedule"]

    schedule_repo = state["schedule_repo"]

    schedule = DailySchedule(
        schedule_date   = state["date"],
        user_reflection = None,
    )

    assert planner_output is not None    
    for item in planner_output.items:
        schedule.items.append(
            ScheduleItem(
                title      = item.title,
                start_time = item.start_time,
                end_time   = item.end_time,
                sort_order = item.sort_order,
                completed  = item.completed,
                note       = item.note,
            )
        )

    schedule_repo.add(schedule)

    return {}



def article_search_node(state : PlannerState) -> dict[None, None]:
            
    now = state["app_state"].now()
    last_sync = state["app_state"].RSS_STATE()

    if (last_sync and now - last_sync < state["app_state"].time_delta(24)):
        return {}

    generate_article(state["rss_repo"])

    state["app_state"].RSS_SYNC(now)

    return {}