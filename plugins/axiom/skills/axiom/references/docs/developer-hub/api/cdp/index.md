---
title: Connect over CDP
metaTitle: Connect Puppeteer, Playwright, or any CDP client to axiom.ai cloud browsers
description: Drive a cloud browser from your own code over a Chrome DevTools Protocol WebSocket. Works with Puppeteer, Playwright, raw CDP libraries, or anything else that speaks the protocol.
order: 3
---

The CDP endpoint is a Chrome DevTools Protocol WebSocket pointed at a fresh cloud browser. Connect a CDP-speaking client (Puppeteer, Playwright, or any raw CDP library) to drive the browser exactly as you would locally — except it runs on our infrastructure, with no Chromium to install or maintain.

This is the right surface when you want full control of every browser action from your own stack, in any language. If you'd rather call high-level actions in Node without writing CDP, see the [step function library](/docs/developer-hub/api/step-functions). If the workflow already exists in the No-Code Tool and you just want to fire it, see [Trigger & orchestrate](/docs/developer-hub/api/run-automations) instead.

## Endpoint
***

| Protocol | URL |
|---|---|
| `wss` | `wss://cdp-lb.axiom.ai/?token=YOUR_API_KEY` |

Pass your API key as the `token` query parameter. See [Authentication](/docs/developer-hub/api/authentication) to generate one.

> **Note:** never log the connection URL. The token is the same secret as the REST API key — treat the full URL as a credential.

## Connect with Puppeteer
***

`npm i puppeteer`, then point `puppeteer.connect()` at the endpoint:

```javascript
import puppeteer from "puppeteer";

const browser = await puppeteer.connect({
  browserWSEndpoint: `wss://cdp-lb.axiom.ai/?token=${process.env.AXIOM_API_KEY}`
});

try {
  const page = await browser.newPage();
  await page.goto("https://example.com");
  await page.screenshot({ path: "out.png", fullPage: true });
} finally {
  await browser.close();
}
```

The cloud browser handles the heavy lifting (a real Chromium with networking, fonts, and resources). Your stack just sends commands and reads results. Drop this into anywhere code runs: a Node service, a serverless function, a cron job, a test suite.

Wrap the work in `try`/`finally` so the session always closes, even on errors. A leaked session continues to count against your [remaining runtime](/docs/developer-hub/api/usage-and-limits/remaining-runtime) until the server reaps it.

## Connect with Playwright
***

`npm i playwright`, then use `chromium.connectOverCDP()`:

```javascript
import { chromium } from "playwright";

const browser = await chromium.connectOverCDP(
  `wss://cdp-lb.axiom.ai/?token=${process.env.AXIOM_API_KEY}`
);

try {
  const context = browser.contexts()[0];
  const page = context.pages()[0] ?? await context.newPage();
  await page.goto("https://example.com");
  await page.screenshot({ path: "out.png", fullPage: true });
} finally {
  await browser.close();
}
```

Playwright surfaces the connected browser as an existing context. Use the first context's first page (or create one) rather than calling `browser.newContext()`, which is not supported over CDP.

## Connect with raw CDP or other languages
***

The endpoint is plain CDP, so any client that speaks the protocol works — including Python (`pyppeteer`, `playwright`), Go (`chromedp`), Ruby (`ferrum`), or a raw WebSocket library. For raw CDP, open a WebSocket to the endpoint and exchange JSON-RPC messages following the [Chrome DevTools Protocol spec](https://chromedevtools.github.io/devtools-protocol/).

```python
# Python example using playwright
from playwright.sync_api import sync_playwright
import os

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp(
        f"wss://cdp-lb.axiom.ai/?token={os.environ['AXIOM_API_KEY']}"
    )
    page = browser.contexts[0].pages[0]
    page.goto("https://example.com")
    page.screenshot(path="out.png")
    browser.close()
```

## Session lifecycle
***

Each successful connection opens a fresh, isolated cloud browser. Sessions consume runtime quota for their entire open lifetime, not just while actively executing commands. Always close the connection when you're done:

- **Puppeteer:** `await browser.close()`. Use `browser.disconnect()` only if you want to leave the cloud browser running — it keeps consuming runtime until the server reaps it.
- **Playwright:** `await browser.close()`.
- **Raw CDP:** close the WebSocket. The server reaps the browser shortly after.

Idle sessions are eventually timed out by the server, but this is not immediate — a leaked session can rack up several minutes of runtime before being reaped. Check [remaining runtime](/docs/developer-hub/api/usage-and-limits/remaining-runtime) if a script seems to drain quota unexpectedly.

## How it differs from local Puppeteer
***

The cloud browser behaves like a local Chromium with a few practical differences worth knowing up front:

- **Datacentre IP**: some sites detect and block known datacentre ranges. Expect this on a subset of targets.
- **No local filesystem**: `file://` URLs, `--user-data-dir` mounts, and similar local-only features aren't usable. Use page-side downloads or upload buffers through your code instead.
- **No persistent state across sessions**: each `puppeteer.connect()` opens a fresh browser. Cookies, localStorage, and other in-memory state vanish on disconnect. To persist, capture and re-apply in your own code.
- **Concurrency per API key**: the number of concurrent open sessions is capped by your plan tier. See [Queue and concurrency](/docs/developer-hub/api/usage-and-limits/queue-and-concurrency).

## Related
***

- [Quickstart — drive a cloud browser from your code](/docs/developer-hub/api/quickstart)
- [Endpoints reference](/docs/developer-hub/api/reference/endpoints)
- [Error codes](/docs/developer-hub/api/reference/errorcodes)
- [Step function library](/docs/developer-hub/api/step-functions) — high-level wrapper around this endpoint

Need help? Contact [support](/customer-support) or ask a question in our [Reddit community](https://www.reddit.com/r/axiom_ai).
