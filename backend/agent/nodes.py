from agent.state import AgentState, AssignmentResult
from db.session import get_db
from models.models import Task, Team, Assignment
from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime, timezone


PRIORITY_WEIGHT = {"P1": 4, "P2": 3, "P3": 2, "P4": 1}


def fetch_context(state: AgentState) -> AgentState:
    db: Session = next(get_db())
    try:
        tasks = db.query(Task).filter(Task.status == "unassigned").all()
        teams = db.query(Team).all()

        state["tasks"] = [
            {
                "task_id": str(t.task_id),
                "title": t.title,
                "task_type": t.task_type,
                "priority": t.priority,
                "estimated_effort_hrs": t.estimated_effort_hrs,
                "deadline": t.deadline.isoformat() if t.deadline else None,
                "required_specialization": t.task_type,
            }
            for t in tasks
        ]

        state["teams"] = [
            {
                "team_id": str(tm.team_id),
                "name": tm.name,
                "total_headcount": tm.total_headcount,
                "specializations": tm.specializations or [],
                "available_members": tm.available_members,
                "active_task_count": tm.active_task_count,
                "load_ratio": tm.load_ratio,
            }
            for tm in teams
        ]

        state["assignments"] = []
        state["error"] = None
        return state
    except Exception as e:
        state["error"] = str(e)
        return state
    finally:
        db.close()


def score_and_assign(state: AgentState) -> AgentState:
    if state.get("error"):
        return state

    tasks = state["tasks"]
    teams = state["teams"]
    assignments: list[AssignmentResult] = []

    db: Session = next(get_db())
    try:
        for task in tasks:
            best_team = None
            best_score = -1

            for team in teams:
                if team["available_members"] <= 0:
                    continue

                score = 0

                # Specialization match
                if task["required_specialization"] in team["specializations"]:
                    score += 10

                # Load ratio (lower is better)
                score += (1 - team["load_ratio"]) * 5

                # Priority weight
                score += PRIORITY_WEIGHT.get(task["priority"], 1)

                if score > best_score:
                    best_score = score
                    best_team = team

            if best_team:
                assignments.append({
                    "task_id": task["task_id"],
                    "task_title": task["title"],
                    "assigned_team_id": best_team["team_id"],
                    "assigned_team_name": best_team["name"],
                    "reason": f"Best match — specialization fit + load ratio {best_team['load_ratio']:.2f}",
                })

                # Write to DB
                db.add(Assignment(
                    assignment_id=uuid4(),
                    task_id=task["task_id"],
                    team_id=best_team["team_id"],
                    assigned_at=datetime.now(timezone.utc),
                    assignment_reason=f"score={best_score:.2f}",
                ))

                # Update task status
                db.query(Task).filter(
                    Task.task_id == task["task_id"]
                ).update({"status": "assigned"})

                # Decrement available members
                best_team["available_members"] -= 1

        db.commit()
        state["assignments"] = assignments
        return state
    except Exception as e:
        db.rollback()
        state["error"] = str(e)
        return state
    finally:
        db.close()


def generate_summary(state: AgentState) -> AgentState:
    if state.get("error"):
        state["summary"] = f"Agent failed: {state['error']}"
        return state

    assignments = state["assignments"]
    if not assignments:
        state["summary"] = "No unassigned tasks found or no teams had availability."
        return state

    lines = [f"TaskPulse assigned {len(assignments)} task(s):"]
    for a in assignments:
        lines.append(f"  - {a['task_title']} → {a['assigned_team_name']} ({a['reason']})")

    state["summary"] = "\n".join(lines)
    return state