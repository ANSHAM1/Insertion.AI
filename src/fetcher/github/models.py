from datetime import datetime

from pydantic import BaseModel, Field

from src.database.enums import (CodingDifficulty, ProgrammingLanguage, CodingStatus)


class Example(BaseModel):

    input       : str

    output      : str

    explanation : str | None = None


class TestCase(BaseModel):

    input  : str

    output : str


class TestCaseResult(BaseModel):

    testcase : TestCase

    passed   : bool


class Question(BaseModel):

    question_id    : str

    title          : str

    difficulty     : CodingDifficulty

    statement      : str

    summary        : str = Field(description="one line signature summary of question and not underlying algorithm")

    constraints    : list[str]

    examples       : list[Example]

    testcases      : list[TestCase]  = Field(min_length=3, max_length=4)

    topics         : list[str]

    time_limit     : int = Field(gt=0)


class FrontendMetadata(BaseModel):

    question_id         : str

    language            : ProgrammingLanguage

    started_at          : datetime

    submitted_at        : datetime

    time_taken          : int = Field(ge=0)

    passed_public_tests : list[TestCaseResult]



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

    passed_public_tests : list[TestCaseResult]

    feedback            : str

    optimization_hint   : str 


class GithubFile(BaseModel):

    path : str

    name : str