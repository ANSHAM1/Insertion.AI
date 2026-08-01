# src/fetcher/github/repository.py

from datetime import date, datetime

from src.fetcher.github.models import (Metadata, Question)
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

        return (
            f"{self._question_folder(generated_date, question_id)}"
            f"/solutions/{started_at.strftime('%Y%m%d_%H%M%S')}"
        )

    def _directory_by_date(self, generated_date: date) -> str:

        return (
            f"{self.ROOT}/"
            f"{generated_date.year:04d}/"
            f"{generated_date.month:02d}/"
            f"{generated_date.day:02d}"
        )

    @staticmethod
    def _extension(language: str) -> str:

        return {
            "cpp": "cpp",
            "python": "py",
            "java": "java",
        }[language.lower()]

    # Directory
    # ------------------------------------------------------------------

    def upload_directory(self, generated_date: date, questions: list[Question]) -> None:

        for question in questions:
            self.upload_question(generated_date, question)

    def fetch_directory(self, generated_date : date) -> list[Question]:

        directory = self._directory_by_date(generated_date)

        list_files = self.storage.list_directory(directory)

        fetched_questions : list[Question] = []

        for file in list_files:
            question_id = file["name"]

            if not self.question_exists(generated_date, question_id):
                continue

            fetched_questions.append(self.fetch_question(generated_date, question_id))

        return fetched_questions


    # Question
    # ------------------------------------------------------------------

    def upload_question(self, generated_date: date, question: Question) -> str:

        folder = self._question_folder(
            generated_date,
            question.question_id,
        )

        self.storage.upload(
            path=f"{folder}/question.json",
            content=question.model_dump_json(indent=4),
            message=f"Create Question {question.question_id}",
        )

        return folder

    def fetch_question(self, generated_date: date, question_id: str) -> Question:

        folder = self._question_folder(
            generated_date,
            question_id,
        )

        return Question.model_validate_json(
            self.storage.read_text(
                f"{folder}/question.json"
            )
        )


    # Solution
    # ------------------------------------------------------------------

    def upload_solution(self, github_path: str, language: str, source_code: str) -> None:

        self.storage.upload(
            path=f"{github_path}/solution.{self._extension(language)}",
            content=source_code,
            message="Upload Solution",
        )

    def fetch_solution(self, github_path: str, language: str) -> str:

        return self.storage.read_text(
            f"{github_path}/solution.{self._extension(language)}"
        )

    # Metadata
    # ------------------------------------------------------------------

    def upload_metadata(self, github_path: str, metadata: Metadata) -> None:

        self.storage.upload(
            path=f"{github_path}/metadata.json",
            content=metadata.model_dump_json(indent=4),
            message="Upload Metadata",
        )

    def fetch_metadata(self, github_path: str) -> Metadata:

        return Metadata.model_validate_json(
            self.storage.read_text(
                f"{github_path}/metadata.json"
            )
        )

    # Helpers
    # ------------------------------------------------------------------

    def question_exists(self, generated_date: date, question_id: str) -> bool:

        return self.storage.exists(
            f"{self._question_folder(generated_date, question_id)}/question.json"
        )

    def solution_exists(self, github_path: str, language: str) -> bool:

        return self.storage.exists(
            f"{github_path}/solution.{self._extension(language)}"
        )

    def metadata_exists(self, github_path: str) -> bool:

        return self.storage.exists(
            f"{github_path}/metadata.json"
        )