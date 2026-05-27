from fastapi import APIRouter

router = APIRouter()

@router.post("/assign")
def trigger_agent(task_id: str):
    return {"status": "agent not yet connected", "task_id": task_id}
