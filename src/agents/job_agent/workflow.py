from langgraph.graph import StateGraph, START, END # type: ignore

from src.agents.job_agent.state import JobState
from src.agents.job_agent.nodes import (search_jobs_node, build_prompt_node, llm_inference_node, save_node, terminate_router, )



workflow = StateGraph(JobState)



workflow.add_node("search_jobs", search_jobs_node) # type: ignore

workflow.add_node("build_prompt", build_prompt_node) # type: ignore

workflow.add_node("llm_inference", llm_inference_node) # type: ignore

workflow.add_node("save", save_node) # type: ignore


workflow.add_edge(START, "search_jobs")

workflow.add_conditional_edges(
    "search_jobs",
    terminate_router,
    {
        "false": "build_prompt",
        "true": END,
    },
)

workflow.add_edge("build_prompt", "llm_inference")

workflow.add_conditional_edges(
    "llm_inference",
    terminate_router,
    {
        "false": "save",
        "true": END,
    },
)

workflow.add_edge("save", END)



job_graph = workflow.compile() # type: ignore