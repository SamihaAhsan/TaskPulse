from fastapi import APIRouter
from agent.graph import agent_graph
from agent.state import AgentState

router = APIRouter()


@router.post("/assign")
def run_agent():
    initial_state: AgentState = {
        "tasks": [],
        "teams": [],
        "assignments": [],
        "summary": None,
        "error": None,
    }

    result = agent_graph.invoke(initial_state)

    return {
        "summary": result["summary"],
        "assignments": result["assignments"],
        "error": result["error"],
    }
