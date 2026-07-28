from enum import Enum


class JobStatus(str, Enum):
    FOUND      = "FOUND"
    APPLIED    = "APPLIED"
    OA         = "OA"
    INTERVIEW  = "INTERVIEW"
    HR         = "HR"
    OFFER      = "OFFER"
    REJECTED   = "REJECTED"
    ACCEPTED   = "ACCEPTED"
    WITHDRAWN  = "WITHDRAWN"


class EmploymentType(str, Enum):
    INTERNSHIP = "INTERNSHIP"
    FULL_TIME  = "FULL_TIME"
    PART_TIME  = "PART_TIME"
    CONTRACT   = "CONTRACT"


class EmailAccount(str, Enum):
    COLLEGE       = "COLLEGE"
    PERSONAL_MAIN = "PERSONAL_MAIN"
    PERSONAL_ALT  = "PERSONAL_ALT"


class RecruitmentType(str, Enum):
    ONCAMPUS  = "ONCAMPUS"
    OFFCAMPUS = "OFFCAMPUS"


class EventType(Enum):
    MANUAL    = "MANUAL"
    REMINDER  = "REMINDER"
    OA        = "OA"
    INTERVIEW = "INTERVIEW"
    HR        = "HR"
    OFFER     = "OFFER"
    DEADLINE  = "DEADLINE"
    OTHER     = "OTHER"


class EventSource(Enum):
    EMAIL = "EMAIL"
    USER  = "USER"
    AI    = "AI"