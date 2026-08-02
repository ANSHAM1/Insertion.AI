from pydantic import BaseModel, Field
from datetime import datetime

from src.fetcher.github.models import Question, TestCase
from src.database.enums import (CodingStatus, ProgrammingLanguage)



class QuestionsOutput(BaseModel):

    questions : list[Question]



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