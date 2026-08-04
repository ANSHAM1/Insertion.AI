from typing import List, Optional

from pydantic import BaseModel


class CompanyModel(BaseModel):

    description  : Optional[str] = None

    size_min     : Optional[int] = None
    size_max     : Optional[int] = None

    company_type : Optional[str] = None

    industries   : List[str]     = []


class ExperienceRange(BaseModel):

    min : Optional[int] = None
    max : Optional[int] = None


class JobModel(BaseModel):

    # ---------- Identity ----------
    id                       : str
    title                    : str
    company                  : str

    # ---------- Job ----------
    description              : str
    requirements_summary     : Optional[str]   = None

    apply_url                : str

    job_type                 : Optional[str]   = None

    # ---------- Location ----------
    location                 : Optional[str]   = None
    location_type            : Optional[str]   = None

    # ---------- Posted ----------
    posted_at                : Optional[str]   = None

    # ---------- Experience ----------
    experience_level         : Optional[str]   = None
    experience               : ExperienceRange = ExperienceRange()

    education_level          : Optional[str]   = None

    # ---------- Skills ----------
    skills                   : List[str]       = []
    technologies             : List[str]       = []

    # ---------- Company ----------
    company_data             : CompanyModel    = CompanyModel()

    # ---------- AI Scores ----------
    flexibility_score        : Optional[float] = None
    compensation_value_score : Optional[float] = None
    prestige_score           : Optional[float] = None
    growth_score             : Optional[float] = None