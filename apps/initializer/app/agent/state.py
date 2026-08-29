from typing import Any, TypedDict

from langchain_core.prompt_values import PromptValue

# from src.validators.planner_output import PlannerOutput




class PlannerState(TypedDict):
    
    already_synced : bool

    prev_schedules : dict[str, dict[str, Any]]
    curr_schedule  : PlannerOutput | None

    template       : dict[str, Any]

    prompt         : PromptValue | None

    llm_failed     : bool