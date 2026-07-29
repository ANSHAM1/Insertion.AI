from typing import Any, cast

from src.agents.college_agent.state import CollegeState

from src.prompts.college_prompt import college_prompt

from src.ai.llm_factor import LLMFactory

from src.validators.college_output import CollegeOutput

from src.fetcher.gmail.pre_filter import filter_emails
from src.services.gmail_service import fetch_emails



def fetch_gmails_node(state : CollegeState) -> dict[str, Any]:

    last_sync = state["app_state"].GMAIL_STATE("college")

    emails, message_ids, latest_hist_id = fetch_emails("college", last_sync)

    filtered = state["gmail_repo"].filter_new_emails(message_ids)
    filtered_set = set(filtered)
    emails = [email for email in emails if email.gmail_message_id in filtered_set]

    emails = filter_emails(emails)

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
        "curr_date": state["curr_date"],
        "emails": state["emails"],
    })

    return {
        "prompt": prompt,
    }



def llm_node(state: CollegeState) -> dict[str, Any]:

    llm = LLMFactory.email().with_structured_output(CollegeOutput) # type: ignore

    response: CollegeOutput = cast(CollegeOutput, llm.invoke(state["prompt"]))

    return {
        "output": response,
    }



def save_node(state: CollegeState) -> dict[str, Any]:

    result = state["output"]

    try:
        for event in result.events:
            state["event_repo"].add(cast(Any, event))

        for job in result.jobs:
            state["job_colleg_repo"].add(cast(Any, job))

        for email in result.emails:
            state["gmail_repo"].add(cast(Any, email))

    except Exception:
        raise

    return {}



def sync_node(state: CollegeState) -> dict[str, Any]:

    state["app_state"].GMAIL_SYNC(
        account="COLLEDGE",
        latest_hist_id=state["latest_hist_id"],
    )

    return {}