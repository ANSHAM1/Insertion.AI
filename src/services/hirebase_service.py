from typing import Any

from src.fetcher.hirebase.model import (CompanyModel, ExperienceRange, JobModel)
from src.fetcher.hirebase.hirebase_api import HirebaseService

from src.config.settings import get_settings
import json

def job_parser(jobs: list[dict[str, Any]]) -> list[JobModel]:
    results: list[JobModel] = []

    for job in jobs:
        company = job.get("company_data", {})
        size = company.get("size_range", {})

        results.append(
            JobModel(
                id=job["_id"],
                title=job["job_title"],
                company=job["company_name"],

                description=job["description"],
                requirements_summary=job.get("requirements_summary"),

                apply_url=job["application_link"],
                job_type=job.get("job_type"),

                location=job.get("location_raw"),
                location_type=job.get("location_type"),

                posted_at=job.get("date_posted"),

                experience_level=job.get("experience_level"),
                experience=ExperienceRange(
                    min=job.get("yoe_range", {}).get("min"),
                    max=job.get("yoe_range", {}).get("max"),
                ),
                education_level=job.get("education_level"),

                skills=job.get("skills", []),
                technologies=job.get("technologies", []),

                company_data=CompanyModel(
                    description=company.get("description_summary"),
                    size_min=size.get("min"),
                    size_max=size.get("max"),
                    company_type=company.get("type"),
                    industries=company.get("industries", []),
                ),

                flexibility_score=job.get("flexibility_score"),
                compensation_value_score=job.get("compensation_value_score"),
                prestige_score=job.get("prestige_score"),
                growth_score=job.get("growth_score"),
            )
        )

    return results


def fetch_jobs(limit: int = 20) -> list[JobModel]:
    service = HirebaseService()

    try:
        with open(get_settings().JOB_SEARCH_PATH, "r", encoding="utf-8") as file:
            config = json.load(file)

        jobs = service.search_jobs(
            job_titles=config["job_titles"],
            keywords=None,
            locations=config["locations"],
            limit=limit,
        )

        return job_parser(jobs)

    finally:
        service.close()