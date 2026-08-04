from pydantic import BaseModel


class JobModelAI(BaseModel):
    id: str

    required_skills: list[str]
    missing_skills: list[str]

    matched_resume: bool
    matched_percentage: float

    experience_level: str | None = None


class JobModelOutput(BaseModel):
    jobs: list[JobModelAI]