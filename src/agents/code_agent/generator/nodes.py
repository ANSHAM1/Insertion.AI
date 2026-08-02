from datetime import timedelta, datetime
from typing import Any

from src.fetcher.github.repository import GithubRepository
from src.fetcher.github.models import Question

from src.prompts.code_generator_prompt import code_generator_prompt
from src.ai.llm_factory import FailoverLLM

from src.agents.code_agent.generator.state import GeneratorState

from src.validators.code_output import QuestionsOutput



def fetch_github_node(state : GeneratorState) -> dict[str, Any]:

    last_sync = state["app_state"].CODE_STATE()

    if last_sync and last_sync.date() ==  state["curr_date"]:
        return {
            "terminate" : True
        }

    fetcher = GithubRepository()

    old_list : list[Question] = []

    for day in range(5):
        dir_items = fetcher.fetch_directory(state["curr_date"] - timedelta(days=day))
        old_list.extend(dir_items)

    return {
        "terminate" : False,
        "old_questions" : [question.summary for question in old_list],
    }



def fetch_router(state : GeneratorState) -> str:

    if state["terminate"]:
        return "end"

    return "prompt"



def prompt_builder_node(state : GeneratorState) -> dict[str, Any]:

    prompt = code_generator_prompt.invoke({
            "user_prompt": state["user_prompt"],
            "old_questions_summary": state["old_questions"]
    })

    return {
        "prompt" : prompt
    }



def llm_inference_node(state : GeneratorState) -> dict[str, Any]:

    response = FailoverLLM.get_structured_output_from_llm(state["prompt"], schema=QuestionsOutput, temperature=0)

    if response is None:
        return {
            "llm_failed" : True
        }

    return {
        "questions" : response,
        "llm_failed"   : False
    }



def validation_router(state : GeneratorState) -> str:

    if state["llm_failed"]:
        return "failed"

    return "save"



def upload_node(state : GeneratorState) -> dict[str, Any]:

    uploader = GithubRepository()

    for question in state["questions"]:
        uploader.upload_question(state["curr_date"], question)

    state["app_state"].CODE_SYNC(datetime.now())

    return {}