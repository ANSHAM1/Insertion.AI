from pydantic import BaseModel

from src.database.models import CodingQuestion
from src.fetcher.github.models import Question, Metadata



class QuestionsOutput(BaseModel):

    questions : list[Question]



class Solution(BaseModel):

    question_id : str

    metadata     : Metadata

    database     : CodingQuestion


class SolutionsOutput(BaseModel):

    solutions : list[Solution]
