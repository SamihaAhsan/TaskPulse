"""
Block 4 — Action MCP Adapter
Wraps Atlassian Jira Cloud REST API as MCP-compatible tool functions.
Auth: Basic (email:api_token, Base64 encoded)
"""

import os
import base64
import requests
from typing import Optional

JIRA_URL     = os.environ.get("JIRA_URL", "").rstrip("/")
JIRA_EMAIL   = os.environ.get("JIRA_EMAIL", "")
JIRA_TOKEN   = os.environ.get("JIRA_TOKEN", "")
JIRA_PROJECT = os.environ.get("JIRA_PROJECT", "")

def _headers() -> dict:
    creds = base64.b64encode(f"{JIRA_EMAIL}:{JIRA_TOKEN}".encode()).decode()
    return {
        "Authorization": f"Basic {creds}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }

def _base() -> str:
    return f"{JIRA_URL}/rest/api/3"


def jira_search_issues(jql: str = "ORDER BY updated DESC", max_results: int = 50) -> list[dict]:
    """Search Jira issues with a JQL query."""
    resp = requests.get(
    f"{_base()}/search/jql",
        headers=_headers(),
        params={
            "jql": jql,
            "maxResults": max_results,
            "fields": "summary,status,priority,assignee,issuetype,updated,description"
        }
    )
    resp.raise_for_status()
    return [_format_issue(i) for i in resp.json().get("issues", [])]


def jira_get_issue(issue_key: str) -> dict:
    """Retrieve a single Jira issue by key e.g. TASK-1."""
    resp = requests.get(
        f"{_base()}/issue/{issue_key}",
        headers=_headers(),
        params={"fields": "summary,status,priority,assignee,issuetype,updated,description,comment"}
    )
    resp.raise_for_status()
    return _format_issue(resp.json())


def jira_create_issue(
    summary: str,
    issue_type: str = "Task",
    priority: str = "Medium",
    description: str = "",
    project_key: Optional[str] = None,
) -> dict:
    """Create a new Jira issue in the configured project."""
    proj = project_key or JIRA_PROJECT
    payload = {
        "fields": {
            "project":   {"key": proj},
            "summary":   summary,
            "issuetype": {"name": issue_type},
            "priority":  {"name": priority},
        }
    }
    if description:
        payload["fields"]["description"] = {
            "type": "doc", "version": 1,
            "content": [{"type": "paragraph", "content": [{"type": "text", "text": description}]}]
        }
    resp = requests.post(f"{_base()}/issue", headers=_headers(), json=payload)
    resp.raise_for_status()
    data = resp.json()
    return {"key": data["key"], "url": f"{JIRA_URL}/browse/{data['key']}", "id": data["id"]}


def jira_transition_issue(issue_key: str, target_status: str) -> dict:
    """Move a Jira issue to a new status e.g. 'In Progress' or 'Done'."""
    t_resp = requests.get(f"{_base()}/issue/{issue_key}/transitions", headers=_headers())
    t_resp.raise_for_status()
    transitions = t_resp.json().get("transitions", [])
    match = next((t for t in transitions if t["name"].lower() == target_status.lower()), None)
    if not match:
        raise ValueError(f"Transition '{target_status}' not found. Available: {[t['name'] for t in transitions]}")
    requests.post(
        f"{_base()}/issue/{issue_key}/transitions",
        headers=_headers(),
        json={"transition": {"id": match["id"]}}
    ).raise_for_status()
    return {"key": issue_key, "transitioned_to": target_status}


def jira_assign_issue(issue_key: str, account_id: str) -> dict:
    """Assign a Jira issue to a user by Atlassian account ID."""
    requests.put(
        f"{_base()}/issue/{issue_key}/assignee",
        headers=_headers(),
        json={"accountId": account_id}
    ).raise_for_status()
    return {"key": issue_key, "assigned_to": account_id}


def _format_issue(raw: dict) -> dict:
    f = raw.get("fields", {})
    return {
        "key":      raw.get("key"),
        "summary":  f.get("summary"),
        "status":   f.get("status", {}).get("name"),
        "priority": f.get("priority", {}).get("name"),
        "assignee": f.get("assignee", {}).get("displayName") if f.get("assignee") else None,
        "type":     f.get("issuetype", {}).get("name"),
        "updated":  f.get("updated"),
        "url":      f"{JIRA_URL}/browse/{raw.get('key')}"
    }


JIRA_TOOLS = {
    "jira_search_issues":    jira_search_issues,
    "jira_get_issue":        jira_get_issue,
    "jira_create_issue":     jira_create_issue,
    "jira_transition_issue": jira_transition_issue,
    "jira_assign_issue":     jira_assign_issue,
}