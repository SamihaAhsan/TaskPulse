import os
import sys
from fastapi import APIRouter
from dotenv import load_dotenv
from groq import Groq
from langgraph.graph import StateGraph, END
from typing import TypedDict, List
from pydantic import BaseModel

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'mcp'))
from jira_mcp_adapter import jira_create_issue
from mcp_server import handle_tool_call

load_dotenv()

router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# --- State ---
class AgentState(TypedDict):
    tasks: List[dict]
    teams: List[dict]
    assignments: List[dict]
    summary: str


# --- Request Models ---
class Task(BaseModel):
    task_id: str
    task_name: str
    required_skill: str
    priority: str


class Team(BaseModel):
    team_name: str
    specializations: List[str]
    current_load: int
    max_capacity: int


class AssignRequest(BaseModel):
    tasks: List[Task]
    teams: List[Team]


class JiraPromptRequest(BaseModel):
    prompt: str


# --- Scoring Node ---
def assign_tasks(state: AgentState) -> AgentState:
    tasks = state["tasks"]
    teams = state["teams"]
    assignments = []

    for task in tasks:
        best_team = None
        best_score = -1

        for team in teams:
            spec_match = 1 if task["required_skill"] in team["specializations"] else 0
            load_ratio = team["current_load"] / team["max_capacity"]
            score = (0.6 * spec_match) + (0.4 * (1 - load_ratio))

            if score > best_score:
                best_score = score
                best_team = team

        if best_team:
            best_team["current_load"] += 1
            assignments.append({
                "task_id": task["task_id"],
                "task_name": task["task_name"],
                "assigned_team": best_team["team_name"],
                "score": round(best_score, 2),
                "reason": f"specialization fit + load ratio {best_team['current_load'] / best_team['max_capacity']:.2f}"
            })

    return {**state, "assignments": assignments}


# --- LLM Summary Node ---
def generate_summary(state: AgentState) -> AgentState:
    assignments = state["assignments"]

    assignment_text = "\n".join([
        f"- Task '{a['task_name']}' → {a['assigned_team']} (score: {a['score']})"
        for a in assignments
    ])

    prompt = f"""You are TaskPulse, an AI workforce allocation assistant for an enterprise.

The following tasks were just assigned to teams based on specialization fit and workload balance:

{assignment_text}

Write a concise 3-4 sentence executive summary explaining these assignments. 
Mention workload balance and specialization matching. Keep it professional and clear."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4
    )

    summary = response.choices[0].message.content
    return {**state, "summary": summary}


# --- Build Graph ---
def build_agent():
    graph = StateGraph(AgentState)
    graph.add_node("assign_tasks", assign_tasks)
    graph.add_node("generate_summary", generate_summary)
    graph.set_entry_point("assign_tasks")
    graph.add_edge("assign_tasks", "generate_summary")
    graph.add_edge("generate_summary", END)
    return graph.compile()


agent = build_agent()


# --- Routes ---
@router.post("/assign")
def assign(request: AssignRequest):
    blocked_phrases = ["ignore previous", "forget instructions", "you are now", "disregard", "jailbreak"]

    for task in request.tasks:
        for phrase in blocked_phrases:
            if phrase.lower() in task.task_name.lower():
                return {"error": "Invalid input detected in task name."}

    tasks = [t.dict() for t in request.tasks]
    teams = [t.dict() for t in request.teams]

    result = agent.invoke({
        "tasks": tasks,
        "teams": teams,
        "assignments": [],
        "summary": ""
    })

    # Create Jira issues for each assignment
    jira_issues = []
    for a in result["assignments"]:
        try:
            issue = jira_create_issue(
                summary=a["task_name"],
                issue_type="Task",
                priority="High",
                description=f"Assigned to: {a['assigned_team']}\nScore: {a['score']}\nReason: {a['reason']}"
            )
            jira_issues.append({"task": a["task_name"], "jira_key": issue["key"], "url": issue["url"]})
        except Exception as e:
            jira_issues.append({"task": a["task_name"], "error": str(e)})

    return {
        "assignments": result["assignments"],
        "summary": result["summary"],
        "jira_issues": jira_issues
    }


@router.get("/issues")
def get_jira_issues():
    issues = handle_tool_call("jira_search_issues", {
        "jql": "project = KAN ORDER BY updated DESC",
        "max_results": 20
    })
    return {"issues": issues}


@router.get("/issues/priority")
def get_priority_issues():
    issues = handle_tool_call("jira_search_issues", {
        "jql": "project = KAN AND priority = Highest AND status != Done ORDER BY updated DESC",
        "max_results": 10
    })
    return {"issues": issues}