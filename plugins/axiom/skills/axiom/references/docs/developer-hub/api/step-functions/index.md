---
title: Step functions
metaTitle: Call axiom.ai step functions on a cloud browser
description: Drive a cloud browser session step by step (goto, click, enter text, wait, scrape) choosing each action based on what the previous one returned.
order: 6
---

Step functions are individual browser actions you call against a cloud browser session, one at a time, choosing each step based on what the previous one returned. Open a session, fire `goto`, `click`, `enterText`, `scrape`, and so on, then close the session when you're done. Use this when you want to drive a browser dynamically from your code rather than running a pre-built automation end to end.

Under the hood, step functions run as HTTP calls against the cloud browser's pod. Each call goes to `POST /api/v5/step` (or `/api/v5/browser/open` / `/api/v5/browser/close` for lifecycle). You have three ways to drive a session — pick whichever fits your stack.

## How to call them
***

### `axiom-api` Node library

The canonical wrapper. `npm install`, instantiate, and call the named methods: `axiom.goto()`, `axiom.click()`, `axiom.enterText()`, `axiom.scrape()`, and so on. Node only; not required, but saves you from writing the HTTP boilerplate and handles transparent retries when a long-running step's request times out.

```bash
npm install axiom-api
```

See [Start a session](/docs/developer-hub/api/step-functions/start-a-session) for the full instantiate-and-open flow.

### Puppeteer or any CDP client

If you'd rather have full Chrome DevTools Protocol control than the high-level step-function helpers, point any CDP-speaking client at the cloud browser WebSocket directly. You get every Puppeteer method, just running on our infrastructure instead of your own.

```
wss://cdp-lb.axiom.ai/?token=YOUR_API_KEY
```

See [Authentication](/docs/developer-hub/api/authentication) for how the key is passed, and [Endpoints](/docs/developer-hub/api/reference/endpoints) for the canonical list.

### MCP server

Expose step functions as MCP tools so Claude or another LLM client can drive a session step by step. See [Build your own MCP server](/docs/developer-hub/api/mcp) for the patterns and reference implementations.

## When to use this vs other surfaces
***

| You want to | Use |
|---|---|
| Run a pre-built No-Code Tool automation from start to finish | [`/trigger`](/docs/developer-hub/api/run-automations/trigger-an-automation) |
| Run a pre-authored Puppeteer / CDP script in the cloud | [Run a Code Tool automation](/docs/developer-hub/api/run-automations/run-a-code-tool-automation) |
| Drive a session step by step, choosing each action based on the page | This section |

`/trigger` and the Code Tool path are fully pre-authored (the workflow is baked in). Step functions give you scripted high-level actions with the dynamism of choosing each call at runtime.

## Session lifecycle
***

A session is an isolated cloud browser. Open one with `axiom.browserOpen()`, drive it with the action methods, then close it with `axiom.browserClose()`. Sessions left open consume runtime quota, so always close yours.

```
new AxiomApi(key)   →   axiom.browserOpen()
                              │
                              ├─ axiom.goto(url)
                              ├─ axiom.click(selector)
                              ├─ axiom.enterText(selector, text)
                              ├─ axiom.pressKeys("Enter")
                              ├─ axiom.scrape(url, selector, ...)
                              ├─ axiom.wait(2000)
                              │
                              ▼
                         axiom.browserClose()
```

## Available step methods
***

| Method | Purpose |
|---|---|
| [`browserOpen()`](/docs/developer-hub/api/step-functions/start-a-session) / [`browserClose()`](/docs/developer-hub/api/step-functions/close-a-session) | Open / close the session. |
| [`goto(url, ...)`](/docs/developer-hub/api/step-functions/goto) | Navigate the page to a URL. |
| [`click(select, ...)`](/docs/developer-hub/api/step-functions/click) | Click an element. |
| [`clickMultiple(select, ...)`](/docs/developer-hub/api/step-functions/click-multiple) | Click every matching element up to a max. |
| [`clickEngagementButton(select, ...)`](/docs/developer-hub/api/step-functions/click-engagement-button) | Toggle a like/follow/subscribe-style button only if it isn't already in the target state. |
| [`hover(select)`](/docs/developer-hub/api/step-functions/hover) | Hover the mouse over an element. |
| [`clickAndDrag(start, end)`](/docs/developer-hub/api/step-functions/click-and-drag) | Mouse-press at one coordinate, release at another. |
| [`enterText(selectTextField, text, ...)`](/docs/developer-hub/api/step-functions/enter-text) | Enter text into an input. |
| [`pressKeys(key, ...)`](/docs/developer-hub/api/step-functions/press-keys) | Fire keyboard events (Enter, Tab, arrow keys, …). |
| [`selectList(select, text)`](/docs/developer-hub/api/step-functions/select-list) | Pick an option in a `<select>` dropdown. |
| [`datePicker(...)`](/docs/developer-hub/api/step-functions/date-picker) | Navigate a calendar widget and pick a date. |
| [`getClipboardContents()`](/docs/developer-hub/api/step-functions/get-clipboard-contents) | Read the cloud browser's clipboard (after a copy step). |
| [`switchBrowserTab(selectTab)`](/docs/developer-hub/api/step-functions/switch-browser-tab) | Switch the active tab in the session. |
| [`scrape(url, selector, pager, max_results, settings)`](/docs/developer-hub/api/step-functions/scrape) | Smart-scrape a list of records, optionally paginating. |
| [`scrapeMetadata(metadata)`](/docs/developer-hub/api/step-functions/scrape-metadata) | Pull structured fields (title, description, OG tags, …) from the current page. |
| [`integrateAI(aiOptions)`](/docs/developer-hub/api/step-functions/integrate-ai) | Run an LLM call inline (summarise, classify, extract). |
| [`solveCaptcha(apiKey)`](/docs/developer-hub/api/step-functions/solve-captcha) | Hand the current page's captcha to a solver. |
| [`wait(time)`](/docs/developer-hub/api/step-functions/wait) | Pause the session on the pod for `time` milliseconds (keeps the session alive). |
| [`restartBrowser()`](/docs/developer-hub/api/step-functions/restart-browser) | Restart the cloud browser within the same session. |

## End-to-end example
***

A canonical "log in, scrape, store" flow:

```javascript
import { AxiomApi } from 'axiom-api';

const axiom = new AxiomApi(process.env.AXIOM_API_KEY);

await axiom.browserOpen();
try {
  await axiom.goto("https://example.com/login");
  await axiom.enterText("#email", "user@example.com");
  await axiom.enterText("#password", process.env.PW);
  await axiom.click("button[type=submit]");
  await axiom.wait(2000);

  const rows = await axiom.scrape(
    null,                       // stay on the current page
    ".product-card",            // record selector
    null,                       // no pagination
    50,                         // max results
    {}                          // default settings
  );
  // ... persist `rows` somewhere
} finally {
  await axiom.browserClose();
}
```

## Synchronous-feeling, with async safety net
***

Each step method makes a single HTTP request that blocks until the pod returns the step's result. If the request times out at the network layer or the pod reports that a step is already in flight, the library transparently polls `POST /api/v5/step/result` with exponential backoff until the step finishes (default deadline: 1 hour). You write straight-line code; the library handles long-running steps and flaky connections.

## What's not exposed yet
***

The step-trigger surface is intentionally focused on common interaction primitives. Things you'd need to work around today:

- **Raw page text / HTML readout.** No `getText()` / `getHtml()` method. Use [`axiom.scrape()`](/docs/developer-hub/api/step-functions/scrape) for record extraction or [`axiom.scrapeMetadata()`](/docs/developer-hub/api/step-functions/scrape-metadata) for page-level fields. For anything more bespoke, fall back to `/trigger` with a [**Get data**](/docs/no-code-tool/reference/steps/scrape) step.
- **Screenshots.** Not exposed. Use a No-Code Tool automation with [**Save screenshot locally**](/docs/no-code-tool/reference/steps/save-screenshot) and trigger via `/trigger`.
- **File upload / download.** Not exposed.
- **Iframe traversal.** Selectors operate on the top-level document only.
- **Direct JS evaluation.** No `evaluate()` method. For arbitrary JS, use `/trigger` with a [**Write javascript**](/docs/no-code-tool/reference/steps/write-js) step inside an automation, or drop down to the [CDP socket](/docs/developer-hub/api/cdp) and call `Runtime.evaluate` yourself.
- **Cookie / storage management.** Sessions are stateless across `browserOpen()` calls. The `doNotShareLocalstorage` flag on [`axiom.goto()`](/docs/developer-hub/api/step-functions/goto) isolates a single navigation; for finer-grained cookie handling, fall back to `/trigger`.

If you need any of the above, the typical workaround is to author a small No-Code Tool automation that includes the missing capability and call it via `/trigger` instead.

## In this section
***

::DocsCards{byOrder}
::

Need help? Contact [support](/customer-support) or ask a question in our [Reddit community](https://www.reddit.com/r/axiom_ai).
