from pydantic import BaseModel, Field

from src.fetcher.github.models import Question
from src.database.enums import CodingStatus



class QuestionsOutput(BaseModel):

    questions: list[Question] = Field(min_length=1, max_length=1)


class AIMetadataOutput(BaseModel):
    
    question_id         : str

    status              : CodingStatus

    score               : int = Field(ge=0, le=100)

    time_complexity     : str

    space_complexity    : str

    feedback            : str

    optimization_hint   : str 