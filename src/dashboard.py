from datetime import datetime, timedelta
from typing import Any
from sqlalchemy import Integer, cast, func, select

from src.database.connection import SessionLocal
from src.database.models import DailySchedule, ScheduleItem



class DashboardDispatch:

    def __init__(self):
        self.db = SessionLocal()

    def _helper(self, rows : list[tuple[str, int, int]]) -> list[dict[str, Any]]:
        return [
            {
                "date" : row[0],
                "num_tasks" : row[1],
                "completed_tasks" : row[2]
            }
            for row in rows
        ]

    def last_thirty_days_progress(self) -> list[dict[str, Any]]:
        rows = self.db.execute(
                select(
                    DailySchedule.schedule_date.label("date"), 
                    func.count(ScheduleItem.id).label("num_tasks"), 
                    func.coalesce(
                        func.sum(cast(ScheduleItem.completed, Integer)), 0
                    ).label("completed_tasks")
                    )
                .select_from(DailySchedule)
                .outerjoin(ScheduleItem, DailySchedule.schedule_date == ScheduleItem.schedule_date)
                .where(DailySchedule.generated_at >= datetime.now() - timedelta(days=30))
                .group_by(DailySchedule.schedule_date)
                .order_by(DailySchedule.schedule_date)
            ).all()

        return self._helper([tuple(row) for row in rows])

    def close(self):
        self.db.close()




def dashboard(command: str, _: dict[Any, Any]) -> dict[str, Any]:
    dd = DashboardDispatch()

    try:
        progress = dd.last_thirty_days_progress()

        return {
            "last_thirty_days_progress": progress,
        }

    finally:
        dd.close()