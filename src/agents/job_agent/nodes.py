from typing import Any

from src.database.models import Job

from src.agents.job_agent.state import JobState
from src.services.job_service import fetch_jobs

from src.prompts.job_prompt import job_prompt
from src.ai.llm_factor import FailoverLLM

from src.validators.job_output import JobOutput



def search_jobs_node(state: JobState) -> dict[str, Any]:

    last_sync = state["app_state"].JOB_STATE()

    jobs = fetch_jobs(last_sync)

    if not jobs:
        return {
            "jobs": []
        }
    
    duplicate_ids = set(state["job_repo"].bulk_exists([job.id for job in jobs]))

    new_jobs = [job for job in jobs if job.id not in duplicate_ids]

    return {
        "jobs" :  new_jobs
    }



def valid_jobs_router(state: JobState) -> str:
    return "build_prompt" if state["jobs"] else "end"



def build_prompt_node(state: JobState) -> dict[str, Any]:

    prompt = job_prompt.invoke(
        {
            "candidate_profile" : state["resume"],
            "jobs"              : state["jobs"]
        }
    )

    return {
        "prompt" : prompt
    }



def llm_inference_node(state: JobState) -> dict[str, Any]:

    response = FailoverLLM.get_structured_output_from_llm(state["prompt"], schema=JobOutput, temperature=0)

    if response is None:
        return {
            "llm_failed" : True
        }

    return {
        "output"     : response,
        "llm_failed" : False
    }



def llm_status_router(state: JobState) -> str:
    return "save" if not state["llm_failed"] else "end"



def save_node(state: JobState) -> dict[str, Any]:

    llm_approved = {analysis.id : analysis for analysis in state["output"].jobs}

    try:
        for fetched_job in state["jobs"]:

            approved = llm_approved.get(fetched_job.id)
            if approved is None:
                continue

            state["job_repo"].add(
                Job(
                    id                 = fetched_job.id,

                    company            = approved.company,
                    description        = approved.description,
                    role               = approved.role,

                    employment_type    = approved.employment_type,
                    recruitment_type   = approved.recruitment_type,

                    location           = fetched_job.location,
                    salary_min         = fetched_job.salary_min,
                    salary_max         = fetched_job.salary_max,

                    apply_url          = fetched_job.apply_url,
                    experience_min     = approved.experience_min,

                    posted_at          = fetched_job.posted_at,

                    required_skills    = approved.required_skills,
                    missing_skills     = approved.missing_skills,

                    matched_resume     = approved.matched_resume,
                    matched_percentage = approved.matched_percentage
                )
            )

        state["job_repo"].bulk_insert([job.id for job in state["jobs"]])

        state["job_repo"].commit()

        state["app_state"].JOB_SYNC(state["timestamp"])

    except Exception:
        raise

    return {}