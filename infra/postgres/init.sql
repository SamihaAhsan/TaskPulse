CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE teams (
    team_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    total_headcount INT NOT NULL,
    specializations TEXT[] NOT NULL,
    avg_task_duration_hrs FLOAT DEFAULT 2.0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE team_members (
    member_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(team_id),
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    skills TEXT[] NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE leave_calendar (
    leave_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES team_members(member_id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    leave_type VARCHAR(50),
    approved BOOLEAN DEFAULT TRUE
);

CREATE TABLE tasks (
    task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    task_type VARCHAR(100),
    priority VARCHAR(10) CHECK (priority IN ('P1','P2','P3','P4')),
    estimated_effort_hrs FLOAT,
    deadline TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE assignments (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(task_id),
    team_id UUID REFERENCES teams(team_id),
    assigned_by VARCHAR(50) DEFAULT 'agent',
    sla_risk_level VARCHAR(20),
    manager_override BOOLEAN DEFAULT FALSE,
    assigned_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE TABLE team_capacity_snapshots (
    snapshot_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(team_id),
    available_members INT,
    active_task_count INT,
    load_ratio FLOAT,
    recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE agent_checkpoints (
    checkpoint_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(task_id),
    graph_state VARCHAR(100),
    current_node VARCHAR(100),
    state_data JSONB,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE escalations (
    escalation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(task_id),
    reason TEXT,
    status VARCHAR(50) DEFAULT 'open',
    manager_decision VARCHAR(100),
    escalated_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);