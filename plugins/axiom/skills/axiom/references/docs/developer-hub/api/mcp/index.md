---
title: MCP
metaTitle: Use axiom.ai with Claude and other MCP clients
description: Drive axiom.ai from Claude, Cursor, or any MCP client. The axiom.ai desktop app ships with a built-in MCP server; alternatively, build your own in Python or TypeScript.
order: 7
---

The Model Context Protocol (MCP) is an open standard from Anthropic that lets LLM clients call external tools. With an MCP server in front of the axiom.ai API, Claude Desktop, Claude Code, Cursor, or any other MCP-aware client can trigger your automations and drive cloud browsers in conversation.

## Two ways to set this up
***

### 1. The built-in desktop app server (recommended)

The [axiom.ai desktop app](/docs/developer-hub/api/mcp/desktop-app-server) ships with a Claude MCP server. Toggle it on, paste your API key, and any MCP client on your machine (Claude Desktop, Claude Code, Cursor, and others) can immediately trigger automations and call step functions. No code, no setup, no server to maintain.

This is the right path for almost everyone. You'll need a paid axiom.ai account to generate the API key.

### 2. Build your own server

If the built-in server doesn't fit (you want a headless server, a custom tool surface, a different SDK, or you're not running the desktop app), wrap the axiom.ai API yourself. The minimal version is around 30 lines. The pages below walk through `/trigger` and `/run-data` wrappers in Python and TypeScript, then how to register the result with the major MCP clients.

## Anthropic's MCP resources
***

Useful reading regardless of which path you take. The protocol overview, capability model, and SDK quickstarts will save debugging time later.

- [Spec and docs](https://modelcontextprotocol.io)
- [Build a server guide](https://modelcontextprotocol.io/docs/develop/build-server)
- [Quickstart](https://modelcontextprotocol.io/quickstart)
- [Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Reference servers](https://github.com/modelcontextprotocol/servers) (good templates to clone)

## In this section
***

::DocsCards{byOrder}
::

Need help? Contact [support](/customer-support) or ask a question in our [Reddit community](https://www.reddit.com/r/axiom_ai).