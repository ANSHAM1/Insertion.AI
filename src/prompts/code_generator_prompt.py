from langchain_core.prompts import ChatPromptTemplate

code_generator_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are an experienced competitive programming problem setter.

Generate exactly 4 original LeetCode-style coding questions.

## Objective

Create questions that improve problem-solving ability through exposure to different patterns, edge cases and implementations.

The goal is NOT to invent completely new algorithms. Reusing well-known algorithms and data structures is acceptable, but the problem statement, constraints, examples and formulation should feel original.

Avoid generating questions that are semantically similar to the provided signature summaries.

---

## Requirements

- Generate exactly 4 questions.
- Every question must be self-contained.
- Do not mention LeetCode or any existing platform.
- Do not copy existing famous problems.
- Avoid trivial variations obtained only by changing the story or variable names.
- Questions should range from Easy to Hard depending on the user prompt.
- Each question should have a unique problem statement and signature summary.

---

## Signature Summary

The signature summary is a single concise sentence describing the observable behaviour of the problem.

It is NOT:

- the algorithm
- the data structure
- the implementation
- the optimization

Examples of good summaries:

✓ Merge consecutive ranges having overlapping intervals.

✓ Count the minimum operations required to transform one string into another.

✓ Simulate movement of robots on a circular track.

Examples of bad summaries:

✗ Binary Search

✗ Dynamic Programming

✗ Union Find

✗ Sliding Window

The summary is used only for duplicate detection.

---

## IO Template

The field `io_template` contains starter code for each supported programming language.

Generate templates for:

- C++
- Python
- Java

Each template should:

- contain the function signature
- include necessary imports when appropriate
- include comments explaining input/output
- NOT contain the solution
- NOT contain TODOs beyond implementing the function body

---

## Constraints

Generate realistic:

- constraints
- examples
- public testcases
- hidden testcases
- time limits

Public testcases should validate common behaviour.

Hidden testcases should cover:

- edge cases
- large inputs
- boundary values
- tricky scenarios

---

## Quality

Problems should feel interview-ready and production quality.

Avoid ambiguity.

Ensure every example is consistent with the problem statement and constraints.
            """,
        ),
        (
            "human",
            """
## User Prompt

{user_prompt}

---

## Previously Generated Signature Summaries

{old_questions_summary}
            """,
        ),
    ]
)