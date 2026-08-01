from dataclasses import dataclass
from datetime import datetime
from typing import Any


@dataclass(slots=True)
class GithubQuestion:

    question_id: str

    title: str

    difficulty: str

    source: str

    statement: str

    constraints: list[str]

    examples: list[dict[str, Any]]

    public_testcases: list[dict[str, Any]]

    hidden_testcases: list[dict[str, Any]]

    supported_languages: list[str]

    topics: list[str]

    time_limit: int


@dataclass(slots=True)
class GithubMetadata:

    question_id: str

    language: str

    status: str

    score: int | None

    started_at: datetime

    completed_at: datetime | None

    time_taken: int | None

    time_complexity: str

    space_complexity: str

    llm_feedback: str

    optimization_hint: str

    model: str


@dataclass(slots=True)
class GithubSolution:

    language: str

    source_code: str


@dataclass(slots=True)
class GithubDirectory:

    path: str

    name: str

    sha: str


@dataclass(slots=True)
class GithubFile:

    path: str

    name: str

    sha: str

    size: int