from langchain_core.prompts import ChatPromptTemplate

repair_prompt = ChatPromptTemplate.from_messages(
[
(
"system",
"""
Your previous response could not be parsed.

You MUST repair it.

Rules:

- Return ONLY valid JSON.
- Do not explain.
- Do not use markdown.
- Do not omit required fields.
- Preserve the original schedule as much as possible.
- Ensure the JSON matches the required schema exactly.
- Ensure every item contains:
    - title
    - start_time
    - end_time
    - sort_order
    - completed
    - note
"""
),
(
"human",
"""
Previous invalid response

{invalid_json}

Validation failed.

Return ONLY corrected JSON.
"""
)
]
)