from datetime import timedelta, datetime
from typing import Any
from uuid import uuid4

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
            "terminate" : True,
            "old_questions": []
        }

    fetcher = GithubRepository()

    try:
        old_questions: list[Question] = []

        for day in range(5):
            generated_date = state["curr_date"] - timedelta(days=day)

            old_questions.extend(
                fetcher.fetch_directory(generated_date)
            )

    finally:
        fetcher.close()

    return {
        "terminate": False,
        "old_questions": [question.summary for question in old_questions],
    }



def terminate_router(state : GeneratorState) -> str:

    if state["terminate"]:
        return "yes"

    return "no"



def prompt_builder_node(state : GeneratorState) -> dict[str, Any]:

    prompt = code_generator_prompt.invoke({
            "user_prompt": state["user_prompt"],
            "old_questions_summary": state["old_questions"]
    })

    return {
        "prompt" : prompt
    }



def generate_question_id() -> str:
    return f"QT{uuid4().hex[:8].upper()}"


def llm_inference_node(state : GeneratorState) -> dict[str, Any]:

    try:
        response = FailoverLLM.get_structured_output_openai_gpt_4_1(state["prompt"], schema=QuestionsOutput, temperature=0.5)

    except Exception:
        import traceback
        traceback.print_exc()
        raise
    
    if response is None:
        return {
            "terminate" : True
        }

    for question in response.questions:
        question.question_id = generate_question_id()

    return {
        "questions": response.questions,
        "terminate": False,
    }



def upload_node(state : GeneratorState) -> dict[str, Any]:

    uploader = GithubRepository()

    for question in state["questions"]:
        uploader.upload_question(state["curr_date"], question)

    state["app_state"].CODE_SYNC(datetime.now())

    return {}