import json
from datetime import date, time
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

    def get_today_free_window(self, curr_date: date, current_time: time, weekly_free_time: dict[str, dict[str, str]]) -> tuple[time, time]:

        day = curr_date.strftime("%A").lower()

        window = weekly_free_time[day]

        configured_start = time.fromisoformat(window["start_time"])
        configured_end = time.fromisoformat(window["end_time"])

        start_time = max(current_time, configured_start)
        end_time = (time(23, 59, 59) if configured_end == time(0, 0) else configured_end)

        return start_time, end_time


    def invoke(self):

        schedule_repo = DailyScheduleRepository(self.db)

        with open(self.settings.SCHEDULE_PATH, "r", encoding="utf-8") as file:
            template = json.load(file)

        planner_template = {
            "goal": template["goal"],
            "topics": template["topics"],
            "daily_practice_already_established": (
                template["daily_practice_already_established"]
            ),
        }

        now = self.app_state.local_now()
        curr_date = now.date()

        start_time, end_time = self.get_today_free_window(
            curr_date=curr_date,
            current_time=now.time().replace(microsecond=0),
            weekly_free_time=template["weekly_free_time"],
        )


        state : dict[str, Any] = {
            "curr_date"      : curr_date,

            "start_time"     : start_time,
            "end_time"       : end_time,

            "app_state"      : self.app_state,

            "already_synced" : False,

            "rss_repo"       : RssRepository(self.db),
            "schedule_repo"  : schedule_repo,

            "prev_schedules" : {},

            "curr_schedule"  : None,

            "template"       : planner_template,

            "prompt"         : None,

            "llm_failed"     : False,
        }

        planner_graph.invoke(state) # type: ignore

        today_schedule = schedule_repo.get_schedule(curr_date)

        return self._helper([today_schedule] if today_schedule else [])


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
