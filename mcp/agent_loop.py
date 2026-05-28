"""
Block 5 — Agent Loop
Uses Groq (llama-3.3-70b) as the LLM brain.
Connects to Jira + ChromaDB via MCP tool registry.
"""

import os
import json
import inspect
from dotenv import load_dotenv
from groq import Groq
from mcp_server import handle_tool_call, ALL_TOOLS

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
MODEL  = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You are an intelligent operations agent for a task management system.
You have access to Jira (for reading and writing tasks) and ChromaDB (for knowledge retrieval).

When the user asks a question:
1. Use jira_search_issues to find relevant issues using JQL
2. Reason over the results
3. Give a clear, concise answer
4. If asked to take action (create, transition, assign), use the appropriate tool

JQL rules — always use these exact formats:
- All issues:         project = KAN ORDER BY updated DESC
- High priority:      project = KAN AND priority = Highest ORDER BY updated DESC
- Medium priority:    project = KAN AND priority = Medium ORDER BY updated DESC
- Open issues:        project = KAN AND status = "To Do" ORDER BY updated DESC
- In progress:        project = KAN AND status = "In Progress" ORDER BY updated DESC
- Unassigned:         project = KAN AND assignee is EMPTY ORDER BY updated DESC
- High + unassigned:  project = KAN AND priority = Highest AND assignee is EMPTY ORDER BY updated DESC

Priority values are: Highest, High, Medium, Low, Lowest.

Always use the project key KAN when searching Jira unless told otherwise.
Be specific and helpful. Format issue lists clearly."""


def build_groq_tools() -> list:
    groq_tools = []
    for name, fn in ALL_TOOLS.items():
        sig = inspect.signature(fn)
        doc = (fn.__doc__ or "").strip()
        params = {}
        required = []
        for pname, param in sig.parameters.items():
            ptype = param.annotation
            if ptype == int:
                jtype = "integer"
            elif ptype == float:
                jtype = "number"
            elif ptype == bool:
                jtype = "boolean"
            else:
                jtype = "string"
            params[pname] = {"type": jtype, "description": pname.replace("_", " ")}
            if param.default is inspect.Parameter.empty:
                required.append(pname)
        groq_tools.append({
            "type": "function",
            "function": {
                "name": name,
                "description": doc.split("\n")[0],
                "parameters": {
                    "type": "object",
                    "properties": params,
                    "required": required
                }
            }
        })
    return groq_tools


GROQ_TOOLS = build_groq_tools()


def run_agent(user_prompt: str, verbose: bool = True) -> str:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user",   "content": user_prompt}
    ]

    if verbose:
        print(f"\n[Agent] User: {user_prompt}")
        print("[Agent] Thinking...\n")

    while True:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            tools=GROQ_TOOLS,
            tool_choice="auto",
            max_tokens=2048
        )

        message = response.choices[0].message

        if not message.tool_calls:
            answer = message.content or ""
            if verbose:
                print(f"[Agent] Answer:\n{answer}")
            return answer

        messages.append({
            "role": "assistant",
            "content": message.content,
            "tool_calls": [
                {
                    "id": tc.id,
                    "type": "function",
                    "function": {
                        "name": tc.function.name,
                        "arguments": tc.function.arguments
                    }
                }
                for tc in message.tool_calls
            ]
        })

        for tc in message.tool_calls:
            tool_name = tc.function.name
            try:
                params = json.loads(tc.function.arguments)
            except json.JSONDecodeError:
                params = {}

            if verbose:
                print(f"[Tool] → {tool_name}({json.dumps(params)})")

            try:
                result = handle_tool_call(tool_name, params)
            except Exception as e:
                result = {"error": str(e)}

            if verbose:
                if isinstance(result, list):
                    print(f"[Tool] ← {len(result)} results")
                else:
                    print(f"[Tool] ← {str(result)[:120]}")

            messages.append({
                "role": "tool",
                "tool_call_id": tc.id,
                "content": json.dumps(result)
            })


def main():
    print("=" * 55)
    print("  TaskPulse Agent — Block 5")
    print("  Powered by Groq llama-3.3-70b + Jira MCP")
    print("=" * 55)
    print("Type a prompt or 'exit' to quit.\n")

    while True:
        try:
            prompt = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nExiting.")
            break

        if not prompt:
            continue
        if prompt.lower() in ("exit", "quit", "q"):
            print("Goodbye.")
            break

        run_agent(prompt)
        print()


if __name__ == "__main__":
    main()