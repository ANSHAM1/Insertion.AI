from __future__ import annotations

# from src.database.models import Job
from src.database.repository import JobRepository

from src.fetcher.job.models import JobClass
from src.fetcher.job.job_apis import AdzunaProvider

from src.config.state_manager import StateManager



class JobService:

    def __init__(self, repository: JobRepository) -> None:
        self._repo   = repository
        self._adzuna = AdzunaProvider()

        self.state   = StateManager() 

    def fetch_jobs(self) -> list[JobClass]:
        now = self.state.now()
        last_sync = self.state.JOB_STATE()

        if (last_sync and now - last_sync < self.state.time_delta(1)):
            return []

        if last_sync == None:
            jobs = self._adzuna.search_jobs(max_days_old=7, limit=10)
        else:
            max_days_old = max(1, (now - last_sync).days)
            jobs = self._adzuna.search_jobs(max_days_old=max_days_old, limit=10)

        self.state.JOB_SYNC(now)

        return jobs