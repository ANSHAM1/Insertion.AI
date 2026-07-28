from __future__ import annotations

import httpx
from typing import Any
from datetime import datetime

from .models import Job, JobSearchFilter, EmploymentType
from .base import JobProvider


class AdzunaProvider(JobProvider):
    BASE_URL = "https://api.adzuna.com/v1/api/jobs"

    def __init__(self, app_id: str, app_key: str, country: str = "in", timeout: float = 30.0) -> None:
        self._app_id  = app_id
        self._app_key = app_key
        self._country = country

        self._client = httpx.Client(
            base_url=self.BASE_URL,
            timeout=timeout,
            headers={
                "Accept": "application/json",
            },
        )

    def search_jobs(self, filters: JobSearchFilter) -> list[Job]:

        response = self._client.get(f"/{self._country}/search/1", params=self._build_params(filters))

        response.raise_for_status()

        payload = response.json()

        jobs: list[Job] = []

        for item in payload.get("results", []):

            salary = None
            salary_min = item.get("salary_min")
            salary_max = item.get("salary_max")

            if salary_min and salary_max:
                salary = f"{salary_min:,} - {salary_max:,}"
            elif salary_min:
                salary = f"From {salary_min:,}"
            elif salary_max:
                salary = f"Up to {salary_max:,}"

            contract = item.get("contract_type")

            employment_type = None
            if contract == "permanent":
                employment_type = EmploymentType.FULL_TIME
            elif contract == "contract":
                employment_type = EmploymentType.CONTRACT

            jobs.append(
                Job(
                    company         = item.get("company", {}).get("display_name", "").strip(),
                    role            = item.get("title", "").strip(),
                    description     = item.get("description"),
                    employment_type = employment_type,
                    location        = item.get("location", {}).get("display_name"),
                    salary          = salary,
                    apply_url       = item.get("redirect_url"),
                    posted_at       = datetime.fromisoformat(item["created"].replace("Z", "+00:00")).date(),
                )
            )

        return jobs

    def _build_params(self, filters: JobSearchFilter) -> dict[str, Any]:
        """
        Convert JobSearchFilter into Adzuna query parameters.
        """
        params: dict[str, Any] = {
            "app_id": self._app_id,
            "app_key": self._app_key,
            "results_per_page": filters.limit,
        }

        if filters.keywords:
            params["what"] = " OR ".join(filters.keywords)

        if filters.locations:
            params["where"] = ", ".join(filters.locations)

        if filters.posted_after:
            params["max_days_old"] = (
                (filters.posted_after.today() - filters.posted_after).days
            )

        if filters.employment_types:
            pass

        return params


class HirebaseProvider(JobProvider):
    BASE_URL = "https://api.hirebase.org/v2"

    def __init__(self, api_key: str, timeout: float = 30.0) -> None:
        self._client = httpx.Client(
            base_url=self.BASE_URL,
            timeout=timeout,
            headers={
                "Content-Type": "application/json",
                "x-api-key": api_key,
            },
        )

    def search_jobs(self, filters: JobSearchFilter) -> list[Job]:

        response = self._client.post("/jobs/search", json=self._build_body(filters))

        response.raise_for_status()

        payload = response.json()

        jobs: list[Job] = []

        for item in payload.get("jobs", []):

            salary = None
            salary_range: dict[str, Any] = item.get("salary_range") or {}

            salary_min = salary_range.get("min")
            salary_max = salary_range.get("max")

            if salary_min and salary_max:
                salary = f"{salary_min:,} - {salary_max:,}"
            elif salary_min:
                salary = f"From {salary_min:,}"
            elif salary_max:
                salary = f"Up to {salary_max:,}"

            employment_type = self._map_employment_type(
                item.get("job_type")
            )

            locations: list[Any] = item.get("locations") or []

            location = None
            if locations:
                loc = locations[0]
                location = ", ".join(
                    filter(
                        None,
                        [
                            loc.get("city"),
                            loc.get("region"),
                            loc.get("country"),
                        ],
                    )
                )

            experience: dict[str, Any] = item.get("yoe_range") or {}

            posted_at = None
            if item.get("date_posted"):
                posted_at = datetime.fromisoformat(
                    item["date_posted"].replace("Z", "+00:00")
                ).date()

            jobs.append(
                Job(
                    company         = item.get("company_name", "").strip(),
                    role            = item.get("job_title", "").strip(),
                    description     = item.get("description"),
                    employment_type = employment_type,
                    location        = location,
                    salary          = salary,
                    experience_min  = experience.get("min"),
                    apply_url       = item.get("application_link"),
                    posted_at       = posted_at,
                )
            )

        return jobs

    def _build_body(self, filters: JobSearchFilter) -> dict[str, Any]:

        body: dict[str, Any] = {
            "page": 1,
            "limit": filters.limit,
            "sort_by": "date_posted",
            "sort_order": "desc",
        }

        if filters.keywords:
            body["job_titles"] = filters.keywords

        if filters.posted_after:
            body["days_ago"] = (
                datetime.now().date() - filters.posted_after
            ).days

        return body

    @staticmethod
    def _map_employment_type(job_type: str | None) -> EmploymentType | None:

        if not job_type:
            return None

        mapping = {
            "Full Time": EmploymentType.FULL_TIME,
            "Part Time": EmploymentType.PART_TIME,
            "Contract": EmploymentType.CONTRACT,
            "Internship": EmploymentType.INTERN,
            "Temporary": EmploymentType.TEMPORARY,
            "Freelance": EmploymentType.FREELANCE,
            "Volunteer": EmploymentType.VOLUNTEER,
            "Apprenticeship": EmploymentType.APPRENTICESHIP,
        }

        return mapping.get(job_type)