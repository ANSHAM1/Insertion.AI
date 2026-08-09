from datetime import datetime, timedelta, date, timezone, time
from typing import Any
from sqlalchemy import Integer, Date, cast, case, func, select

from src.database.connection import SessionLocal
from src.database.models import DailySchedule, ScheduleItem, ReadingArticle, Job, CodeSolution, CodingStatus



class DashboardDispatch:

    def __init__(self):
        self.db = SessionLocal()



    def last_thirty_days_progress(self) -> list[dict[str, Any]]:
        today = date.today()
        start = today - timedelta(days=29)

        rows = self.db.execute(
            select(
                DailySchedule.schedule_date.label("date"),
                func.count(ScheduleItem.id).label("num_tasks"),
                func.coalesce(
                    func.sum(cast(ScheduleItem.completed, Integer)),
                    0
                ).label("completed_tasks"),
            )
            .select_from(DailySchedule)
            .outerjoin(
                ScheduleItem,
                DailySchedule.schedule_date == ScheduleItem.schedule_date
            )
            .where(
                DailySchedule.schedule_date >= start,
                DailySchedule.schedule_date <= today,
            )
            .group_by(
                DailySchedule.schedule_date
            )
            .order_by(
                DailySchedule.schedule_date
            )
        ).all()

        progress = {
            row.date: {
                "num_tasks": row.num_tasks,
                "completed_tasks": row.completed_tasks,
            }
            for row in rows
        }

        result: list[dict[str, Any]] = []

        current = start

        while current <= today:
            data = progress.get(
                current,
                {
                    "num_tasks": 0,
                    "completed_tasks": 0,
                }
            )

            result.append(
                {
                    "date": current.isoformat(),
                    **data,
                }
            )

            current += timedelta(days=1)

        return result
    
    def schedule_streaks(self) -> dict[str, Any]:
        rows = self.db.execute(
            select(
                DailySchedule.schedule_date.label("date"),
                func.count(ScheduleItem.id).label("num_tasks"),
                func.coalesce(func.sum(cast(ScheduleItem.completed, Integer)), 0).label("completed_tasks"),
            )
            .select_from(DailySchedule)
            .outerjoin(ScheduleItem, DailySchedule.schedule_date == ScheduleItem.schedule_date)
            .group_by(DailySchedule.schedule_date)
            .order_by(DailySchedule.schedule_date)
        ).all()
    
        current = best = 0
        prev_date = None

        for row in rows:
            perfect_day = row.num_tasks > 0 and row.completed_tasks == row.num_tasks
            contiguous = prev_date is not None and row.date == prev_date + timedelta(days=1)
    
            if perfect_day:
                current = current + 1 if contiguous else 1
            else:
                current = 0
    
            best = max(best, current)
            prev_date = row.date
    
        return {"current_streak": current, "best_streak": best}



    def reading_overview(self) -> dict[str, Any]:
        row = self.db.execute(
            select(
                func.count(ReadingArticle.id).label("total_articles"),
                func.coalesce(func.sum(cast(ReadingArticle.is_read, Integer)), 0).label("read_articles"),
            )
        ).one()
    
        total, read = row.total_articles, row.read_articles
    
        return {
            "total_articles": total,
            "read_articles": read
        }
    
    def top_reading_sources(self, limit: int = 3) -> list[dict[str, Any]]:
        rows = self.db.execute(
            select(
                ReadingArticle.source,
                func.count(ReadingArticle.id).label("total"),
                func.coalesce(func.sum(cast(ReadingArticle.is_read, Integer)), 0).label("read"),
            )
            .group_by(ReadingArticle.source)
            .order_by(func.count(ReadingArticle.id).desc())
            .limit(limit)
        ).all()
    
        return [
            {
                "source": row.source,
                "total_articles": row.total,
                "read_articles": row.read
            }
            for row in rows
        ]



    def job_match_quality_by_resume(self) -> list[dict[str, Any]]:
        rows = (
            self.db.execute(
                select(
                    Job.matched_resume.label("resume"),
                    func.count(Job.id).label("total_jobs"),
                    func.avg(Job.matched_percentage).label("avg_match_percentage"),
                )
                .where(Job.matched_resume.is_not(None))
                .group_by(Job.matched_resume)
                .order_by(func.count(Job.id).desc())
            )
            .all()
        )

        return [
            {
                "resume": row.resume,
                "total_jobs": row.total_jobs,
                "avg_match_percentage": round(row.avg_match_percentage or 0, 2),
            }
            for row in rows
        ]
 
    def job_match_distribution(self, buckets: int = 4) -> list[dict[str, Any]]:
        ntile = func.ntile(buckets).over(order_by=Job.matched_percentage.desc()).label("bucket")
 
        subq = (
            select(Job.id, Job.matched_percentage, ntile)
            .where(Job.matched_percentage.is_not(None))
            .subquery()
        )
 
        rows = self.db.execute(
            select(
                subq.c.bucket,
                func.count().label("num_jobs"),
                func.min(subq.c.matched_percentage).label("min_match"),
                func.max(subq.c.matched_percentage).label("max_match"),
            )
            .group_by(subq.c.bucket)
            .order_by(subq.c.bucket)
        ).all()
 
        return [
            {
                "bucket": row.bucket,
                "num_jobs": row.num_jobs,
                "min_match_percentage": round(row.min_match, 2),
                "max_match_percentage": round(row.max_match, 2),
            }
            for row in rows
        ]



    def coding_daily_attempts_last_3_months(self) -> list[dict[str, Any]]:
        today = date.today()

        if today.month > 2:
            start = date(today.year, today.month - 2, 1)
        else:
            start = date(
                today.year - 1,
                today.month + 10,
                1,
            )

        end_date = today

        start_datetime = datetime.combine(start, time.min)
        end_datetime = datetime.combine(end_date, time.max)

        rows = self.db.execute(
            select(
                cast(CodeSolution.completed_at, Date).label("day"),
                func.count().label("attempts"),
            )
            .where(
                CodeSolution.completed_at.is_not(None),
                CodeSolution.completed_at >= start_datetime,
                CodeSolution.completed_at <= end_datetime,
            )
            .group_by(
                cast(CodeSolution.completed_at, Date)
            )
            .order_by(
                cast(CodeSolution.completed_at, Date)
            )
        ).all()

        attempts = {
            row.day: row.attempts
            for row in rows
        }

        result: list[dict[str, Any]] = []

        current = start

        while current <= end_date:
            result.append(
                {
                    "date": current.isoformat(),
                    "attempts": attempts.get(current, 0),
                }
            )

            current += timedelta(days=1)

        return result

    def coding_overview_last_30_days(self) -> dict[str, Any]:
        since = datetime.now(timezone.utc) - timedelta(days=29)

        per_attempt = (
            select(
                cast(CodeSolution.completed_at, Date).label("date"),
                CodeSolution.question_id,
                CodeSolution.difficulty,

                func.avg(CodeSolution.score).label("avg_score"),
                func.avg(CodeSolution.time_taken).label("avg_time"),
            )
            .where(
                CodeSolution.completed_at.is_not(None),
                CodeSolution.completed_at >= since,
            )
            .group_by(
                cast(CodeSolution.completed_at, Date),
                CodeSolution.question_id,
                CodeSolution.difficulty,
            )
            .subquery()
        )


        overall = self.db.execute(
            select(
                func.count().label("unique_attempts"),
                func.coalesce(
                    func.avg(per_attempt.c.avg_score),
                    0.0
                ).label("avg_score"),
                func.coalesce(
                    func.avg(per_attempt.c.avg_time),
                    0.0
                ).label("avg_time"),
            )
        ).one()


        difficulty_rows = self.db.execute(
            select(
                per_attempt.c.difficulty,

                func.count().label("unique_attempts"),

                func.coalesce(
                    func.avg(per_attempt.c.avg_score),
                    0.0
                ).label("avg_score"),

                func.coalesce(
                    func.avg(per_attempt.c.avg_time),
                    0.0
                ).label("avg_time"),
            )
            .group_by(
                per_attempt.c.difficulty
            )
        ).all()


        difficulty : dict[str, Any] = {
            row.difficulty.value.lower(): {
                "unique_attempts": row.unique_attempts,
                "avg_score": round(float(row.avg_score), 2),
                "avg_time_taken_minutes": round(float(row.avg_time), 2),
            }
            for row in difficulty_rows
        }

        return {
            "overall": {
                "unique_attempts": overall.unique_attempts,
                "avg_score": round(float(overall.avg_score), 2),
                "avg_time_taken_minutes": round(float(overall.avg_time), 2),
            },
            "difficulty": difficulty,
        }
    
    def solved_attempts_by_difficulty(self) -> list[dict[str, Any]]:
        rows = self.db.execute(
            select(
                CodeSolution.difficulty,

                func.sum(
                    case(
                        (CodeSolution.status != CodingStatus.FAILED, 1),
                        else_=0,
                    )
                ).label("failed_attempts"),

                func.count().label("total_attempts"),
            )
            .group_by(
                CodeSolution.difficulty,
            )
        ).all()

        return [
            {
                "difficulty": row.difficulty.value,
                "solved_attempts": int(row.failed_attempts),
                "total_attempts": int(row.total_attempts),
            }
            for row in rows
        ]
    
    def coding_language_distribution(self) -> list[dict[str, Any]]:
        rows = self.db.execute(
            select(CodeSolution.language, func.count(CodeSolution.question_id).label("count"))
            .where(CodeSolution.language.is_not(None))
            .group_by(CodeSolution.language)
            .order_by(func.count(CodeSolution.question_id).desc())
        ).all()
    
        return [{"language": row.language, "count": row.count} for row in rows]
    
    def coding_streak(self) -> dict[str, Any]:
        rows = list(
            self.db.execute(
                select(
                    cast(CodeSolution.completed_at, Date).label("activity_date")
                )
                .where(
                    CodeSolution.completed_at.is_not(None)
                )
                .group_by(
                    cast(CodeSolution.completed_at, Date)
                )
                .order_by(
                    cast(CodeSolution.completed_at, Date)
                )
            ).all()
        )

        if not rows:
            return {
                "current_streak": 0,
                "best_streak": 0,
            }

        days = [row.activity_date for row in rows]

        # calculate best streak
        best = 1
        current_run = 1

        for i in range(1, len(days)):
            if days[i] == days[i - 1] + timedelta(days=1):
                current_run += 1
            else:
                current_run = 1

            best = max(best, current_run)

        # calculate current streak
        today = date.today()

        if days[-1] < today - timedelta(days=1):
            current = 0

        else:
            current = 1
            idx = len(days) - 2

            while idx >= 0:
                if days[idx] == days[idx + 1] - timedelta(days=1):
                    current += 1
                    idx -= 1
                else:
                    break

        return {
            "current_streak": current,
            "best_streak": best,
        }


    def close(self):
        self.db.close()



from src.config.settings import get_settings

def dashboard(command: str, _: dict[Any, Any]) -> dict[str, Any]:
    dd = DashboardDispatch()

    try:
        return {
            "user_name": get_settings().USER_NAME,
            "last_thirty_days_progress": dd.last_thirty_days_progress(),
            "schedule_streaks": dd.schedule_streaks(),
            "reading_overview": dd.reading_overview(),
            "top_reading_sources": dd.top_reading_sources(),
            "job_match_quality_by_resume": dd.job_match_quality_by_resume(),
            "job_match_distribution": dd.job_match_distribution(),
            "solved_attempts_by_difficulty": dd.solved_attempts_by_difficulty(),
            "coding_language_distribution": dd.coding_language_distribution(),
            "coding_streak": dd.coding_streak(),
            "coding_daily_attempts_last_3_months": dd.coding_daily_attempts_last_3_months(),
            "coding_overview_last_30_days": dd.coding_overview_last_30_days()
        }

    finally:
        dd.close()