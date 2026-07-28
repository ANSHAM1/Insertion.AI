from __future__ import annotations

from datetime import datetime, timedelta, timezone
import json

from src.database.repository import JobRepository
from src.fetcher.job.models import JobSearchFilter
from src.fetcher.job.base import JobProvider

from src.config.settings import get_settings



class JobService:

    def __init__(self, repository: JobRepository, adzuna: JobProvider) -> None:
        self._repo = repository
        self._adzuna = adzuna

        self.state_path = get_settings().SYNC_DATA_PATH 

    def sync(self) -> None:
        now = datetime.now(timezone.utc)
        self._sync_adzuna(now)

    def _sync_adzuna(self, now: datetime) -> None:
        with open(self.state_path, "r", encoding="utf-8") as f:
            state = json.load(f)

        last_sync = state["job"]["adzuna_last_sync"]

        if (last_sync and now - last_sync < timedelta(hours=1)):
            return

        jobs = self._adzuna.search_jobs(
            JobSearchFilter(
                posted_after=last_sync.date() if last_sync else None, # type: ignore
                limit=100,
            )
        )

        state["rss"]["last_sync"] = datetime.now(timezone.utc).isoformat()

        with open(self.state_path, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=4)