from langgraph.graph import START, END, StateGraph # type: ignore

from src.agents.college_agent.nodes import (fetch_gmails_node, prompt_node, llm_node, save_node, sync_node, fetch_router)
from src.agents.college_agent.state import CollegeState


builder = StateGraph(CollegeState)


builder.add_node("fetch_emails", fetch_gmails_node) # type: ignore

builder.add_node("prompt", prompt_node) # type: ignore

builder.add_node("extract", llm_node) # type: ignore

builder.add_node("persist", save_node) # type: ignore

builder.add_node("sync", sync_node) # type: ignore



builder.add_edge(START, "fetch_emails")

builder.add_conditional_edges(
    "fetch_emails",
    fetch_router,
    {
        "prompt": "prompt",
        "end": END,
    },
)

builder.add_edge("prompt", "extract")

builder.add_edge("extract", "persist")

builder.add_edge("persist", "sync")

builder.add_edge("sync", END)



college_graph = builder.compile() # type: ignore