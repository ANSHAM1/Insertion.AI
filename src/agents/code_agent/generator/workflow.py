from langgraph.graph import StateGraph, START, END # type: ignore

from src.agents.code_agent.generator.state import GeneratorState

from src.agents.code_agent.generator.nodes import (fetch_github_node, fetch_router, prompt_builder_node,
    llm_inference_node, validation_router, upload_node)



builder = StateGraph(GeneratorState)


builder.add_node("fetch", fetch_github_node) # type: ignore

builder.add_node("prompt", prompt_builder_node) # type: ignore

builder.add_node("llm", llm_inference_node) # type: ignore

builder.add_node("save", upload_node) # type: ignore


builder.add_edge(START, "fetch")


builder.add_conditional_edges(
    "fetch",
    fetch_router,
    {
        "end": END,
        "prompt": "prompt",
    },
)


builder.add_edge(
    "prompt",
    "llm",
)


builder.add_conditional_edges(
    "llm",
    validation_router,
    {
        "failed": END,
        "save": "save",
    },
)


builder.add_edge(
    "save",
    END,
)


generator_graph = builder.compile() # type: ignore