from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.session import get_db
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    task_type: str
    priority: str
    estimated_effort_hrs: float
    deadline: datetime

@router.post("/ingest")
def ingest_task(task: TaskCreate, db: Session = Depends(get_db)):
    result = db.execute(text("""
        INSERT INTO tasks (title, description, task_type, priority, estimated_effort_hrs, deadline)
        VALUES (:title, :description, :task_type, :priority, :estimated_effort_hrs, :deadline)
        RETURNING task_id
    """), task.model_dump())
    db.commit()
    task_id = result.fetchone()[0]
    return {"task_id": str(task_id), "status": "ingested"}

@router.get("/")
def get_tasks(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM tasks ORDER BY created_at DESC"))
    return [dict(row._mapping) for row in result]