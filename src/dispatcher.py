import json
from abc import ABC, abstractmethod
from datetime import date, datetime, timedelta
from typing import Any

from src.config.settings import get_settings
from src.config.state_manager import StateManager

from src.database.connection import SessionLocal
from src.database.enums import JobStatus

from src.database.repository import (DailyScheduleRepository, RssRepository, JobRepository, CodingRepository)
from src.database.models import (DailySchedule, Job, ReadingArticle)

from src.fetcher.github.models import Question, FrontendMetadata, Metadata
from src.fetcher.github.repository import GithubRepository

from src.agents.planner_agent.workflow import planner_graph
from src.agents.job_agent.workflow import job_graph
from src.agents.code_agent.evaluator.workflow import evaluator_graph
from src.agents.code_agent.generator.workflow import generator_graph



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



class RssDispatch(InsertionAIDispatch):

    def _helper(self, feed: ReadingArticle) -> dict[str, Any]:

        if not feed:
            return {}

        return {
                "id"           : feed.id,
                "title"        : feed.title,
                "link"         : feed.url,
                "source"       : feed.source,
                "published_at" : feed.published_at,
                "is_read"      : feed.is_read,
        } 

    def invoke(self):

        repo = RssRepository(self.db)

        feed = repo.get_by_date(date.today())
        if feed is None:
            raise ValueError("Task not found.")

        return self._helper(feed)

    def read_status(self, id : int, status : bool) -> None:

        repo = RssRepository(self.db)

        feed = repo.get(id)
        if feed is None:
            raise ValueError("Task not found.")
        
        feed.is_read = status
        repo.commit()


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



class JobDispatch(InsertionAIDispatch):

    def _helper(self, jobs: list[Job]) -> dict[str, Any]:

        if not jobs:
            return {"items": []}

        return {
            "items": [
                {
                    "id"                       : job.id,
                    "company"                  : job.company,
                    "role"                     : job.role,
                    "description"              : job.description,
                    "requirements_summary"     : job.requirements_summary,
                    "job_type"                 : (job.job_type if job.job_type else None),
                    "location"                 : job.location,
                    "location_type"            : job.location_type,
                    "experience_level"         : job.experience_level,
                    "experience_min"           : job.experience_min,
                    "experience_max"           : job.experience_max,
                    "education_level"          : job.education_level,
                    "skills"                   : job.skills,
                    "technologies"             : job.technologies,
                    "required_skills"          : job.required_skills,
                    "missing_skills"           : job.missing_skills,
                    "matched_resume"           : job.matched_resume,
                    "matched_percentage"       : job.matched_percentage,
                    "flexibility_score"        : job.flexibility_score,
                    "compensation_value_score" : job.compensation_value_score,
                    "prestige_score"           : job.prestige_score,
                    "growth_score"             : job.growth_score,
                    "apply_url"                : job.apply_url,
                    "posted_at"                : (job.posted_at.isoformat() if job.posted_at else None),
                    "status"                   : job.status.value,
                    "status_date"              : (job.status_date.isoformat() if job.status_date else None),
                }
                for job in sorted(
                    jobs,
                    key=lambda x: (x.posted_at or date.max, x.company.lower()),
                    reverse=True,  # newest jobs first
                )
            ]
        }

    def invoke(self):

        repo = JobRepository(self.db)

        state: dict[str, Any] = {
            "curr_date": date.today(),
            "timestamp": datetime.now(),

            "resume": {},

            "app_state": self.app_state,

            "jobs": [],
            "output": None,

            "job_repo": repo,

            "prompt": "",
            "terminate": False,
        }

        job_graph.invoke(state)  # type: ignore
        
        return self._helper(repo.get_all())

    def update_status(self, job_id: str, status: str) -> None:

        repo = JobRepository(self.db)

        job = repo.get(job_id)

        if job is None:
            raise ValueError(f"Job '{job_id}' not found.")

        job.status = JobStatus(status)
        job.status_date = date.today()
        repo.commit()

    def remove_job(self, job_id: str) -> None:

        repo = JobRepository(self.db)

        job = repo.get(job_id)

        if job is None:
            raise ValueError(f"Job '{job_id}' not found.")

        repo.delete(job)
        repo.commit()

    def refresh_jobs(self) -> dict[str, Any]:

        repo = JobRepository(self.db)

        return self._helper(repo.get_all())



class CodingGeneratorDispatch(InsertionAIDispatch):

    def __init__(self, user_prompt: str):
        super().__init__()
        self.user_prompt = user_prompt
        
    def _helper(self, questions: list[tuple[date, list[Question]]]) -> dict[str, Any]:
        return {
            "items": [
                {
                    "generated_date": generated_date.isoformat(),
                    "questions": [
                        q.model_dump(mode="json")
                        for q in questions
                    ],
                }
                for generated_date, questions in questions
            ]
        }

    def invoke(self):

        state: dict[str, Any] = {
            "curr_date": date.today(),
            "timestamp": datetime.now(),

            "app_state": self.app_state,

            "questions": [],
            "old_questions": [],

            "user_prompt": self.user_prompt,
            "prompt": "",

            "terminate": False
        }

        generator_graph.invoke(state)  # type: ignore

        git_repo = GithubRepository()

        return self._helper(git_repo.fetch_all_questions())

    def refresh_questions(self):

        git_repo = GithubRepository()

        return self._helper(git_repo.fetch_all_questions())


class CodingEvaluatorDispatch(InsertionAIDispatch):

    def __init__(self, question: dict[str, Any], generated_date: str, solution: str, frontend_meta: dict[str, Any]):
        super().__init__()
        self.question = Question.model_validate(question)
        self.generated_date = generated_date
        self.solution = solution
        self.frontend_meta = FrontendMetadata.model_validate(frontend_meta)

    def _helper(self, metadata : Metadata) -> dict[str, Any]:
        return metadata.model_dump(mode="json")

    def invoke(self) -> dict[str, Any]:

        state: dict[str, Any] = {
            "curr_date": date.today(),
            "timestamp": datetime.now(),

            "question": self.question,
            "generated_date": date.fromisoformat(self.generated_date),

            "solution": self.solution,

            "code_repo": CodingRepository(self.db),

            "frontend_meta": self.frontend_meta,
            "ai_metadata": None,
            "metadata": None,

            "prompt": "",
            "llm_failed": False,

            "uploaded": False,
        }

        evaluator_graph.invoke(state)  # type: ignore

    
        repo = CodingRepository(self.db)
        github_path = repo.get_path(self.question.question_id, self.frontend_meta.started_at)

        if not github_path:
            raise RuntimeError("solution entry not present")

        git_repo = GithubRepository()
        
        return self._helper(git_repo.fetch_metadata(github_path))


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


def article(command: str, payload: dict[Any, Any]):
    app = RssDispatch()

    try:
        if command == "article":
            return app.invoke()

        elif command == "article_read_status":
            app.read_status(
                payload["id"],
                payload["completed"],
            )
            return None

        raise ValueError(f"Unknown planner command: {command}")

    finally:
        app.close()



def job(command: str, payload: dict[Any, Any]):
    app = JobDispatch()

    try:
        if command == "job":
            return app.refresh_jobs()

        elif command == "job_status":
            app.update_status(
                payload["id"],
                payload["status"],
            )
            return None

        elif command == "job_remove":
            app.remove_job(
                payload["id"],
            )
            return None

        elif command == "new_jobs":
            return app.invoke()

        raise ValueError(f"Unknown college command: {command}")

    finally:
        app.close()


def generator(command: str, payload: dict[Any, Any]):
    app = CodingGeneratorDispatch(payload["user_prompt"])

    try:
        if command == "generator":
            return app.invoke()

        elif command == "refresh_questions":
            return app.refresh_questions()

        raise ValueError(f"Unknown generator command: {command}")

    finally:
        app.close()


def evaluator(command: str, payload: dict[Any, Any]):
    app = CodingEvaluatorDispatch(
        question=payload["question"],
        generated_date=payload["generated_date"],
        solution=payload["solution"],
        frontend_meta=payload["frontend_meta"]
    )

    try:
        if command == "evaluator":
            return app.invoke()

        raise ValueError(f"Unknown evaluator command: {command}")

    finally:
        app.close()