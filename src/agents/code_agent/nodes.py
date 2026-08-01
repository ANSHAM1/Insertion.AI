from typing import Any

from src.database.models import CollegeDrive
from src.agents.code_agent.state import CodeState

from src.prompts.college_prompt import college_prompt
from src.ai.llm_factor import FailoverLLM

from src.validators.college_output import CollegeDriveOutput

from src.services.gmail_service import fetch_emails


from src.dispatcher import PlannerDispatch


def fetch_schedule_node(state: CodeState) -> dict[str, Any]:


    return {
        "emails"         : emails,
        "latest_hist_id" : latest_hist_id,
    }



def fetch_router(state: CollegeState) -> str:

    if not state["emails"]:
        return "end"

    return "prompt"



def prompt_node(state: CollegeState) -> dict[str, Any]:

    prompt = college_prompt.invoke({
        "curr_date" : state["curr_date"],
        "emails"    : state["emails"],
    })

    return {
        "prompt": prompt,
    }



def llm_inference_node(state: CollegeState) -> dict[str, Any]:

    response = FailoverLLM.get_structured_output_from_llm(state["prompt"], schema=CollegeDriveOutput, temperature=0)

    if response is None:
        return {
            "llm_failed" : True
        }

    return {
        "output" : response,
        "llm_failed"   : False
    }



def validation_router(state: CollegeState) -> str:

    if state["llm_failed"]:
        return "failed"

    return "save"



def save_node(state: CollegeState) -> dict[str, Any]:

    college_drives = state["output"].drives

    try:

        for drive in college_drives:
            state["drives_repo"].add_if_not_exists(
                CollegeDrive(
                    drive_ref_id     = drive.drive_ref_id,
                    company          = drive.company,
                    role             = drive.role,
                    description      = drive.description,
                    employment_type  = drive.employment_type,
                    recruitment_type = drive.recruitment_type,
                    drive_date       = drive.drive_date,
                    report_time      = drive.report_time,
                    location         = drive.location,
                    venue            = drive.venue,
                    salary           = drive.salary,
                    bond             = drive.bond,
                    apply_url        = drive.apply_url,
                    skills           = drive.skills
                )
            )

        state["drives_repo"].commit()

    except Exception:
        state["drives_repo"].rollback()
        raise

    state["app_state"].GMAIL_SYNC(
        account="college",
        latest_hist_id=state["latest_hist_id"],
    )

    return {}