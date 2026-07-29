from pydantic import BaseModel
from datetime import datetime

from src.database.enums import EventType, EmploymentType, RecruitmentType, JobStatus, EventSource



class EventOutput(BaseModel):
    title       : str
    description : str | None
    event_type  : EventType
    start_time  : datetime
    end_time    : datetime | None
    source      : EventSource


class JobOutput(BaseModel):
    company          : str
    description      : str | None
    role             : str
    employment_type  : EmploymentType | None
    recruitment_type : RecruitmentType | None
    location         : str | None
    salary           : str | None
    bond             : int | None
    apply_url        : str | None


class EmailOutput(BaseModel):
    gmail_message_id : str
    gmail_thread_id  : str

    detected_status  : JobStatus | None

    subject          : str | None
    sender_name      : str | None
    sender_email     : str

    received_at      : datetime

    summary          : str | None


class CollegeOutput(BaseModel):
    events : list[EventOutput] = []
    jobs   : list[JobOutput]   = []
    emails : list[EmailOutput] = []