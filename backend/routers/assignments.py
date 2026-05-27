from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.session import get_db

router = APIRouter()

@router.get("/")
def get_assignments(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM assignments ORDER BY assigned_at DESC"))
    return [dict(row._mapping) for row in result]