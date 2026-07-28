from datetime import date
from pydantic import BaseModel, ConfigDict

class JobClass(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id               : str

    company          : str
    description      : str
    role             : str 
    employment_type  : str

    location         : str

    salary_min       : float
    salary_max       : float 
    salary_predicted : bool 

    apply_url        : str 

    posted_at        : date 