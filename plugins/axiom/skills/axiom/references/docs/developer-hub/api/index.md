---
title: API
metaTitle: axiom.ai API — REST, CDP endpoint, and the axiom-api step function library
description: Three API surfaces with one key. Trigger pre-built automations over REST, connect Puppeteer or Playwright over CDP, or call high-level browser steps from Node.
order: 1
---

The axiom.ai API has three surfaces, all reachable with a single API key. [Trigger & orchestrate](/docs/developer-hub/api/run-automations) fires pre-built automations and manages their runs over REST. [Connect over CDP](/docs/developer-hub/api/cdp) opens a long-lived WebSocket to a cloud browser, drivable from Puppeteer, Playwright, or any CDP-speaking client. [Step function library](/docs/developer-hub/api/step-functions) wraps the CDP endpoint with high-level browser actions in Node. All three are reachable from your own code or from an [MCP client](/docs/developer-hub/api/mcp). Start with the [quickstart](/docs/developer-hub/api/quickstart), then [generate an API key](/docs/developer-hub/api/authentication).



:::DocsCardGrid{cols=3 gap=6}

  ::DocsImageCard
  ---
  title: "Trigger & orchestrate"
  text: "Fire pre-built automations and manage their runs over REST. Best for wiring axiom into Zapier, Make, a backend service, or an MCP client."
  link: "/docs/developer-hub/api/run-automations"
  shape: "pyramid"
  ---
  ::
  ::DocsImageCard
  ---
  title: "Connect over CDP"
  text: "Open a WebSocket to a cloud browser and drive it from Puppeteer, Playwright, or any CDP client."
  link: "/docs/developer-hub/api/cdp"
  shape: "cube"
  ---
  ::
  ::DocsImageCard
  ---
  title: "Step function library"
  text: "Call high-level browser actions from Node via the axiom-api package. No CDP boilerplate."
  link: "/docs/developer-hub/api/step-functions"
  shape: "pyramid"
  ---
  ::
:::

```
                                                YOUR CODE
                                                    │
                                                [API key]
                                                    │
                            ╔═══════════════════════════════════════════════╗
                            ║                 axiom.ai API                  ║
                            ╚═══════════════════════════════════════════════╝
                                                    │
            ┌───────────────────────────────────────┼───────────────────────────────────────┐
            │                                       │                                       │
            ▼                                       ▼                                       ▼

   ╔══════════════════════╗               ╔══════════════════════╗               ╔══════════════════════╗
   ║      Trigger &       ║               ║         CDP          ║               ║    Step function     ║
   ║      orchestrate     ║               ║       endpoint       ║               ║       library        ║
   ╚══════════════════════╝               ╚══════════════════════╝               ╚══════════════════════╝

   REST. Fire pre-built                   Long-lived WebSocket.                  Node wrapper around
   automations and                        Connect Puppeteer,                     CDP. High-level
   manage their runs.                     Playwright, or any                     browser actions.
                                          CDP-speaking client.

   POST /trigger                          wss://cdp-lb.axiom.ai/                 npm install axiom-api
   POST /run-data                           ?token=API_KEY                         │
   POST /run-reports                                                              new AxiomApi(key)
   POST /list-automations                                                           │
   POST /stop                                                                     browserOpen()
                                                                                    │
                                                                                  navigate(url)
                                                                                  click(selector)
                                                                                  type(sel, text)
                                                                                  getText()
                                                                                  getHtml()
                                                                                  screenshot()
                                                                                    │
                                                                                  browserClose()
```



## [Trigger & orchestrate](/docs/developer-hub/api/run-automations)

Fire pre-built automations and manage their runs over REST. Pass inputs at trigger time, poll status, fetch run history, stop in-flight runs. Best when the automation is already authored in the No-Code Tool or Code Tool and you want to wire it into Zapier, Make, a backend service, a cron job, or an MCP client.

::DocsCards{path="run-automations"}
::


## [Connect over CDP](/docs/developer-hub/api/cdp)

A long-lived Chrome DevTools Protocol WebSocket pointed at a fresh cloud browser. Connect Puppeteer, Playwright, or any CDP-speaking library and drive it exactly as you would locally — except it runs on our infrastructure, with no Chromium to install or maintain. Best when you want full control of every browser action from your own stack, in any language.

```javascript
const browser = await puppeteer.connect({
  browserWSEndpoint: "wss://cdp-lb.axiom.ai/?token=YOUR_API_KEY"
});
```

[Read the full CDP guide →](/docs/developer-hub/api/cdp)


## [Step function library](/docs/developer-hub/api/step-functions)

The `axiom-api` Node package wraps the CDP endpoint with high-level browser actions. Open a session with `browserOpen()`, call named actions (`navigate`, `click`, `type`, `getText`, `getHtml`, `screenshot`), close with `browserClose()`. Best when you want code-driven flows in Node but don't want to write Puppeteer or wire up CDP yourself.

::DocsCards{path="step-functions"}
::


## [Use from an MCP client](/docs/developer-hub/api/mcp)

All three surfaces above are reachable from MCP-aware clients (Claude Desktop, Claude Code, Cursor, and others). Use the built-in server in the axiom.ai desktop app, or build your own in Python or TypeScript to expose `/trigger`, the CDP endpoint, or the step-function library as tools.

::DocsCards{path="mcp"}
::


## [Usage and limits](/docs/developer-hub/api/usage-and-limits)

Check how much cloud runtime your account has left, see how runs are queued when you hit your concurrency limit, and stay inside the per-minute rate limits.

::DocsCards{path="usage-and-limits"}
::


## [Reference](/docs/developer-hub/api/reference)

Endpoint summaries, request and response payloads, and error codes for the full API surface.

::DocsCards{path="reference"}
::


Need help? Contact [support](/customer-support) or ask a question in our [Reddit community](https://www.reddit.com/r/axiom_ai).
