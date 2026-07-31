from pydantic import BaseModel, Field
from typing import Optional
from datetime import time



class ScheduleItemOutput(BaseModel):
    title      : str = Field(min_length=1, max_length=150)

    start_time : time
    end_time   : time

    completed  : bool

    note       : Optional[str] = None



class PlannerOutput(BaseModel):
    items           : list[ScheduleItemOutput]