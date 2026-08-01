from datetime import datetime

from pydantic import BaseModel, Field

from src.database.enums import (CodingDifficulty, CodingStatus, ProgrammingLanguage)


class Example(BaseModel):

    input       : str

    output      : str

    explanation : str | None = None


class TestCase(BaseModel):

    input  : str

    output : str



class Question(BaseModel):

    question_id   : str

    title         : str

    difficulty    : CodingDifficulty

    statement     : str

    summary       : str = Field(description="one line signature summary of question and not underlying algorithm")

    constraints   : list[str]

    examples      : list[Example]

    testcases     : list[TestCase] 

    topics        : list[str]

    template      : str

    time_limit    : int = Field(gt=0)

    created_at    : datetime


class Metadata(BaseModel):

    question_id         : str

    language            : ProgrammingLanguage

    status              : CodingStatus

    score               : int = Field(ge=0, le=100)

    started_at          : datetime

    submitted_at        : datetime

    time_taken          : int = Field(ge=0)

    time_complexity     : str

    space_complexity    : str

    passed_public_tests : dict[TestCase, bool]

    feedback            : str

    optimization_hint   : str 


class GithubFile(BaseModel):

    path: str

    content: str