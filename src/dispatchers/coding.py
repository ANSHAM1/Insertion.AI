from datetime import date, datetime
from typing import Any

from src.database.repository import CodingRepository

from src.fetcher.github.models import Question, FrontendMetadata, Metadata
from src.fetcher.github.repository import GithubRepository

from src.agents.code_agent.evaluator.workflow import evaluator_graph
from src.agents.code_agent.generator.workflow import generator_graph

from .base import InsertionAIDispatch


class CodingGeneratorDispatch(InsertionAIDispatch):

    def __init__(self, user_prompt: str):
        super().__init__()
        self.user_prompt = user_prompt
        
    def _helper(self, questions: list[tuple[date, list[Question]]]) -> dict[str, Any]:
        return {
            "items": [
                {
                    "generated_date": generated_date.isoformat(),
                    "questions": [
                        q.model_dump(mode="json")
                        for q in questions
                    ],
                }
                for generated_date, questions in questions
            ]
        }

    def invoke(self):

        state: dict[str, Any] = {
            "curr_date": date.today(),
            "timestamp": datetime.now(),

            "app_state": self.app_state,

            "questions": [],
            "old_questions": [],

            "user_prompt": self.user_prompt,
            "prompt": "",

            "terminate": False
        }

        generator_graph.invoke(state)  # type: ignore

        git_repo = GithubRepository()

        return self._helper(git_repo.fetch_all_questions())

    def refresh_questions(self):

        git_repo = GithubRepository()

        return self._helper(git_repo.fetch_all_questions())


class CodingEvaluatorDispatch(InsertionAIDispatch):

    def __init__(self, question: dict[str, Any], generated_date: str, solution: str, frontend_meta: dict[str, Any]):
        super().__init__()
        self.question = Question.model_validate(question)
        self.generated_date = generated_date
        self.solution = solution
        self.frontend_meta = FrontendMetadata.model_validate(frontend_meta)

    def _helper(self, metadata : Metadata) -> dict[str, Any]:
        return metadata.model_dump(mode="json")

    def invoke(self) -> dict[str, Any]:

        state: dict[str, Any] = {
            "curr_date": date.today(),
            "timestamp": datetime.now(),

            "question": self.question,
            "generated_date": date.fromisoformat(self.generated_date),

            "solution": self.solution,

            "code_repo": CodingRepository(self.db),

            "frontend_meta": self.frontend_meta,
            "ai_metadata": None,
            "metadata": None,

            "prompt": "",
            "llm_failed": False,

            "uploaded": False,
        }

        evaluator_graph.invoke(state)  # type: ignore

    
        repo = CodingRepository(self.db)
        github_path = repo.get_path(self.question.question_id, self.frontend_meta.started_at)

        if not github_path:
            raise RuntimeError("solution entry not present")

        git_repo = GithubRepository()
        
        return self._helper(git_repo.fetch_metadata(github_path))


def generator(command: str, payload: dict[Any, Any]):
    app = CodingGeneratorDispatch(payload["user_prompt"])

    try:
        if command == "generator":
            return app.invoke()

        elif command == "refresh_questions":
            return app.refresh_questions()

        raise ValueError(f"Unknown generator command: {command}")

    finally:
        app.close()


def evaluator(command: str, payload: dict[Any, Any]):
    app = CodingEvaluatorDispatch(
        question=payload["question"],
        generated_date=payload["generated_date"],
        solution=payload["solution"],
        frontend_meta=payload["frontend_meta"]
    )

    try:
        if command == "evaluator":
            return app.invoke()

        raise ValueError(f"Unknown evaluator command: {command}")

    finally:
        app.close()
