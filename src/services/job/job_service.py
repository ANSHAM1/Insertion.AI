from __future__ import annotations

from datetime import datetime, timedelta, timezone

from src.database.repository import JobRepository
from src.fetcher.job.models import JobSearchFilter
from src.fetcher.job.base import JobProvider

from src.config.settings import get_settings



class JobService:

    def __init__(self, repository: JobRepository, adzuna: JobProvider, hirebase: JobProvider) -> None:
        self._repo = repository
        self._adzuna = adzuna
        self._hirebase = hirebase

        self._state = get_settings().SYNC_DATA

    def sync(self) -> None:
        now = datetime.now(timezone.utc)
        self._sync_adzuna(now)
        self._sync_hirebase(now)

    def _sync_adzuna(self, now: datetime) -> None:
        last_sync = self._state.job.adzuna_last_sync # type: ignore

        if (last_sync and now - last_sync < timedelta(hours=1)):
            return

        jobs = self._adzuna.search_jobs(
            JobSearchFilter(
                posted_after=last_sync.date() if last_sync else None, # type: ignore
                limit=100,
            )
        )

        # self._repo.upsert_jobs(jobs)

        # self._state.job.adzuna_last_sync = now
        # self._state.save()

    def _sync_hirebase(self, now: datetime) -> None:

        last_sync = self._state.job.hirebase_last_sync # type: ignore

        if (last_sync and now - last_sync < timedelta(days=1)):
            return

        jobs = self._hirebase.search_jobs(
            JobSearchFilter(
                posted_after=last_sync.date() if last_sync else None, # type: ignore
                limit=15,
            )
        )

        # self._repo.upsert_jobs(jobs)

        # self._state.job.hirebase_last_sync = now
        # self._state.save()