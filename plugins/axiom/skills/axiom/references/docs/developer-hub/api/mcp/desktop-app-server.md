---
title: Desktop app MCP server
metaTitle: Use the axiom.ai desktop app's built-in Claude MCP server
description: The axiom.ai desktop app ships with a built-in MCP server. Toggle it on, paste your API key, and Claude Desktop, Claude Code, Cursor, or any MCP client can trigger axiom.ai automations and step functions in conversation.
order: 1
---

The axiom.ai desktop app ships with a built-in MCP server. Once it's switched on, any MCP-aware LLM client running on the same machine can call your axiom.ai API: trigger automations, drive a cloud browser through step functions, check remaining runtime, and stop runs. The server speaks the standard Model Context Protocol, so Claude Desktop, Claude Code, Cursor, and every other MCP-compatible client work with it out of the box.

This is the easiest way to put axiom.ai inside an LLM. Skip ahead to [Before you begin](#before-you-begin) to enable it.

## What it gives you
***

With the desktop app's MCP server enabled, an LLM client can:

- **Trigger automations by name.** Ask Claude to run "Scrape today's leads", and it calls [`/trigger`](/docs/developer-hub/api/run-automations/trigger-an-automation) under the hood.
- **Pass input data.** The LLM can format rows of input and send them in the same call.
- **Check run status.** The LLM polls [`/run-data`](/docs/developer-hub/api/run-automations/check-run-status) and reports back when the run finishes.
- **Drive a cloud browser step by step.** The LLM can call [step functions](/docs/developer-hub/api/step-functions) (navigate, click, type, scrape, screenshot) directly, choosing each action based on what the previous one returned.
- **Read remaining runtime** before kicking off expensive runs.
- **Stop runs** if a conversation needs to abort one early.

No CLI, no SDK installation, no MCP server to write yourself. The desktop app handles the protocol; the LLM handles the conversation.

## Before you begin
***

You need:

- A **paid axiom.ai account**. API access is gated to paid plans. See the [pricing page](/pricing) for plans that include the API.
- The **axiom.ai desktop app**, installed on the same machine as your LLM client. Download from the [desktop app page](/install-desktop-app).
- An **axiom.ai API key**, generated from the **Dashboard**. See [Authentication](/docs/developer-hub/api/authentication).

## Enable the MCP server
***

1. Open the **axiom.ai desktop app**.
2. Open the app's **tray menu** and choose **Set up Claude MCP…**.
3. Toggle the server **on**.
4. Paste your axiom.ai API key into the `API key` field and click **Save and activate**. The key is written into each MCP client's own config on your machine; the desktop app never sends it anywhere else.
5. Confirm the status line reports your client as **registered**. Restart that client and Claude (or another MCP client) can reach the server.

To rotate the key later, reopen **Set up Claude MCP…**, paste the new key, and save again. To turn the server off entirely, toggle it back off.

The panel drives the `axiom-mcp` CLI that ships inside the app, so the same setup is scriptable: `axiom-mcp setup status`, `setup enable`, `setup save-key` (key on stdin), `setup disable`.

## Use it from your LLM client
***

The built-in server speaks standard MCP, so any MCP-aware client can talk to it. The most common clients today:

- **Claude Desktop.** Anthropic's official desktop app for the Claude chat experience. The setup writes the server into Claude Desktop's config; restart Claude Desktop and it appears as a tool source. See [Register with Claude](/docs/developer-hub/api/mcp/register-with-claude) for what the config looks like.
- **Claude Code.** Anthropic's terminal-native coding agent. The setup registers the server through `claude mcp add axiom -s user …`; restart Claude Code (or reconnect via `/mcp`) and the tools appear as `mcp__axiom__*`.
- **Cursor.** The setup writes `~/.cursor/mcp.json`; restart Cursor and the axiom.ai server shows up in the chat panel like any other tool source.
- **Any other MCP client.** The protocol is open, so Cline, Cowork, Continue, Zed's AI panel, and others all work with the same stdio command.

You don't need to install anything client-side beyond the LLM client itself. The client launches the server on demand, so the LLM can see and call axiom.ai tools whenever the client is running.

## Example conversations
***

A few prompts to try once the server is enabled:

```
"Run my 'Daily competitor prices' automation and tell me when it's done."
```

```
"Open a browser session, go to news.ycombinator.com, scrape the front-page titles, and summarise the top three."
```

```
"How much axiom runtime do I have left this month?"
```

Claude picks the right MCP tool for each task: `/trigger` for the first, a sequence of step functions for the second, and `/remaining-runtime` for the third.

## What's under the hood
***

The built-in server is implemented with Anthropic's official [TypeScript MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk) and embedded in the axiom.ai desktop app. The same SDK powers Claude Desktop's own tool integrations, so the server behaves identically to any other MCP server an LLM might encounter.

If you want to extend or customise the tool surface, see [Build your own (TypeScript)](/docs/developer-hub/api/mcp/build-your-own-typescript) for a standalone server you can fork. The built-in server is the recommended path for almost everyone; the build-your-own pages exist for edge cases (headless servers, non-Anthropic SDKs, custom tool wrappers).

## Notes
***

- The MCP server is launched by your MCP client, so most tools work whether or not the desktop app window is open. The exception is `run_automation` on your own machine, which needs the desktop app running.
- Each API call from the LLM counts against the standard [rate limits](/docs/developer-hub/api/usage-and-limits/rate-limits) and [runtime allowance](/docs/developer-hub/api/usage-and-limits/remaining-runtime). LLMs that poll aggressively can trip rate limits; if you see `429` errors in the desktop app logs, tell the LLM to slow down.
- The MCP server is local-only. It talks to the client that spawned it over stdio — it doesn't listen on any network port and isn't reachable from the public internet.
- Your API key lives in each MCP client's own config file (the `env` block of its `axiom` server entry). Those files are plain text — treat them as secrets and don't commit them.
