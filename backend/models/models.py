from sqlalchemy import Column, String, Integer, Float, DateTime, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from db.session import Base
import uuid


class Team(Base):
    __tablename__ = "teams"

    team_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    total_headcount = Column(Integer, nullable=False)
    specializations = Column(ARRAY(String))
    available_members = Column(Integer, nullable=False)
    active_task_count = Column(Integer, default=0)
    load_ratio = Column(Float, default=0.0)


class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(String)
    task_type = Column(String)
    priority = Column(String)
    estimated_effort_hrs = Column(Float)
    deadline = Column(DateTime)
    status = Column(String, default="unassigned")


class Assignment(Base):
    __tablename__ = "assignments"

    assignment_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task_id = Column(UUID(as_uuid=True), nullable=False)
    team_id = Column(UUID(as_uuid=True), nullable=False)
    assigned_at = Column(DateTime)
    assignment_reason = Column(String)