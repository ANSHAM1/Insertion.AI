from pydantic import BaseModel

from src.database.enums import (EmploymentType, RecruitmentType)



class JobAnalysis(BaseModel):
    id                    : str
    
    company               : str
    role                  : str
    description           : str | None

    employment_type       : EmploymentType | None
    recruitment_type      : RecruitmentType | None

    experience_min        : int | None

    missing_skills        : list[str]

    tailoring_suggestions : list[str]
    reason                : str


class JobOutput(BaseModel):
    jobs: list[JobAnalysis]