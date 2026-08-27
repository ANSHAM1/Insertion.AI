from fastapi import FastAPI

from app.schemas import LLMRequest, LLMExecutionResult

from factory import LLM



app = FastAPI(
    title="Insertion.AI LLM Service",
    version="1.0.0",
)


@app.post("/llm/openrouter/generate", response_model=LLMExecutionResult)
async def generateOpenRouter(request: LLMRequest):

    return LLM.OpenRouter(request)



@app.post("/llm/openai/generate", response_model=LLMExecutionResult)
async def generateOpenAI(request: LLMRequest):

    return LLM.OpenAI(request)