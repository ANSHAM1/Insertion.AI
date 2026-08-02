from langgraph.graph import START, END, StateGraph # type: ignore

from src.agents.code_agent.evaluator.state import GeneratorState

from src.agents.code_agent.evaluator.nodes import (prompt_builder_node, llm_inference_node,
    validation_router, metadata_builder_node, upload_node)



builder = StateGraph(GeneratorState)


builder.add_node("prompt", prompt_builder_node) # type: ignore

builder.add_node("llm", llm_inference_node) # type: ignore

builder.add_node("metadata", metadata_builder_node) # type: ignore

builder.add_node("upload", upload_node) # type: ignore


builder.add_edge(START, "prompt")

builder.add_edge("prompt", "llm")

builder.add_conditional_edges(
    "llm",
    validation_router,
    {
        "failed": END,
        "save": "metadata",
    },
)

builder.add_edge("metadata", "upload")

builder.add_edge("upload", END)


evaluator_graph = builder.compile() # type: ignore