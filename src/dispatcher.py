import json
from abc import ABC, abstractmethod
from datetime import date
from typing import Any

from src.config.settings import get_settings
from src.config.state_manager import StateManager

from src.database.connection import SessionLocal
from src.database.enums import JobStatus

from src.database.repository import (DailyScheduleRepository, EventRepository, RssRepository, CollegeDriveRepository)
from src.database.models import DailySchedule, CollegeDrive

from src.agents.planner_agent.workflow import planner_graph
from src.agents.college_agent.workflow import college_graph



class InsertionAIDispatch(ABC):

    def __init__(self):
        self.db = SessionLocal()
        self.settings = get_settings()
        self.app_state = StateManager()

    @abstractmethod
    def invoke(self) -> dict[str, Any]:
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
                    "id"         : item.id,
                    "title"      : item.title,
                    "start_time" : item.start_time.strftime("%H:%M"),
                    "end_time"   : item.end_time.strftime("%H:%M"),
                    "completed"  : item.completed,
                    "note"       : item.note,
                }
                for item in sorted(data.items, key=lambda x: x.id)
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

        planner_graph.invoke(state) # type: ignore
        return self._helper(schedule_repo.get_schedule(date.today()))

    def update_item(self, task_id : int, completed: bool):

        schedule_repo = DailyScheduleRepository(self.db)

        schedule = schedule_repo.get_schedule(date.today())
        if schedule is None:
            raise ValueError("Schedule not found.")

        task = next((item for item in schedule.items if item.id == task_id), None)
        if task is None:
            raise ValueError("Task not found.")

        schedule_repo.update_item(task, { "completed": completed})

    def save_reflection(self, reflection : str):

        schedule_repo = DailyScheduleRepository(self.db)

        schedule = schedule_repo.get_schedule(date.today())
        if schedule is None:
            raise ValueError("Schedule not found.")

        schedule_repo.update_user_reflection(schedule, reflection)



class CollegeDispatch(InsertionAIDispatch):

    def _helper(self, drives: list[CollegeDrive]) -> dict[str, Any]:

        if not drives:
            return {"items": []}

        return {
            "items": [
                {
                    "id"               : drive.drive_ref_id,

                    "company"          : drive.company,
                    "role"             : drive.role,
                    "description"      : drive.description,

                    "employment_type"  : (drive.employment_type.value if drive.employment_type else None),
                    "recruitment_type" : (drive.recruitment_type.value if drive.recruitment_type else None),

                    "location"         : drive.location,
                    "salary"           : drive.salary,
                    "bond"             : drive.bond,

                    "apply_url"        : drive.apply_url,

                    "status"           : drive.status.value,

                    "drive_date"       : (drive.drive_date.isoformat() if drive.drive_date else None),

                    "report_time"      : (drive.report_time.strftime("%H:%M") if drive.report_time else None),

                    "venue"            : drive.venue,

                    "resume_tailored"  : drive.resume_tailored,
                    "resume_path"      : drive.resume_path,
                }
                for drive in sorted(drives, key=lambda x: (x.drive_date or date.max, x.company.lower()))
            ]
        } # type: ignore

    def invoke(self):

        repo = CollegeDriveRepository(self.db)

        latest_hist_id = self.app_state.GMAIL_STATE("college")
    

        state: dict[str, Any] = {
            "curr_date"      : date.today(),
            "app_state"      : self.app_state,

            "latest_hist_id" : latest_hist_id,

            "emails"         : [],
            "output"         : None,

            "drives_repo"    : repo,

            "prompt"         : "",
            "llm_failed"     : False,
        }

        college_graph.invoke(state)# type: ignore
        return self._helper(repo.get_all())

    def update_status(self, drive_ref_id: str, status: str) -> None:

        repo = CollegeDriveRepository(self.db)

        drive = repo.get(drive_ref_id)

        if drive is None:
            raise ValueError(f"Drive '{drive_ref_id}' not found.")

        drive.status = JobStatus(status)
        repo.update_status(drive)

    def remove_drive(self, drive_ref_id: str) -> None:
        repo = CollegeDriveRepository(self.db)

        drive = repo.get(drive_ref_id)

        if drive is None:
            raise ValueError(f"Drive '{drive_ref_id}' not found.")

        repo.delete(drive)
        repo.commit()




def planner(command: str, payload: dict[Any, Any]):
    app = PlannerDispatch()

    try:
        if command == "planner":
            return app.invoke()

        elif command == "planner_complete":
            app.update_item(
                payload["id"],
                payload["completed"],
            )
            return None

        elif command == "planner_reflection":
            app.save_reflection(
                payload["reflection"],
            )
            return None

        raise ValueError(f"Unknown planner command: {command}")

    finally:
        app.close()


def college(command: str, payload: dict[Any, Any]):
    app = CollegeDispatch()

    try:
        if command == "college":
            return app.invoke()

        elif command == "college_status":
            app.update_status(
                payload["drive_ref_id"],
                payload["status"],
            )
            return None

        elif command == "college_remove":
            app.remove_drive(
                payload["drive_ref_id"],
            )
            return None

        raise ValueError(f"Unknown college command: {command}")

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