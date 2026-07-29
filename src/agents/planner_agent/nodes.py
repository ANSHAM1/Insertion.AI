from typing import Any
from datetime import timedelta

from src.database.models import DailySchedule, ScheduleItem

from src.agents.planner_agent.state import PlannerState

from src.prompts.planner_prompt import planner_prompt, repair_prompt

from src.ai.llm_factor import LLMFactory
from src.validators.planner_output import validate_schedule

from src.services.rss_service import generate_article




def load_context_node(state : PlannerState) -> dict[str, Any]:

    now = state["app_state"].now()
    last_sync = state["app_state"].PLANNER_STATE()

    if last_sync is not None and last_sync.date() == now.date():
        return {
            "already_synced": True,
        }

    schedule_repo = state["schedule_repo"]
    event_repo    = state["event_repo"]

    prev_day_date = state["curr_date"] - timedelta(days=1)

    return {
        "prev_schedule"  : schedule_repo.get_schedule(prev_day_date),
        "events"         : event_repo.get_events(state["curr_date"]),
        "already_synced" : False
    }



def planner_router(state: PlannerState) -> str:
    if state["already_synced"]:
        return "end"

    return "prompt"



def build_prompt_node(state : PlannerState) -> dict[str, Any]:

    prompt = planner_prompt.invoke(
        {
            "today_date": state["curr_date"],
            "current_time": state["app_state"].now(),
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



def validation_router(state: PlannerState) -> str:

    if state["curr_schedule"] is not None:
        return "save"

    if state["retries_left"] <= 0:
        return "failed"

    return "repair"



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
        schedule_date   = state["curr_date"],
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

    state["app_state"].PLANNER_SYNC(state["app_state"].now())

    return {}



def article_search_node(state : PlannerState) -> dict[None, None]:
            
    now = state["app_state"].now()
    last_sync = state["app_state"].RSS_STATE()

    if last_sync is not None and last_sync.date() == now.date():
        return {}

    generate_article(state["rss_repo"])

    state["app_state"].RSS_SYNC(now)

    return {}