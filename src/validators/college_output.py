from datetime import date, datetime
from pydantic import BaseModel

from src.database.enums import (EmploymentType, RecruitmentType)



class CollegeDrive(BaseModel):
    drive_ref_id     : str 

    company          : str
    role             : str
    description      : str | None
    employment_type  : EmploymentType | None
    recruitment_type : RecruitmentType | None

    drive_date       : date | None
    report_time      : datetime | None

    location         : str | None
    venue            : str | None

    salary           : str | None
    bond             : int | None

    apply_url        : str | None


class CollegeDriveOutput(BaseModel):
    drives: list[CollegeDrive]