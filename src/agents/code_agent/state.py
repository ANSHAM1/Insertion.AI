from typing import TypedDict
from datetime import date
from langchain_core.prompt_values import PromptValue

from src.config.state_manager import StateManager
from src.database.models import ScheduleItem

from src.database.repository import DailyScheduleRepository

# from src.validators.planner_output import PlannerOutput



class CodeState(TypedDict):
    curr_date        : date

    app_state        : StateManager

    latest_hist_id   : str
 
    # output           : PlannerOutput

    schedule_items   : list[ScheduleItem]
    prompt           : PromptValue

    llm_failed       : bool