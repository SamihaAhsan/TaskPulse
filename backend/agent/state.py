from typing import TypedDict, List, Optional


class TeamCapacity(TypedDict):
    team_id: str
    name: str
    total_headcount: int
    specializations: List[str]
    available_members: int
    active_task_count: int
    load_ratio: float


class TaskItem(TypedDict):
    task_id: str
    title: str
    task_type: str
    priority: str
    estimated_effort_hrs: float
    deadline: Optional[str]
    required_specialization: Optional[str]


class AssignmentResult(TypedDict):
    task_id: str
    task_title: str
    assigned_team_id: str
    assigned_team_name: str
    reason: str


class AgentState(TypedDict):
    tasks: List[TaskItem]
    teams: List[TeamCapacity]
    assignments: List[AssignmentResult]
    summary: Optional[str]
    error: Optional[str]