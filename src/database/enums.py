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



class RecruitmentType(str, Enum):
    ONCAMPUS  = "ONCAMPUS"
    OFFCAMPUS = "OFFCAMPUS"
