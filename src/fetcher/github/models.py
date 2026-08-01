from datetime import datetime

from pydantic import BaseModel, Field

from src.database.enums import (
    CodingDifficulty,
    CodingStatus,
    ProgrammingLanguage,
)


class GithubExample(BaseModel):

    input: str

    output: str

    explanation: str | None = None


class GithubTestCase(BaseModel):

    input: str

    output: str


class GithubQuestion(BaseModel):

    question_id: str

    title: str

    difficulty: CodingDifficulty

    statement: str

    constraints: list[str]

    examples: list[GithubExample]

    public_testcases: list[GithubTestCase]

    hidden_testcases: list[GithubTestCase]

    supported_languages: list[ProgrammingLanguage]

    topics: list[str]

    hints: list[str] = Field(default_factory=list)

    tags: list[str] = Field(default_factory=list)

    time_limit: int = Field(gt=0)

    memory_limit: int | None = None

    created_at: datetime

    generator_model: str

    generator_version: str |None = None


class GithubMetadata(BaseModel):

    question_id: str

    language: ProgrammingLanguage

    status: CodingStatus

    score: int | None = None

    started_at: datetime

    submitted_at: datetime

    completed_at: datetime | None = None

    time_taken: int | None = None

    time_complexity: str

    space_complexity: str

    passed_public_tests: int

    total_public_tests: int

    passed_hidden_tests: int

    total_hidden_tests: int

    llm_feedback: str

    optimization_hint: str

    edge_cases_missed: list[str] = Field(default_factory=list)

    llm_model: str

    evaluator_version: str | None = None


class GithubDirectory(BaseModel):

    path: str

    name: str

    sha: str

    url: str | None = None


class GithubFile(BaseModel):

    path: str

    name: str

    sha: str

    size: int

    download_url: str | None = None

    content: str | None = None

    encoding: str | None = None