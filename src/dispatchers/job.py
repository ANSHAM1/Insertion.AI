from datetime import date, datetime
from typing import Any

from src.database.enums import JobStatus
from src.database.repository import JobRepository
from src.database.models import Job

from src.agents.job_agent.workflow import job_graph

from .base import InsertionAIDispatch


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
