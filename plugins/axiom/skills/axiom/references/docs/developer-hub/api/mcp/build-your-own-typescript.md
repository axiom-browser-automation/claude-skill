---
title: Build your own server (TypeScript)
metaTitle: Build a TypeScript MCP server that wraps the axiom.ai API
description: Build a minimal Model Context Protocol server in Node and TypeScript that exposes axiom.ai automation triggers as tools for any MCP client.
order: 3
---

Build a small Node MCP server that wraps the axiom.ai REST API. Use this if your team is already on a Node stack and would rather extend an existing TypeScript codebase than maintain a Python one.

## Before you begin
***

You need:

- Node 18 or later.
- An axiom.ai API key. See [Authentication](/docs/developer-hub/api/authentication).

## Step 1: install dependencies
***

```bash
npm install @modelcontextprotocol/sdk zod
```

The SDK is dual-published as both ESM and CJS, so the same install works for either module style.

## Step 2: write the server
***

Create a file called `axiom_mcp.cjs`. Using a `.cjs` extension and dynamic `import()` keeps the file working across every Node 18+ runtime, regardless of how exports get resolved.

```javascript
const AXIOM_BASE = "https://lar.axiom.ai/api/v3";
const KEY = process.env.AXIOM_API_KEY;
if (!KEY) throw new Error("AXIOM_API_KEY env var is required");

async function postJson(path, body) {
  const res = await fetch(`${AXIOM_BASE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

(async () => {
  // Dynamic import so this CJS file can consume the dual-published SDK.
  const { McpServer } = await import("@modelcontextprotocol/sdk/server/mcp.js");
  const { StdioServerTransport } = await import(
    "@modelcontextprotocol/sdk/server/stdio.js"
  );
  const { z } = await import("zod");

  const server = new McpServer({ name: "axiom", version: "0.1.0" });

  server.registerTool(
    "trigger_automation",
    {
      description:
        "Trigger an axiom.ai cloud automation by exact name. Optional `data` is a 3-D array of [tables][rows][cells] passed as the automation's input.",
      inputSchema: {
        name: z.string(),
        data: z.array(z.array(z.array(z.string()))).optional(),
      },
    },
    async ({ name, data }) => {
      const body = { key: KEY, name, ...(data ? { data } : {}) };
      const result = await postJson("/trigger", body);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    },
  );

  server.registerTool(
    "run_status",
    {
      description: "Check the status of a triggered axiom.ai automation run.",
      inputSchema: { run_id: z.string() },
    },
    async ({ run_id }) => {
      const result = await postJson("/run-data", { key: KEY, run_id });
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    },
  );

  await server.connect(new StdioServerTransport());
})();
```

## Step 3: register it with a client
***

See [Register with Claude clients](/docs/developer-hub/api/mcp/register-with-clients) for the full configuration snippets. The shortest version, for Claude Desktop:

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

Restart the client. Your `trigger_automation` and `run_status` tools appear and the LLM can call them in conversation.

## Why the dynamic import
***

The MCP SDK ships ESM as primary with a CJS build alongside. A top-level `require("@modelcontextprotocol/sdk/...")` works in some Node versions and breaks in others depending on how exports are resolved. A top-level `import` forces the file to be ESM and is fine if your project is ESM, but breaks in CJS projects.

Using `await import()` from a `.cjs` file (or a `.js` file with `"type": "commonjs"` in `package.json`) sidesteps the whole issue and works on every Node 18+ runtime. If your project is ESM, you can use top-level `import` instead and drop the dynamic loader.

## Audit the SDK before pinning
***

Worth a five-minute check for anything you're shipping to users:

- Source: [github.com/modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk), MIT-licensed, published by Anthropic.
- No `install` or `postinstall` scripts (verify with `npm view @modelcontextprotocol/sdk@<version> scripts`).
- Has SLSA provenance attestations on recent releases (verify with `npm audit signatures` or the npm web UI).
- Pin to an exact reviewed version in your lockfile rather than floating, re-audit when bumping.

## Step 4: extend it
***

The minimal server above is intentionally tiny. Real custom servers usually add:

- **`stop_run`** to cancel misbehaving runs.
- **`remaining_runtime`** so the LLM can check quota before triggering expensive runs.
- **Domain-specific wrappers**, for example `scrape_amazon_asin(asin)` that internally calls `trigger_automation` and waits for completion. The LLM gets a clean, typed tool instead of having to learn each automation's input shape.
- **Polling and completion handling** so the tool returns a finished result rather than a `run_id` the LLM has to poll itself.
- **Step-function tools**, mirroring the [step functions API](/docs/developer-hub/api/step-functions) if you want the LLM to drive a session step by step.

## Notes
***

- Treat your `AXIOM_API_KEY` like any other secret. Don't commit it to source control.
- The server runs as a child process of the MCP client, so its stdout is the protocol channel. Don't `console.log` debug messages, write them to a file or use `console.error` (stderr is safe).
- For production, consider switching from stdio to streamable HTTP transport so the server can run remotely. See the [Anthropic build-a-server guide](https://modelcontextprotocol.io/docs/develop/build-server).