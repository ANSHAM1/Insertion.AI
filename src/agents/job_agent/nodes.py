from typing import Any
from datetime import date

from src.database.models import Job

from src.agents.job_agent.state import JobState
from src.services.hirebase_service import fetch_jobs

from src.prompts.job_prompt import job_prompt
from src.ai.llm_factory import FailoverLLM

from src.validators.Hirebase_output import JobModelOutput

from src.config.settings import get_settings


def search_jobs_node(state: JobState) -> dict[str, Any]:

    last_sync = state["app_state"].JOB_STATE()

    if last_sync and last_sync.date() == date.today():
        return {
            "terminate" : True
        }

    jobs = fetch_jobs(limit=get_settings().DAILY_JON_SEARCH_LIMIT)

    if not jobs:
        return {
            "terminate" : True
        }
    
    duplicate_ids = set(state["job_repo"].bulk_exists([job.id for job in jobs]))

    new_jobs = [job for job in jobs if job.id not in duplicate_ids]

    if not new_jobs:
        return {
            "terminate": True
        }

    return {
        "jobs"      :  new_jobs,
        "terminate" : False
    }



def terminate_router(state: JobState) -> str:
    if state["terminate"]:
        return "true"
    return "false"



def build_prompt_node(state: JobState) -> dict[str, Any]:

    prompt = job_prompt.invoke(
        {
            "resumes" : state["resume"],
            "jobs"    : state["jobs"]
        }
    )

    return {
        "prompt" : prompt
    }



def llm_inference_node(state: JobState) -> dict[str, Any]:

    response = FailoverLLM.get_structured_output_from_llm(state["prompt"], schema=JobModelOutput, temperature=0)

    if response is None:
        return {
            "terminate" : True
        }

    return {
        "output"     : response,
        "terminate" : False
    }



def save_node(state: JobState) -> dict[str, Any]:

    llm_approved = {analysis.id : analysis for analysis in state["output"].jobs}

    try:
        for fetched_job in state["jobs"]:

            approved = llm_approved.get(fetched_job.id)
            if approved is None:
                continue

            state["job_repo"].add(
                Job(
                    id                       = fetched_job.id,
                    company                  = fetched_job.company,
                    role                     = fetched_job.title,
                    description              = fetched_job.description,
                    requirements_summary     = fetched_job.requirements_summary,
                    job_type                 = fetched_job.job_type,
                    location                 = fetched_job.location,
                    location_type            = fetched_job.location_type,
                    experience_level         = approved.experience_level,
                    experience_min           = fetched_job.experience.min,
                    experience_max           = fetched_job.experience.max,
                    education_level          = fetched_job.education_level,
                    skills                   = fetched_job.skills,
                    technologies             = fetched_job.technologies,
                    required_skills          = approved.required_skills,
                    missing_skills           = approved.missing_skills,
                    matched_resume           = approved.matched_resume,
                    matched_percentage       = approved.matched_percentage,
                    flexibility_score        = fetched_job.flexibility_score,
                    compensation_value_score = fetched_job.compensation_value_score,
                    prestige_score           = fetched_job.prestige_score,
                    growth_score             = fetched_job.growth_score,
                    apply_url                = fetched_job.apply_url,
                    posted_at                = fetched_job.posted_at,
                )
            )

        state["job_repo"].bulk_insert([job.id for job in state["jobs"]])

        state["job_repo"].commit()

        state["app_state"].JOB_SYNC(state["timestamp"])

    except Exception:
        raise

    return {}