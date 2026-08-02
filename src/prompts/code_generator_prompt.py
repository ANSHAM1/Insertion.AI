from langchain_core.prompts import ChatPromptTemplate

code_generator_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
"""
You are a code generator. You will be given a list of previously generated questions and a user prompt. Your task is to generate code that answers the user prompt, 
using the questions as reference material.
avoid generating duplicate code that is already present in the signature summary while underlying algorithm can duplicate or used again.
            """,
        ),
        (
            "human",
            """
## user prompt: 

{user_prompt}


## old Questions signature summary:

{old_questions_summary}
            """,
        ),
    ]
)