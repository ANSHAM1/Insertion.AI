from typing import Any

from pydantic import BaseModel
from langchain_core.prompts import ChatPromptTemplate

from src.ai.llm_factory import FailoverLLM
from src.fetcher.github.models import TestCase


class CodeRunResult(BaseModel):
    testcase: TestCase
    output_from_code: str
    passed: bool
    runtime_error: str | None = None


class CodeRunResults(BaseModel):
    compiletime_error: str | None = None
    language_error: str | None = None
    results: list[CodeRunResult]



testcase_result_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are a coding testcase evaluator.

1. Verify that the submitted code language matches the provided language.
   If they do not match, return a compiler error.

2. The submitted code may contain either:
   - a complete class containing the required function, or
   - only the function containing the core algorithm.

   Treat this as valid code.

3. Do not consider environment, file-name, wrapper, dependency, or execution
   environment issues. They are not compiler errors for this evaluation.

4. Your main task is to dry-run the submitted code for every testcase.

For each testcase:
- Determine the exact output produced by the code.
- Compare it with the expected testcase output.
- Set `passed` to true if they match, otherwise false.
- If the code encounters a runtime error during the dry run, report it.

Do not modify, fix, optimize, or reinterpret the submitted code.

Return ONLY the structured output.
"""
        ),
        (
            "human",
            """
Problem Summary:
{summary}

Provided Language:
{language}

Submitted Code:
{solution}

Test Cases:
{testcases}
"""
        ),
    ]
)


def run_code(question_summary: str, solution: str, testcases: list[TestCase], language: str) -> CodeRunResults:

    prompt = testcase_result_prompt.invoke(
        {
            "summary": question_summary,
            "language": language,
            "solution": solution,
            "testcases": testcases,
        }
    )

    try:
        return FailoverLLM.get_structured_output_from_llm(
            prompt,
            schema=CodeRunResults,
            temperature=0,
        )
    except Exception as e:
        raise RuntimeError("Failed to run code.") from e


def code_runner(command: str, payload: dict[str, Any]) -> dict[str, Any]:

    testcase_results = run_code(
        question_summary=payload["question_summary"],
        solution=payload["solution"],
        testcases=payload["testcases"],
        language=payload["language"],
    )

    return testcase_results.model_dump()