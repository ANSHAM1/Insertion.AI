from langchain_core.prompts import ChatPromptTemplate


code_evaluator_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are an expert software engineer and technical interviewer.

Evaluate the submitted solution against the coding question.

Create meaningful hidden test cases yourself and mentally evaluate the
submitted code against them. Consider edge cases, boundaries, constraints,
incorrect assumptions, and cases that can expose inefficient or incorrect
solutions.

Base the score primarily on hidden-test correctness and secondarily on code
quality.

Score:
- 70% correctness based on estimated hidden-test pass percentage.
- 30% code quality, including complexity, data structures, readability,
  structure, robustness, and appropriate error/exception handling.

Evaluate the code exactly as written. Do not fix or modify it.

Report:
- score (0-100)
- estimated hidden-test pass percentage
- time complexity
- space complexity
- strengths
- weaknesses
- concise interview feedback
- exactly one most useful improvement/optimization

Do not reveal the actual hidden testcases.

Return only the structured output.
"""
        ),
        (
            "human",
            """
Coding Question:
{question}

Submitted Solution:
{solution}

Frontend Metadata:
{frontend_metadata}
"""
        ),
    ]
)