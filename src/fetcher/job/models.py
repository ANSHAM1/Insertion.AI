from __future__ import annotations

from datetime import date
from enum import Enum

from pydantic import BaseModel, ConfigDict


class EmploymentType(str, Enum):
    FULL_TIME      = "full_time"
    PART_TIME      = "part_time"
    CONTRACT       = "contract"
    INTERN         = "internship"
    TEMPORARY      = "temporary"
    FREELANCE      = "freelance"
    APPRENTICESHIP = "apprenticeship"
    VOLUNTEER      = "volunteer"
    UNKNOWN        = "unknown"


class Job(BaseModel):
    model_config = ConfigDict(extra="ignore")

    company         : str
    role            : str
    description     : str | None            = None

    employment_type : EmploymentType | None = None

    location        : str | None            = None

    salary          : str | None            = None

    experience_min  : int | None            = None

    bond            : int | None            = None

    apply_url       : str | None            = None

    recruiter_name  : str | None            = None
    recruiter_email : str | None            = None

    posted_at       : date | None           = None


class JobSearchFilter(BaseModel):
    keywords         : list[str]   = []

    locations        : list[str]   = []

    employment_types : list[str]   = []

    posted_after     : date | None = None

    limit            : int         = 16