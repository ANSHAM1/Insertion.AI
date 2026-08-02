from langchain_core.prompts import ChatPromptTemplate

code_evaluator_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
"""
You are a code evaluator. You will be given a questions and a frontend metadata. Your task is to evaluate code.
            """,
        ),
        (
            "human",
            """
## question: 

{question}


## metadata from code editor:

{frontend_metadata}
            """,
        ),
    ]
)