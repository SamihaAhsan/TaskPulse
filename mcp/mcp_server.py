from dotenv import load_dotenv
load_dotenv()

from jira_mcp_adapter   import JIRA_TOOLS
from chroma_mcp_adapter import CHROMA_TOOLS

ALL_TOOLS = {**JIRA_TOOLS, **CHROMA_TOOLS}

def handle_tool_call(tool_name: str, params: dict):
    if tool_name not in ALL_TOOLS:
        raise ValueError(f"Unknown tool: '{tool_name}'. Available: {list(ALL_TOOLS.keys())}")
    return ALL_TOOLS[tool_name](**params)

def list_tools() -> list[dict]:
    import inspect
    return [{"name": name, "description": (fn.__doc__ or "").strip().split("\n")[0],
             "parameters": {k: str(v.annotation) for k, v in inspect.signature(fn).parameters.items()}}
            for name, fn in ALL_TOOLS.items()]

if __name__ == "__main__":
    print("=== Registered MCP Tools ===")
    for t in list_tools():
        print(f"  {t['name']:35s} {t['description']}")

    print("\n=== Testing jira_search_issues ===")
    try:
        issues = handle_tool_call(
            "jira_search_issues",
            {"jql": "project = KAN ORDER BY updated DESC", "max_results": 20}
        )
        print(f"  Got {len(issues)} issues:")
        for i in issues:
            print(f"    {i['key']:10s} [{i['priority']:6s}] [{i['status']:12s}] {i['summary'][:50]}")
    except Exception as e:
        print(f"  Jira error: {e}")

    print("\n=== Testing chroma_list_collections ===")
    try:
        cols = handle_tool_call("chroma_list_collections", {})
        print(f"  Collections: {cols if cols else '(empty — none added yet)'}")
    except Exception as e:
        print(f"  Chroma error: {e}")