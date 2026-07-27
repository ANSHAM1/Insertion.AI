from __future__ import annotations

import httpx
from typing import Any


from .base import JobProvider
from .companies import GREENHOUSE_COMPANIES, LEVER_COMPANIES
from .models import (EmploymentType, JobPosting, JobProvider as Provider, JobSearchQuery)


class GreenhouseProvider(JobProvider):
    name = "greenhouse"

    BASE_URL = "https://boards-api.greenhouse.io/v1/boards"


    def _fetch_company_jobs(self, company: str) -> list[dict[str, Any]]:
        url = f"{self.BASE_URL}/{company}/jobs"

        response = httpx.get(
            url,
            timeout=20,
        )

        if response.status_code != 200:
            return []

        return response.json().get("jobs", [])


    def _parse(self, company: str, job: dict[str, Any]) -> JobPosting:
        location = ""

        if job.get("location"):
            location = job["location"].get("name", "")

        return JobPosting(
            provider        = Provider.GREENHOUSE,
            external_id     = str(job["id"]),
            company         = company,
            role            = job["title"],
            location        = location,
            employment_type = EmploymentType.UNKNOWN,
            remote          = "remote" in location.lower(),
            description     = "",
            apply_url       = job["absolute_url"],
            posted_at       = None
        )


    def search(self, query: JobSearchQuery) -> list[JobPosting]:
        jobs: list[JobPosting] = []

        keywords  = [k.lower() for k in query.keywords]
        locations = [l.lower() for l in query.locations]

        for company in GREENHOUSE_COMPANIES:
            raw_jobs = self._fetch_company_jobs(company)

            for raw in raw_jobs:
                title = raw["title"].lower()

                location = ""
                if raw.get("location"):
                    location = raw["location"].get("name", "").lower()

                # Keyword filter
                if keywords and not any(k in title for k in keywords):
                    continue

                # Location filter
                if locations:
                    if not any(loc in location for loc in locations):
                        continue

                jobs.append(self._parse(company, raw))

        return jobs[: query.limit]



class LeverProvider(JobProvider):
    name = "lever"

    BASE_URL = "https://api.lever.co/v0/postings"


    def _fetch_company_jobs(self, company: str) -> list[dict[str, Any]]:
        url = f"{self.BASE_URL}/{company}"

        response = httpx.get(
            url,
            params={
                "mode": "json",
            },
            timeout=20,
        )

        if response.status_code != 200:
            return []

        return response.json()


    def _employment_type(self, text: str | None) -> EmploymentType:
        if not text:
            return EmploymentType.UNKNOWN

        text = text.lower()

        if "full" in text:
            return EmploymentType.FULL_TIME

        if "part" in text:
            return EmploymentType.PART_TIME

        if "intern" in text:
            return EmploymentType.INTERN

        if "contract" in text:
            return EmploymentType.CONTRACT

        if "temp" in text:
            return EmploymentType.TEMPORARY

        return EmploymentType.UNKNOWN


    def _parse(self, company: str, job: dict[str, Any]) -> JobPosting:
        categories = job.get("categories", {})

        location   = categories.get("location", "")
        commitment = categories.get("commitment")

        return JobPosting(
            provider        = Provider.LEVER,
            external_id     = job["id"],
            company         = company,
            role            = job["text"],
            location        = location,
            employment_type = self._employment_type(commitment),
            remote          = "remote" in location.lower(),
            description     = job.get("descriptionPlain", ""),
            apply_url       = job["hostedUrl"],
            posted_at       = None,
        )


    def search(self, query: JobSearchQuery) -> list[JobPosting]:
        jobs: list[JobPosting] = []

        # keywords  = [k.lower() for k in query.keywords]
        # locations = [l.lower() for l in query.locations]

        for company in LEVER_COMPANIES:
            raw_jobs = self._fetch_company_jobs(company)

            print(company, len(raw_jobs))

            for raw in raw_jobs:
                # title = raw["text"].lower()

                # location = (raw.get("categories", {}).get("location", "").lower())
                # if keywords:
                #     if not any(keyword in title for keyword in keywords):
                #         continue

                # if locations:
                #     if not any(loc in location for loc in locations):
                #         continue

                # if query.remote_only:
                #     if "remote" not in location:
                #         continue

                jobs.append(self._parse(company, raw))

        return jobs[: query.limit]