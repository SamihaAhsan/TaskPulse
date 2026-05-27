from fastapi import FastAPI
from backend.routers import tasks, teams, assignments, agent
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TaskPulse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
app.include_router(teams.router, prefix="/teams", tags=["Teams"])
app.include_router(assignments.router, prefix="/assignments", tags=["Assignments"])
app.include_router(agent.router, prefix="/agent", tags=["Agent"])

@app.get("/health")
def health():
    return {"status": "ok", "app": "TaskPulse"}