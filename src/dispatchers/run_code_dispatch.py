from typing import Any

from pydantic import BaseModel

from langchain_core.prompts import ChatPromptTemplate

from src.ai.llm_factory import FailoverLLM
from src.fetcher.github.models import TestCase


class CodeRunResult(BaseModel):
    testcase         : TestCase
    output_from_code : str
    passed           : bool
    runtime_error    : str | None = None


class CodeRunResults(BaseModel):
    compiletime_error : str | None = None
    results           : list[CodeRunResult]


testcase_result_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are an expert software engineer and code dry runner.

You are given:
1. A coding question summary.
2. A submitted solution.
3. A list of test cases.

Dry run the code mentally for every testcase.

For each testcase:
- Determine whether it passes.
- If it throws a runtime error, provide the runtime error.
- If the code cannot compile, populate compiletime_error and leave results empty.

Return ONLY the structured output.
""",
        ),
        (
            "human",
            """
## Coding Question Summary

{summary}

---

## Submitted Solution

{solution}

---

## Test Cases

{testcases}
""",
        ),
    ]
)


def run_code(question_summary: str, solution: str, testcases: list[TestCase]) -> CodeRunResults:
    prompt = testcase_result_prompt.invoke({
                        "summary": question_summary,
                        "solution": solution,
                        "testcases": testcases,
            })
    
    try:
        return FailoverLLM.get_structured_output_from_llm(prompt, schema=CodeRunResults, temperature=0)
    except Exception as e:
        raise RuntimeError("Failed to run code.") from e


def code_runner(command: str, payload: dict[str, Any]) -> dict[str, Any]:
    testcase_results = run_code(
        payload["question_summary"],
        payload["solution"],
        payload["testcases"],
    )

    return testcase_results.model_dump()