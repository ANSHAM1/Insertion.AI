from datetime import datetime

from pydantic import BaseModel, Field


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

    difficulty: str

    source: str

    statement: str

    constraints: list[str]

    examples: list[GithubExample]

    public_testcases: list[GithubTestCase]

    hidden_testcases: list[GithubTestCase]

    supported_languages: list[str]

    topics: list[str]

    time_limit: int = Field(gt=0)

    memory_limit: int | None = None

    hints: list[str] = []

    tags: list[str] = []

    created_at: datetime

    generator_model: str

    generator_version: str | None = None


class GithubMetadata(BaseModel):

    question_id: str

    language: str

    status: str

    score: int | None = None

    started_at: datetime

    completed_at: datetime | None = None

    time_taken: int | None = None

    submitted_at: datetime

    time_complexity: str

    space_complexity: str

    llm_feedback: str

    optimization_hint: str

    edge_cases_missed: list[str] = []

    passed_public_tests: int

    total_public_tests: int

    passed_hidden_tests: int

    total_hidden_tests: int

    llm_model: str

    llm_provider: str

    evaluation_version: str | None = None


class GithubSolution(BaseModel):

    language: str

    filename: str

    source_code: str

    created_at: datetime


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