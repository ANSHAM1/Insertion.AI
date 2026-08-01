from __future__ import annotations

from datetime import datetime
from typing import Any
from random import shuffle

import httpx

from src.fetcher.job.filter import JOB_KEYWORDS, JOB_LOCATIONS
from src.fetcher.job.models import JobClass

from src.config.settings import get_settings


class AdzunaProvider:
    BASE_URL = "https://api.adzuna.com/v1/api/jobs"

    def __init__(self, country: str = "in", timeout: float = 30.0) -> None:
        self._app_id  = get_settings().ADZUNA_APP_ID
        self._app_key = get_settings().ADZUNA_APP_KEY
        self._country = country

        self._client = httpx.Client(
            base_url=self.BASE_URL,
            timeout=timeout,
            headers={"Accept": "application/json"},
        )

    def search_jobs(self, max_days_old: int, limit: int = 25) -> list[JobClass]:
        jobs: list[JobClass] = []
        seen_urls: set[str] = set()

        keywords = JOB_KEYWORDS.copy()
        locations = JOB_LOCATIONS.copy()

        shuffle(keywords)
        shuffle(locations)

        for keyword in keywords:
            for location in locations:

                remaining = limit - len(jobs)

                if remaining <= 0:
                    return jobs

                response = self._client.get(
                    f"/{self._country}/search/1",
                    params=self._build_params(
                        keyword=keyword,
                        location=location,
                        max_days_old=max_days_old,
                        limit=remaining,
                    ),
                )

                response.raise_for_status()

                payload = response.json()

                for item in payload.get("results", []):

                    apply_url = item.get("redirect_url")

                    if apply_url and apply_url in seen_urls:
                        continue

                    if apply_url:
                        seen_urls.add(apply_url)

                    jobs.append(
                        JobClass(
                            id=item["id"],
                            company=item["company"]["display_name"].strip(),
                            role=item["title"].strip(),
                            description=item["description"],
                            employment_type=item.get("contract_type", ""),
                            location=item["location"]["display_name"],
                            salary_min=float(item.get("salary_min", 0)),
                            salary_max=float(item.get("salary_max", 0)),
                            salary_predicted=item.get("salary_is_predicted") == "1",
                            apply_url=apply_url,
                            posted_at=datetime.fromisoformat(item["created"].replace("Z", "+00:00")).date(),
                        )
                    )

                    if len(jobs) >= limit:
                        return jobs

        return jobs

    def _build_params(self, keyword: str, location: str, max_days_old: int, limit: int) -> dict[str, Any]:
        return {
            "app_id": self._app_id,
            "app_key": self._app_key,
            "results_per_page": limit,
            "what": keyword,
            "where": location,
            "max_days_old": max_days_old,
        }
