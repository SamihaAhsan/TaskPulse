# TaskPulse — Intelligent Workforce Orchestration Agent

## Overview

TaskPulse is an AI-powered workforce orchestration platform. It dynamically matches incoming work demand with available team capacity using agentic AI, real-time workload analysis, and forecasting signals.

The system reduces manual planning overhead and helps prevent SLA breaches by intelligently assigning tasks based on team specialization, current workload, available capacity, staffing conditions, seasonal factors, and task urgency and complexity.

## Problem Statement

Companies rely on manual workforce planning methods such as spreadsheets, intuition, and ad-hoc coordination. This leads to uneven workload distribution, staff burnout, underutilized teams, poor visibility into capacity, and increased SLA breach risk.

TaskPulse solves this by introducing an autonomous AI agent that continuously evaluates workforce state and assigns tasks dynamically.

## Core Features

### Intelligent Task Assignment
- Parses incoming tasks
- Matches required skills
- Evaluates workload and capacity
- Assigns optimal team or escalates

### SLA Risk Detection
- Detects overloaded teams
- Flags deadline risks
- Escalates P1 critical tasks

### Dynamic Rebalancing
- Reacts to new incoming tasks
- Adjusts for leave and availability changes
- Continuously re-optimizes assignments

### Forecasting Module
- Predicts workload spikes
- Estimates capacity shortages
- Uses historical demand patterns

## Why MCP?

TaskPulse uses Model Context Protocol (MCP) to connect the AI agent with external systems in a structured way instead of hardcoded integrations.

This enables modular tool-based architecture, separation of knowledge and actions, easier scaling across enterprise systems, and clean agent orchestration logic.

MCP Servers Used:

| Server | Purpose |
|--------|--------|
| ChromaDB MCP | Workforce knowledge and context |
| Atlassian MCP | Jira task operations |

## System Architecture

Next.js Frontend → FastAPI Backend → LangGraph Agent (Groq) → MCP Layer → PostgreSQL + Jira Cloud

## AI Agent Workflow

1. Receive Jira task  
2. Parse priority and requirements  
3. Query workforce state via ChromaDB MCP  
4. Score teams based on specialization match, capacity, and workload  
5. Forecast impact  
6. Assign task via Atlassian MCP to Jira  
7. Log decision in Langfuse  

## Tech Stack

- LangGraph + LangChain (Agent framework)  
- Groq (Llama 3.3 70B)  
- FastAPI (Backend)  
- Next.js (Frontend)  
- PostgreSQL (Database)  
- MCP: ChromaDB + Atlassian  
- Langfuse (Observability)  
- Python (Forecasting)

## Quick Start

Clone repository:
git clone https://github.com/your-org/taskpulse.git
cd taskpulse

Backend setup:
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Backend runs at:
http://localhost:8000

Frontend setup:
cd frontend
npm install
npm run dev

Frontend runs at:
http://localhost:3000

## Environment Variables

Create a `.env` file in backend:

GROQ_API_KEY=
DATABASE_URL=
JIRA_API_KEY=
JIRA_EMAIL=
JIRA_BASE_URL=
LANGFUSE_PUBLIC_KEY=
LANGFUSE_SECRET_KEY=

## API Endpoints

### Tasks Module (`/tasks`)
Handles task ingestion and lifecycle management.

- Endpoints are defined in `routers/tasks.py`

---

### Teams Module (`/teams`)
Provides workforce and capacity information.

- Endpoints are defined in `routers/teams.py`

---

### Assignments Module (`/assignments`)
Handles assignment creation and task allocation results.

- Endpoints are defined in `routers/assignments.py`

---

### Agent Module (`/agent`)
Core AI orchestration layer powered by LangGraph + LLM.

- Endpoints are defined in `routers/agent.py`

---

### System
- `GET /health` → Service health check (defined in `main.py`)
 

## Repository Structure

taskpulse/
├── backend/ → FastAPI API layer (core system + routers)
├── frontend/ → Next.js dashboard UI
├── agent/ → LangGraph AI orchestration engine
├── infra/ → MCP servers, integrations, deployment configs



