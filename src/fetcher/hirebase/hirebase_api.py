import httpx
from typing import Any

from src.config.settings import get_settings



class HirebaseService:

    BASE_URL      : str = "https://api.hirebase.org/v2"

    def __init__(self):
        self.DEFAULT_LIMIT  : int = 20

        self.TIMEOUT : int = 30

        self.client = httpx.Client(
            base_url=self.BASE_URL,
            timeout=self.TIMEOUT,
            headers={
                    "X-API-Key": get_settings().HIREBASE_API_KEY_1,
                    "Accept": "application/json",
            },
        )


    def search_jobs(self, *, job_titles: list[str], keywords: list[str] | None = None, locations: list[dict[str, str]] | None = None, limit: int, 
                    page: int = 1, days_ago: int = 1) -> list[dict[str, Any]]:

            payload: dict[str, Any] = {
                "job_titles": job_titles,
                "limit": limit,
                "page": page,
                "days_ago": days_ago,
                "sort_by": "date_posted",
                "sort_order": "desc",
            }

            if keywords:
                payload["keywords"] = keywords

            if locations:
                payload["geo_locations"] = locations

            response = self.client.post(
                "/jobs/search",
                json=payload,
            )

            response.raise_for_status()

            data = response.json()

            return data.get("jobs", [])


    def close(self):
        self.client.close()