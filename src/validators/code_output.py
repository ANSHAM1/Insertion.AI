from pydantic import BaseModel, Field

from src.fetcher.github.models import Question
from src.database.enums import CodingStatus

from src.config.settings import get_settings



class QuestionsOutput(BaseModel):

    questions: list[Question] = Field(
        min_length=get_settings().DAILY_QUESTION_GENERATION_COUNT, 
        max_length=get_settings().DAILY_QUESTION_GENERATION_COUNT
        )


class AIMetadataOutput(BaseModel):
    
    question_id         : str

    status              : CodingStatus

    score               : int = Field(ge=0, le=100)

    time_complexity     : str

    space_complexity    : str

    feedback            : str

    optimization_hint   : str 