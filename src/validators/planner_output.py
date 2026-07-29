from pydantic import BaseModel, Field, ValidationError
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



def validate_schedule(raw_json: str) -> Optional[PlannerOutput]:
    try:
        return PlannerOutput.model_validate_json(raw_json)

    except ValidationError:
        return None

    except Exception:
        return None