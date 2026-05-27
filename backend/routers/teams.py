from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.session import get_db
from datetime import date

router = APIRouter()

@router.get("/capacity")
def get_team_capacity(db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT
            t.team_id,
            t.name,
            t.total_headcount,
            t.specializations,
            COUNT(tm.member_id) FILTER (
                WHERE tm.is_active = TRUE
                AND NOT EXISTS (
                    SELECT 1 FROM leave_calendar lc
                    WHERE lc.member_id = tm.member_id
                    AND lc.approved = TRUE
                    AND :today BETWEEN lc.start_date AND lc.end_date
                )
            ) AS available_members,
            COUNT(a.assignment_id) FILTER (
                WHERE a.completed_at IS NULL
            ) AS active_task_count
        FROM teams t
        LEFT JOIN team_members tm ON t.team_id = tm.team_id
        LEFT JOIN assignments a ON t.team_id = a.team_id
        GROUP BY t.team_id
    """), {"today": date.today()})
    rows = [dict(row._mapping) for row in result]
    for row in rows:
        available = row["available_members"] or 0
        active = row["active_task_count"] or 0
        row["load_ratio"] = round(active / available, 2) if available > 0 else 999
    return rows