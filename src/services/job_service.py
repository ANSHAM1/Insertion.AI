from __future__ import annotations

from src.database.models import Job
from src.database.repository import JobRepository

from src.fetcher.job.models import JobClass
from src.fetcher.job.job_apis import AdzunaProvider

from src.config.state_manager import StateManager



class JobService:

    def __init__(self, repository: JobRepository) -> None:
        self.repo   = repository
        self.adzuna = AdzunaProvider()

        self.state   = StateManager() 

    def fetch_jobs(self) -> list[JobClass]:
        now = self.state.now()
        last_sync = self.state.JOB_STATE()

        if (last_sync and now - last_sync < self.state.time_delta(1)):
            return []

        if last_sync == None:
            jobs = self.adzuna.search_jobs(max_days_old=7, limit=20)
        else:
            max_days_old = max(1, min((now - last_sync).days, 5))
            jobs = self.adzuna.search_jobs(max_days_old=max_days_old, limit=20)

        self.state.JOB_SYNC(now)

        return self.remove_known_jobs_and_bulk_insert(jobs)

    def remove_known_jobs_and_bulk_insert(self, jobs: list[JobClass]) -> list[JobClass]:
        existing = self.repo.bulk_exists(
            [job.id for job in jobs]
        )

        self.repo.bulk_insert(existing)

        return [job for job in jobs if job.id not in existing]

    def store_jobs(self, jobs: list[Job]) -> None:
        for job in jobs:
            self.repo.add(job)