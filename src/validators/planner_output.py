from pydantic import BaseModel, Field
from typing import Optional



class ScheduleItemOutput(BaseModel):
    title      : str = Field(min_length=1, max_length=150)

    start_time : str = Field(pattern=r"^([01]\d|2[0-3]):([0-5]\d)$")
    end_time   : str = Field(pattern=r"^([01]\d|2[0-3]):([0-5]\d)$")

    sort_order : int = Field(ge=1)

    completed  : bool

    note       : Optional[str] = None



class PlannerOutput(BaseModel):
    items           : list[ScheduleItemOutput]