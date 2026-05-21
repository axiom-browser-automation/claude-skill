---
title: Quickstart
metaTitle: Run your first axiom.ai automation from cURL or code
description: Trigger a pre-built No-Code Tool automation with cURL, or drive a cloud browser from your own code with Puppeteer.
order: 2
---

There are two ways to use the axiom.ai API: trigger a pre-built No-Code Tool automation end-to-end, or connect to a cloud browser and drive it from your own code. Pick whichever matches how you want to work, the same API key authenticates both.

## Before you begin
***

You need:

- An API key. See [Authentication](/docs/developer-hub/api/authentication) to generate one.
- For option 1: a No-Code Tool automation already saved to your account.
- For option 2: any environment that can open a WebSocket. Examples below use Puppeteer in Node, but Playwright, raw CDP, or any other client works the same way.

## Option 1: trigger a No-Code Tool automation
***

Use this when you've built an automation in the No-Code Tool and want to run it from outside the Chrome extension, for example from Zapier, a backend service, or a cron job.

### Trigger the run

Send a `POST` to `/trigger` with your key and the exact name of your saved automation.

```bash
curl -X POST https://lar.axiom.ai/api/v3/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "key": "your-api-key-here",
    "name": "My First Automation"
  }'
```

Replace `your-api-key-here` with your API key, and `My First Automation` with the exact name of your automation.

> **Note:** automation names are case-sensitive and whitespace-sensitive. `My Automation`, `my automation`, and `My  Automation` (two spaces) are three different names. If you get `Task not found`, check the name in the **Dashboard** matches exactly.

A successful response looks like this:

```json
{
  "OPEN LINK IN BROWSER": "<LINK_TO_RUN_VIEWER>"
}
```

Open the link to watch the automation run live in a noVNC view of the cloud browser. The trigger call returns as soon as the run starts; it doesn't wait for the run to finish.

If your account is at its concurrency limit, the run is queued instead and the response looks like this:

```json
{
  "status": "queued",
  "message": "Axiom could not start due to a lack of available resources. The task has been queued and will retry in five minutes."
}
```

If something else goes wrong (the automation name doesn't exist, the key is wrong, your quota is exhausted), the response looks like this:

```json
{
  "status": "error",
  "message": "Task not found, please check the name and try again."
}
```

See [API responses](/docs/developer-hub/api/reference/responses) for every response shape and [Error codes](/docs/developer-hub/api/reference/errorcodes) for the full list of error messages.

### Check the status

Poll [`/run-data`](/docs/developer-hub/api/run-automations/check-run-status) with the same `name` you triggered. It returns the current status of that automation's most recent run, plus any data the run has written out so far.

```bash
curl -X POST https://lar.axiom.ai/api/v3/run-data \
  -H "Content-Type: application/json" \
  -d '{
    "key": "your-api-key-here",
    "name": "My First Automation"
  }'
```

The response includes a `status` field with one of three values: `Running`, `Success`, or `Failure`. If it's still `Running`, wait a few seconds and poll again. Every 5 to 15 seconds is plenty for most automations and avoids rate limits.

When the status reaches `Success`, the response also includes any data the automation wrote out (rows added to a Google Sheet, values returned from a custom JavaScript step, and so on).

## Option 2: drive a cloud browser from your code
***

Use this when you'd rather write the automation in code than build it in the No-Code Tool. Point any Chrome DevTools Protocol client at the axiom.ai endpoint and drive the cloud browser exactly like a local one. There's nothing to install on the axiom.ai side, the endpoint is the API.

```javascript
const browser = await puppeteer.connect({
  browserWSEndpoint: "wss://cdp-lb.axiom.ai/?token=your-api-key-here"
});

const page = await browser.newPage();
await page.setViewport({ width: 1960, height: 1080 });
await page.goto("https://axiom.ai");

await new Promise(resolve => setTimeout(resolve, 5000));

await page.close();
await browser.close();
```

Replace `your-api-key-here` with your API key. The script connects to a fresh cloud browser, navigates to a URL, waits five seconds, and tears the session down.

Drop this into whatever you already use to run code: a Node service, a serverless function, a cron job, an existing test suite. The cloud browser handles the heavy lifting (a real Chromium with networking, fonts, and resources) so your stack just sends commands and reads results.

> **Note:** the API key is passed as the `token` query parameter on the WebSocket URL, not in a header. Don't log this URL, treat it like a secret.

The same endpoint works with Playwright (`chromium.connectOverCDP("wss://cdp-lb.axiom.ai/?token=...")`), with raw CDP libraries in Python, Go, or Ruby, or with anything else that speaks the protocol.

If you just want to poke at a script before wiring it into your stack, the **Playground** in the Code Tool runs Puppeteer code in-browser with the key auto-injected, no setup needed. It's a sandbox, not the production path.

## Next steps
***

Now that you've made your first call, here's where to go next.

If you used **Option 1**:

- [Pass input data into a run](/docs/developer-hub/api/run-automations/pass-input-data) so the same automation can act on different inputs.
- [Stop a running automation](/docs/developer-hub/api/run-automations/stop) if it's misbehaving.
- Wrap the API in [Zapier, Make, or Apps Script](/docs/developer-hub/code-snippets) for no-code integrations.

If you used **Option 2**:

- See the [step functions reference](/docs/developer-hub/api/step-functions) for axiom.ai's higher-level wrappers around CDP.
- Check [remaining runtime](/docs/developer-hub/api/usage-and-limits/remaining-runtime) so long-running scripts don't run out of quota mid-task.

For everyone:

- [Build your own MCP server](/docs/developer-hub/api/mcp) so Claude or another LLM client can use axiom.ai as a tool.