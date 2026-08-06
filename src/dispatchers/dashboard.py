from datetime import datetime, timedelta
from typing import Any
from sqlalchemy import Integer, cast, func, select

from src.database.connection import SessionLocal
from src.database.models import DailySchedule, ScheduleItem, ReadingArticle, Job, CodeSolution



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



    def coding_overview(self) -> dict[str, Any]:
            """Overall attempt count, average score, and average time taken."""
    
            row = self.db.execute(
                select(
                    func.count(CodeSolution.question_id).label("total_attempts"),
                    func.coalesce(func.avg(CodeSolution.score), 0.0).label("avg_score"),
                    func.coalesce(func.avg(CodeSolution.time_taken), 0.0).label("avg_time_taken"),
                )
            ).one()
    
            return {
                "total_attempts": row.total_attempts,
                "avg_score": round(row.avg_score, 2),
                "avg_time_taken_minutes": round(row.avg_time_taken, 2),
            }
    
    def coding_by_difficulty(self) -> list[dict[str, Any]]:
            """Attempts, average score, and time efficiency per difficulty tier."""
    
            rows = self.db.execute(
                select(
                    CodeSolution.difficulty,
                    func.count(CodeSolution.question_id).label("attempts"),
                    func.coalesce(func.avg(CodeSolution.score), 0.0).label("avg_score"),
                    func.coalesce(
                        func.avg(CodeSolution.time_taken * 1.0 / CodeSolution.time_limit), 0.0
                    ).label("avg_time_efficiency"),
                )
                .group_by(CodeSolution.difficulty)
                .order_by(CodeSolution.difficulty)
            ).all()
    
            return [
                {
                    "difficulty": row.difficulty.value,
                    "attempts": row.attempts,
                    "avg_score": round(row.avg_score, 2),
                    "avg_time_efficiency": round(row.avg_time_efficiency, 2),  # time_taken / time_limit
                }
                for row in rows
            ]
    
    def coding_status_breakdown(self) -> list[dict[str, Any]]:
            """Counts grouped by solution status (solved/attempted/etc)."""
    
            rows = self.db.execute(
                select(CodeSolution.status, func.count(CodeSolution.question_id).label("count"))
                .group_by(CodeSolution.status)
                .order_by(func.count(CodeSolution.question_id).desc())
            ).all()
    
            return [
                {"status": row.status.value if row.status else "Not Attempted", "count": row.count}
                for row in rows
            ]
    
    def coding_language_distribution(self) -> list[dict[str, Any]]:
            """Which languages get used most often."""
    
            rows = self.db.execute(
                select(CodeSolution.language, func.count(CodeSolution.question_id).label("count"))
                .where(CodeSolution.language.is_not(None))
                .group_by(CodeSolution.language)
                .order_by(func.count(CodeSolution.question_id).desc())
            ).all()
    
            return [{"language": row.language, "count": row.count} for row in rows]
    
    def coding_streak(self) -> dict[str, Any]:
            """
            Current and best consecutive-day solve streaks, based on
            completed_at. Same gaps-and-islands approach as schedule_streaks.
            """
    
            rows = self.db.execute(
                select(func.date(CodeSolution.completed_at).label("date"))
                .where(CodeSolution.completed_at.is_not(None))
                .group_by(func.date(CodeSolution.completed_at))
                .order_by(func.date(CodeSolution.completed_at))
            ).all()
    
            current = best = 0
            prev_date = None
    
            for row in rows:
                day = (
                    datetime.strptime(row.date, "%Y-%m-%d").date()
                    if isinstance(row.date, str)
                    else row.date
                )
                contiguous = prev_date is not None and day == prev_date + timedelta(days=1)
    
                current = current + 1 if contiguous else 1
                best = max(best, current)
                prev_date = day
    
            return {"current_streak": current, "best_streak": best}
    
    def top_scoring_solutions(self, limit: int = 10) -> list[dict[str, Any]]:
            """Highest-scoring solved problems, ranked with RANK."""
    
            rank = func.rank().over(order_by=CodeSolution.score.desc()).label("rank")
    
            rows = self.db.execute(
                select(
                    CodeSolution.question_id,
                    CodeSolution.title,
                    CodeSolution.difficulty,
                    CodeSolution.score,
                    rank,
                )
                .where(CodeSolution.score.is_not(None))
                .order_by(rank)
                .limit(limit)
            ).all()
    
            return [
                {
                    "rank": row.rank,
                    "question_id": row.question_id,
                    "title": row.title,
                    "difficulty": row.difficulty.value,
                    "score": row.score,
                }
                for row in rows
            ]



    def close(self):
        self.db.close()




def dashboard(command: str, _: dict[Any, Any]) -> dict[str, Any]:
    dd = DashboardDispatch()

    try:
        return {
            "last_thirty_days_progress": dd.last_thirty_days_progress(),
            "schedule_streaks": dd.schedule_streaks(),
            "reading_overview": dd.reading_overview(),
            "top_reading_sources": dd.top_reading_sources(),
            "job_match_quality_by_resume": dd.job_match_quality_by_resume(),
            "job_match_distribution": dd.job_match_distribution()
        }

    finally:
        dd.close()