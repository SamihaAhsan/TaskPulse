from langgraph.graph import StateGraph, END
from agent.state import AgentState
from agent.nodes import fetch_context, score_and_assign, generate_summary


def build_graph() -> StateGraph:
    graph = StateGraph(AgentState)

    graph.add_node("fetch_context", fetch_context)
    graph.add_node("score_and_assign", score_and_assign)
    graph.add_node("generate_summary", generate_summary)

    graph.set_entry_point("fetch_context")
    graph.add_edge("fetch_context", "score_and_assign")
    graph.add_edge("score_and_assign", "generate_summary")
    graph.add_edge("generate_summary", END)

    return graph.compile()


agent_graph = build_graph()