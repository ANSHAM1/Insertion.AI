import json
from abc import ABC, abstractmethod
from datetime import date
from typing import Any

from src.config.settings import get_settings
from src.config.state_manager import StateManager

from src.database.connection import SessionLocal

from src.database.repository import (DailyScheduleRepository, EventRepository, RssRepository)
from src.database.models import DailySchedule

from src.agents.planner_agent.workflow import planner_graph



class InsertionAIDispatch(ABC):

    def __init__(self):
        self.db = SessionLocal()
        self.settings = get_settings()
        self.app_state = StateManager()

    @abstractmethod
    def invoke(self):
        pass

    def close(self):
        self.db.close()



class PlannerDispatch(InsertionAIDispatch):

    def _helper(self, data: DailySchedule | None) -> Any:
        if data is None:
            return {"items": []}

        return {
            "items": [
                {
                    "title"      : item.title,
                    "start_time" : item.start_time.strftime("%H:%M"),
                    "end_time"   : item.end_time.strftime("%H:%M"),
                    "sort_order" : item.sort_order,
                    "completed"  : item.completed,
                    "note"       : item.note,
                }
                for item in sorted(data.items, key=lambda x: x.sort_order)
            ]
        } # type: ignore

    def invoke(self):

        schedule_repo = DailyScheduleRepository(self.db)

        last_sync = self.app_state.PLANNER_STATE()
        if last_sync and last_sync.date() == date.today():
             return self._helper(schedule_repo.get_schedule(date.today()))


        with open(self.settings.SCHEDULE_PATH, "r", encoding="utf-8") as file:
            template = json.load(file)

        state : dict[str, Any] = {
            "curr_date"      : date.today(),
            "already_synced" : False,

            "template"       : template,
            "app_state"      : self.app_state,

            "events"         : [],

            "prev_schedule"  : None,
            "curr_schedule"  : None,

            "rss_repo"       : RssRepository(self.db),
            "schedule_repo"  : schedule_repo,
            "event_repo"     : EventRepository(self.db),

            "prompt"         : "",
            "llm_failed"     : False,
        }

        result = planner_graph.invoke(state) # type: ignore

        return self._helper(result["curr_schedule"])

    def update_item(self, task_id : int, completed: bool):

        schedule_repo = DailyScheduleRepository(self.db)

        schedule = schedule_repo.get_schedule(date.today())
        if schedule is None:
            raise ValueError("Schedule not found.")

        task = next((item for item in schedule.items if item.sort_order == task_id), None)
        if task is None:
            raise ValueError("Task not found.")

        schedule_repo.update_item(task, { "completed": completed})

    def save_reflection(self, reflection : str):

        schedule_repo = DailyScheduleRepository(self.db)

        schedule = schedule_repo.get_schedule(date.today())
        if schedule is None:
            raise ValueError("Schedule not found.")

        schedule_repo.update_user_reflection(schedule, reflection)



def planner(_ : dict[Any, Any]):
    app = PlannerDispatch()

    try:
        return app.invoke()
    finally:
        app.close()


def planner_complete(payload : dict[Any, Any]):

    app = PlannerDispatch()

    try:
        app.update_item(payload["id"], payload["completed"])
        return None

    finally:
        app.close()

def planner_reflection(payload : dict[Any, Any]):

    app = PlannerDispatch()

    try:
        app.save_reflection(payload["reflection"])
        return None

    finally:
        app.close()

# from datetime import date, datetime
# import json

# from src.agents.job_agent.workflow import job_graph

# from src.config.settings import get_settings
# from src.config.state_manager import StateManager

# from src.database.connection import SessionLocal
# from src.database.repository import JobRepository


# db = SessionLocal()
# settings = get_settings()

# app_state = StateManager()



# latest_hist_id = app_state.GMAIL_STATE("college")

# with open(settings.RESUME_PATH, "r", encoding="utf-8") as resume_file:
#     resume_data = json.load(resume_file)

# state : object = {
#     "curr_date"       : date.today(),
#     "timestamp"       : datetime.now(),

#     "resume"          : resume_data,
#     "app_state"       : app_state,

#     "jobs"            : [],
#     "output"          : None,

#     "job_repo"        : JobRepository(db),

#     "prompt"          : "",
#     "llm_failed"      : False
# }


# for step in job_graph.stream(state):  # type: ignore
#     print("=" * 60)
#     print(step)