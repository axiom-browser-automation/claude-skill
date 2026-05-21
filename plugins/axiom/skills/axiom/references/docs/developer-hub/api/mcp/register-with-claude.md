---
title: Register with Claude clients
metaTitle: Register an axiom.ai MCP server with Claude Desktop, Code, Cursor, or Cowork
description: Configure Claude Desktop, Claude Code, Cursor, and Cowork to load your custom axiom.ai MCP server.
order: 4
---

Once you've built an MCP server (in [Python](/docs/developer-hub/api/mcp/build-your-own-server-python) or [TypeScript](/docs/developer-hub/api/mcp/build-your-own-server-typescript)), point your MCP client at it. The configuration is similar across clients but the file location and field names differ. This page shows the snippet for each.

## Claude Desktop
***

Edit the `claude_desktop_config.json` file in the platform-specific location:

| Platform | Path |
|---|---|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

For the Python server:

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

For the Node server:

```json
{
  "mcpServers": {
    "axiom": {
      "command": "node",
      "args": ["/absolute/path/to/axiom_mcp.cjs"],
      "env": { "AXIOM_API_KEY": "your-api-key-here" }
    }
  }
}
```

Restart Claude Desktop. Your tools appear in the tool list and the LLM can call them.

## Claude Code
***

Claude Code reads MCP servers from a project-level `.mcp.json` file or from a global config. The simplest setup is a per-project file:

```json
{
  "mcpServers": {
    "axiom": {
      "command": "node",
      "args": ["/absolute/path/to/axiom_mcp.cjs"],
      "env": { "AXIOM_API_KEY": "your-api-key-here" }
    }
  }
}
```

Place this at the root of the project and Claude Code picks it up automatically.

## Cursor
***

Cursor uses a per-project or global `mcp.json` file. The schema is the same as Claude Desktop's:

```json
{
  "mcpServers": {
    "axiom": {
      "command": "node",
      "args": ["/absolute/path/to/axiom_mcp.cjs"],
      "env": { "AXIOM_API_KEY": "your-api-key-here" }
    }
  }
}
```

Restart Cursor. Tools appear in the chat side panel.

## Cowork
***

Cowork registers MCP servers via its plugin marketplace or via direct config in the desktop app. For a custom server:

1. Open Cowork settings.
2. Go to **MCP servers**.
3. Click **Add server** and paste the same config object as above.

Cowork hot-reloads the server, no restart needed.

## Verify the registration worked
***

After adding the config and restarting, ask the LLM:

> What tools do you have available?

It should list `trigger_automation` and `run_status` (or whatever names you chose). If they don't appear:

- **Check the path is absolute.** Relative paths break because the client runs the server from its own working directory.
- **Check the env var is set.** Most failures come from a missing `AXIOM_API_KEY`. Restart the client after adding it.
- **Check the client logs.** Each client surfaces server stdout/stderr somewhere, look for connection errors or missing dependencies.

## Security
***

The MCP config file holds your API key in plain text. A few precautions:

- Don't commit the config file to a public repo.
- Use a secrets manager or a `.env` file the server reads, rather than hard-coding the key in the config, if your client supports it.
- Rotate your axiom.ai API key (see [Authentication](/docs/developer-hub/api/authentication)) if you suspect the config has been exposed.

## Notes
***

- Each client uses the stdio transport by default for local servers. For a server running on another machine, use streamable HTTP and update the config to point at the URL instead of a command.
- Multiple `mcpServers` entries can coexist in a single config, your axiom.ai server can sit alongside servers for filesystem, GitHub, Slack, and so on.
- Restart the client after editing the config. Most clients don't watch the config file for changes.