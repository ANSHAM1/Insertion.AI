from __future__ import annotations

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field



class JobProvider(str, Enum):
    GREENHOUSE = "greenhouse"
    LEVER = "lever"
    ASHBY = "ashby"
    SMART_RECRUITERS = "smartrecruiters"
    WORKDAY = "workday"

class EmploymentType(str, Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    INTERN = "intern"
    TEMPORARY = "temporary"
    UNKNOWN = "unknown"




class JobSearchQuery(BaseModel):
    """
    Common search query accepted by every provider.
    """
    keywords         : list[str]            = Field(default_factory=list)

    locations        : list[str]            = Field(default_factory=list)

    remote_only      : bool                 = False

    worldwide        : bool                 = False

    employment_types : list[EmploymentType] = Field(default_factory=list) # type: ignore
    
    limit            : int                  = 50



class JobPosting(BaseModel):
    """
    Normalized job posting returned by every provider.
    """
    provider        : JobProvider

    external_id     : str

    company         : str

    role            : str

    location        : str | None      = None

    employment_type : EmploymentType  = EmploymentType.UNKNOWN

    remote          : bool            = False

    description     : str             = ""

    apply_url       : str

    posted_at       : datetime | None = None