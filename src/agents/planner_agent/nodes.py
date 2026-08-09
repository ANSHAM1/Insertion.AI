from typing import Any
from datetime import timedelta

from src.database.models import DailySchedule, ScheduleItem

from src.agents.planner_agent.state import PlannerState

from src.prompts.planner_prompt import planner_prompt

from src.ai.llm_factory import FailoverLLM
from src.validators.planner_output import PlannerOutput

from src.services.rss_service import generate_article



def compact_week_schedule(schedules: list[DailySchedule]) -> dict[str, dict[str, Any]]:

    result: dict[str, dict[str, Any]] = {}

    for schedule in schedules:

        day = schedule.schedule_date.strftime("%A").lower()

        completed: list[str] = []
        unfinished: list[str] = []

        for item in schedule.items:

            if item.completed:
                completed.append(item.title)
            else:
                unfinished.append(item.title)

        result[day] = {
            "completed": completed,
            "unfinished": unfinished,
            "notes": schedule.user_reflection or "",
        }

    return result



def load_context_node(state : PlannerState) -> dict[str, Any]:

    now = state["app_state"].now()
    last_sync = state["app_state"].PLANNER_STATE()

    if last_sync is not None and last_sync.date() == now.date():
        return {
            "already_synced": True,
        }

    schedule_repo = state["schedule_repo"]

    schedules = schedule_repo.get_schedule_range(
        state["curr_date"] - timedelta(days=state["curr_date"].weekday()),
        state["curr_date"] - timedelta(days=1),
    )

    return {
        "prev_schedules"  : compact_week_schedule(schedules),
        "already_synced" : False
    }



def planner_router(state: PlannerState) -> str:
    if state["already_synced"]:
        return "end"

    return "prompt"



def build_prompt_node(state : PlannerState) -> dict[str, Any]:

    prompt = planner_prompt.invoke(
        {
            "curr_day" : state["curr_date"].strftime("%A").lower(),
            "start_time": state["start_time"],
            "end_time": state["end_time"],
            "my_template": state["template"],
            "prev_schedules": state["prev_schedules"]
        }
    )

    return {
        "prompt":prompt
    }



def llm_inference_node(state : PlannerState) -> dict[str, Any]:

    response = FailoverLLM.get_structured_output_openai_5_6_lune(state["prompt"], schema=PlannerOutput, temperature=0.2)

    if response is None:
        return {
            "llm_failed" : True
        }

    return {
        "curr_schedule" : response,
        "llm_failed"   : False
    }



def validation_router(state: PlannerState) -> str:

    if state["llm_failed"]:
        return "failed"

    return "save"



def save_schedule_node(state: PlannerState) -> dict[str, Any]:

    planner_output = state["curr_schedule"]
    assert planner_output is not None

    schedule = DailySchedule(
        schedule_date=state["curr_date"],
        user_reflection=None,
    )

    for item in planner_output.items:
        schedule.items.append(
            ScheduleItem(
                title=item.title,
                start_time=item.start_time,
                end_time=item.end_time,
                completed=False,
                note=item.note,
            )
        )

    try:
        state["schedule_repo"].add(schedule)
        state["schedule_repo"].commit()
        
        state["app_state"].PLANNER_SYNC(state["app_state"].now())

    except Exception:
        state["schedule_repo"].rollback()
        raise

    return {}



def article_search_node(state : PlannerState) -> dict[str, Any]:
            
    now = state["app_state"].now()
    last_sync = state["app_state"].RSS_STATE()

    if last_sync is not None and last_sync.date() == now.date():
        return {}

    generate_article(state["rss_repo"])

    state["app_state"].RSS_SYNC(now)

    return {}