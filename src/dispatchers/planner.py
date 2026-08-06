import json
from datetime import date, timedelta
from typing import Any

from src.database.repository import DailyScheduleRepository, RssRepository
from src.database.models import DailySchedule

from src.agents.planner_agent.workflow import planner_graph

from .base import InsertionAIDispatch


class PlannerDispatch(InsertionAIDispatch):

    def _helper(self, schedules: list[DailySchedule]) -> dict[str, Any]:

        return {
            "days": [
                {
                    "date": schedule.schedule_date.isoformat(),
                    "items": [
                        {
                            "id": item.id,
                            "title": item.title,
                            "start_time": item.start_time.strftime("%H:%M"),
                            "end_time": item.end_time.strftime("%H:%M"),
                            "completed": item.completed,
                            "note": item.note,
                        }
                        for item in sorted(schedule.items, key=lambda x: x.id)
                    ],
                }
                for schedule in sorted(
                    schedules,
                    key=lambda x: x.schedule_date,
                )
            ]
        }

    def invoke(self):

        schedule_repo = DailyScheduleRepository(self.db)

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
            "prompt"         : "",
            "llm_failed"     : False,
        }

        planner_graph.invoke(state) # type: ignore

        today = date.today()
        monday = today - timedelta(days=today.weekday())

        schedules = [
            schedule_repo.get_schedule(day)
            for day in (
                monday + timedelta(days=i)
                for i in range((today - monday).days + 1)
            )
        ]

        return self._helper(
            [s for s in schedules if s is not None]
        )


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
