from langgraph.graph import StateGraph, START, END # type: ignore

from src.agents.planner_agent.state import PlannerState

from src.agents.planner_agent.nodes import (load_context_node, planner_router, build_prompt_node, llm_inference_node, validation_node, validation_router, 
                        repair_prompt_node, save_schedule_node, article_search_node)




builder = StateGraph(PlannerState)



builder.add_node("context", load_context_node) # type: ignore

builder.add_node("prompt", build_prompt_node) # type: ignore

builder.add_node("llm", llm_inference_node) # type: ignore

builder.add_node("validate", validation_node) # type: ignore

builder.add_node("repair", repair_prompt_node) # type: ignore

builder.add_node("save", save_schedule_node) # type: ignore

builder.add_node("article_search", article_search_node) # type: ignore



builder.add_edge(START, "context")

builder.add_conditional_edges(
    "context",
    planner_router,
    {
        "prompt": "prompt",
        "end": END,
    },
)

builder.add_edge("prompt", "llm")

builder.add_edge("llm", "validate")

builder.add_conditional_edges(
    "validate",
    validation_router,
    {
        "save"   : "save",
        "repair" : "repair",
        "failed" : END,
    },
)

builder.add_edge("repair", "llm")

builder.add_edge("save", "article_search")

builder.add_edge("article_search", END)



planner_graph = builder.compile() # type: ignore