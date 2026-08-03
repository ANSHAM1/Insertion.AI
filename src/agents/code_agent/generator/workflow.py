from langgraph.graph import StateGraph, START, END # type: ignore

from src.agents.code_agent.generator.state import GeneratorState

from src.agents.code_agent.generator.nodes import (fetch_github_node, terminate_router, prompt_builder_node,
    llm_inference_node, upload_node)



builder = StateGraph(GeneratorState)


builder.add_node("fetch", fetch_github_node) # type: ignore

builder.add_node("prompt", prompt_builder_node) # type: ignore

builder.add_node("llm", llm_inference_node) # type: ignore

builder.add_node("save", upload_node) # type: ignore


builder.add_edge(START, "fetch")


builder.add_conditional_edges(
    "fetch",
    terminate_router,
    {
        "yes": END,
        "no": "prompt",
    },
)


builder.add_edge(
    "prompt",
    "llm",
)


builder.add_conditional_edges(
    "llm",
    terminate_router,
    {
        "yes": END,
        "no": "save",
    },
)


builder.add_edge(
    "save",
    END,
)


generator_graph = builder.compile() # type: ignore