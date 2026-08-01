# src/github/repository.py

import json
from datetime import date, datetime
from typing import Any

from src.fetcher.github.storage import GithubStorage


class GithubRepository:

    ROOT = "coding"

    def __init__(self) -> None:
        self.storage = GithubStorage()

    def close(self) -> None:
        self.storage.close()

    # Path Helpers
    # ------------------------------------------------------------------

    def _question_folder(self, generated_date: date, question_id: str) -> str:

        return (
            f"{self.ROOT}/"
            f"{generated_date.year:04d}/"
            f"{generated_date.month:02d}/"
            f"{generated_date.day:02d}/"
            f"{question_id}"
        )

    def _solution_folder(self, generated_date: date, question_id: str, started_at: datetime) -> str:

        folder = self._question_folder(generated_date, question_id)

        timestamp = started_at.strftime("%Y%m%d_%H%M%S")

        return f"{folder}/solutions/{timestamp}"

    # Question
    # ------------------------------------------------------------------

    def create_question(self, generated_date: date, question_id: str, question: dict[str, Any]) -> str:

        folder = self._question_folder(generated_date, question_id)

        path = f"{folder}/question.json"

        self.storage.upload(
            path=path,
            content=json.dumps(
                question,
                indent=4,
            ),
            message=f"Create {question_id}",
        )

        return folder

    def fetch_question(self, generated_date: date, question_id: str) -> dict[str, Any]:

        folder = self._question_folder(
            generated_date,
            question_id,
        )

        text = self.storage.read_text(
            f"{folder}/question.json"
        )

        return json.loads(text)

    # Solution
    # ------------------------------------------------------------------

    def upload_solution(self, generated_date: date, question_id: str, started_at: datetime, language: str, source: str) -> str:

        folder = self._solution_folder(generated_date, question_id, started_at)

        extension = {
            "cpp": "cpp",
            "python": "py",
            "java": "java",
        }[language]

        path = f"{folder}/solution.{extension}"

        self.storage.upload(
            path=path,
            content=source,
            message=f"Solve {question_id}",
        )

        return folder

    def fetch_solution(self, github_path: str, language: str) -> str:

        extension = {
            "cpp": "cpp",
            "python": "py",
            "java": "java",
        }[language]

        return self.storage.read_text(
            f"{github_path}/solution.{extension}"
        )

    # Metadata
    # ------------------------------------------------------------------

    def upload_metadata(self, github_path: str, metadata: dict[str, Any]) -> None:

        self.storage.upload(
            path=f"{github_path}/metadata.json",
            content=json.dumps(
                metadata,
                indent=4,
            ),
            message="Add metadata",
        )

    def fetch_metadata(self, github_path: str) -> dict[str, Any]:

        text = self.storage.read_text(
            f"{github_path}/metadata.json"
        )

        return json.loads(text)

    # Helpers
    # ------------------------------------------------------------------

    def question_exists(self, generated_date: date, question_id: str) -> bool:

        folder = self._question_folder(
            generated_date,
            question_id,
        )

        return self.storage.exists(
            f"{folder}/question.json"
        )

    def solution_exists(self, github_path: str, language: str) -> bool:

        extension = {
            "cpp": "cpp",
            "python": "py",
            "java": "java",
        }[language]

        return self.storage.exists(
            f"{github_path}/solution.{extension}"
        )