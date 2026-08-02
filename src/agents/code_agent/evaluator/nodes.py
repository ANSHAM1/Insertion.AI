from typing import Any
from datetime import timedelta

from src.agents.code_agent.evaluator.state import GeneratorState
from src.prompts.code_evaluator_prompt import code_evaluator_prompt

from ai.llm_factory import FailoverLLM

from src.fetcher.github.models import Metadata

from src.validators.code_output import AIMetadataOutput
from src.fetcher.github.repository import GithubRepository

from src.database.models import CodeSolution


def prompt_builder_node(state: GeneratorState) -> dict[str, Any]:

    prompt = code_evaluator_prompt.invoke(
        {
            "question": state["question"],
            "solution": state["solution"],
        }
    )

    return {
        "prompt": prompt,
    }



def llm_inference_node(state: GeneratorState) -> dict[str, Any]:

    response = FailoverLLM.get_structured_output_from_llm(state["prompt"], schema=AIMetadataOutput, temperature=0)

    if response is None:
        return {
            "llm_failed": True,
        }

    return {
        "metadata": response,
        "llm_failed": False,
    }



def validation_router(state: GeneratorState) -> str:

    if state["llm_failed"]:
        return "failed"

    return "save"



def metadata_builder_node(state: GeneratorState) -> dict[str, Any]:

    ai = state["metadata"]

    if not ai:
        raise RuntimeError("Missing AI metadata")

    frontend = state["frontend_meta"]

    metadata = Metadata(
        question_id         = frontend.question_id,
        language            = frontend.language,
        status              = ai.status,
        score               = ai.score,
        started_at          = frontend.started_at,
        submitted_at        = frontend.submitted_at,
        time_taken          = frontend.time_taken,
        time_complexity     = ai.time_complexity,
        space_complexity    = ai.space_complexity,
        passed_public_tests = frontend.passed_public_tests,
        feedback            = ai.feedback,
        optimization_hint   = ai.optimization_hint
    )

    return {
        "metadata": metadata,
    }



def upload_node(state: GeneratorState) -> dict[str, Any]:

    metadata = state["metadata"]

    if not metadata:
        return {
            "uploaded" : False
        }

    gitrepo = GithubRepository()   

    dbrepo = state["code_repo"]

    try:

        github_path = gitrepo.solution_folder(
            state["generated_date"], 
            state["question"].question_id,
            state["frontend_meta"].started_at,
        )

        gitrepo.upload_solution(github_path, state["frontend_meta"].language.value.lower(), state["solution"])

        gitrepo.upload_metadata(github_path, metadata)

        dbrepo.add(
            CodeSolution(
                    generated_date = state["generated_date"],
                    question_id    = metadata.question_id,
                    solution_name  = metadata.started_at.strftime('%Y%m%d_%H%M%S'),
                    title          = state["question"].title,
                    difficulty     = state["question"].difficulty,
                    status         = metadata.status,
                    language       = metadata.language,
                    score          = metadata.score,
                    time_taken     = metadata.time_taken,
                    started_at     = metadata.started_at,
                    completed_at   = metadata.started_at + timedelta(minutes=metadata.time_taken),
                    github_path    = github_path
            )
        )

        dbrepo.commit()

    except:

        dbrepo.rollback()
        return {
            "uploaded" : False
        }

    return {
        "uploaded": True,
    }