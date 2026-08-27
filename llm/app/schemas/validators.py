from typing import Any

from pydantic import BaseModel, Field, ConfigDict



class LLMRequest(BaseModel):

    model_config = ConfigDict(populate_by_name=True)

    prompt          : Any

    llm_model       : str

    reasoning       : bool = False

    response_schema : dict[str, Any] | None = Field(default=None, alias="schema")

    temperature     : float = 0.0

    kwargs          : dict[str, Any] = Field(default_factory=dict)



class LLMExecutionResult(BaseModel):

    success           : bool

    response          : Any | None = None

    error             : str | None = None

    provider_attempts : int = 0