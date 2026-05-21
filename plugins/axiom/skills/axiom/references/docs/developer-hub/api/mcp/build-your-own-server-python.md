---
title: Build your own server (Python)
metaTitle: Build a Python MCP server that wraps the axiom.ai API
description: Build a minimal Model Context Protocol server in Python that exposes axiom.ai automation triggers as tools for any MCP client.
order: 2
---

Build a small Python MCP server that wraps the axiom.ai REST API. The result is a tool any MCP-aware client (Claude Desktop, Claude Code, Cursor) can call to trigger automations and check their status from inside a conversation.

## Before you begin
***

You need:

- Python 3.10 or later.
- `uv` (recommended) or `pip` for dependency management.
- An axiom.ai API key. See [Authentication](/docs/developer-hub/api/authentication).

## Step 1: install dependencies
***

```bash
uv pip install "mcp[cli]" httpx
```

Or with `pip`:

```bash
pip install "mcp[cli]" httpx
```

## Step 2: write the server
***

Create a file called `axiom_mcp.py`:

```python
import os
import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("axiom")
AXIOM_BASE = "https://lar.axiom.ai/api/v3"
KEY = os.environ["AXIOM_API_KEY"]

@mcp.tool()
async def trigger_automation(name: str, data: list | None = None) -> dict:
    """Trigger an axiom.ai cloud automation by exact name.

    Optional `data` is a 3-D array of [tables][rows][cells] passed as
    the automation's input.
    """
    body = {"key": KEY, "name": name}
    if data is not None:
        body["data"] = data
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(f"{AXIOM_BASE}/trigger", json=body)
        return r.json()

@mcp.tool()
async def run_status(run_id: str) -> dict:
    """Check the status of a triggered axiom.ai automation run."""
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(
            f"{AXIOM_BASE}/run-data",
            json={"key": KEY, "run_id": run_id},
        )
        return r.json()

if __name__ == "__main__":
    mcp.run()  # stdio transport by default
```

That's the whole server. Tool descriptions in the docstrings are what the LLM sees when deciding whether to call a tool, write them clearly.

## Step 3: register it with a client
***

See [Register with Claude clients](/docs/developer-hub/api/mcp/register-with-clients) for the full configuration snippets. The shortest version, for Claude Desktop:

```json
{
  "mcpServers": {
    "axiom": {
      "command": "uv",
      "args": ["run", "/absolute/path/to/axiom_mcp.py"],
      "env": { "AXIOM_API_KEY": "your-api-key-here" }
    }
  }
}
```

Restart the client. Your `trigger_automation` and `run_status` tools appear and the LLM can call them in conversation.

## Step 4: extend it
***

The minimal server above is intentionally tiny. Real custom servers usually add:

- **`stop_run`** to cancel misbehaving runs.
- **`remaining_runtime`** so the LLM can check quota before triggering expensive runs.
- **Domain-specific wrappers**, for example `scrape_amazon_asin(asin: str)` that internally calls `trigger_automation("Amazon ASIN template", data=[[[asin]]])` and waits for completion. This is where the real value is, the LLM gets a clean, typed tool instead of having to learn each automation's input shape.
- **Polling and completion handling**, so the tool returns a finished result rather than a `run_id` the LLM has to poll itself.
- **Step-function tools**, mirroring the [step functions API](/docs/developer-hub/api/step-functions) if you want the LLM to drive a session step by step instead of just triggering pre-built automations.

A typical extended server is 100 to 200 lines and covers the most common workflows for the team using it.

## Notes
***

- Treat your `AXIOM_API_KEY` like any other secret. Don't commit the env value into the config you check into version control, use a secrets manager or a `.env` file the client loads.
- The server runs as a child process of the MCP client. If it crashes, the client restarts it on the next tool call, so transient errors are usually fine.
- For production, consider switching from stdio to streamable HTTP transport so the server can run remotely. See the [Anthropic build-a-server guide](https://modelcontextprotocol.io/docs/develop/build-server).