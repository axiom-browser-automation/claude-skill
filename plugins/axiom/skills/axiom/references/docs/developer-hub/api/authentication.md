---
title: Authentication
metaTitle: Authenticate axiom.ai API requests with an API key
description: Generate an axiom.ai API key from the Chrome extension or Code Tool and use it to authenticate every API request.
order: 3
---

API requests are authenticated with an API key. The same key authenticates the full API surface, REST endpoints and cloud browser sessions, so you only need to generate one.

## Generate an API key
***

You can generate a key from three places. They all create the same account-scoped key, use whichever surface you already have open.

> **Signing up from code?** If you're writing an agent, a Claude skill, or any tool that needs to onboard its own users without sending them to the dashboard first, see [Programmatic signup](/docs/developer-hub/api/programmatic-signup) for the three-call REST flow that creates an account and mints a key end-to-end.

### From the Chrome extension

1. Open the **Dashboard**.
2. In the left sidebar, click **Credentials and API key**.
3. Scroll to **Generate Axiom API token**.
4. Click **Show API Token** to reveal an existing key, or **Refresh API Token** to generate a new one.
5. Copy the value.

### From the Code Tool dashboard

1. Open the **Code dashboard**.
2. Click the **Settings** cog in the left sidebar.
3. Select **API key**.
4. Click **Delete and re-generate API key**.
5. Copy the value.

### From the Code Tool playground

The **Playground** has a shortcut so you can paste a key (or generate one) without leaving the script you're testing.

1. Open the **Code dashboard**.
2. Click **Playground**, then **Test Puppeteer scripts**.
3. Paste your key into the **API key** field, or click **Generate key** to create a new one.

The key is automatically substituted into the `[HIDDEN_KEY]` placeholder in the example script, so you can run it immediately.

> **Warning:** generating a new key immediately invalidates the previous one. Any external integration using the old key (Zapier, Make, custom scripts, MCP servers, Puppeteer connections) stops working until you update it.

## Use the key in a request
***

For REST endpoints, pass the key in the JSON body, in the `key` field.

```bash
curl -X POST https://lar.axiom.ai/api/v3/remaining-runtime \
  -H "Content-Type: application/json" \
  -d '{"key": "your-api-key-here"}'
```

> **Note:** the key goes in the request body, not in an `Authorization` header. This is unusual for REST APIs, watch for it when porting code from other services.

For cloud browser sessions, the same key is passed as the `token` query parameter on the CDP WebSocket endpoint.

```javascript
const browser = await puppeteer.connect({
  browserWSEndpoint: "wss://cdp-lb.axiom.ai/?token=your-api-key-here"
});
```

## What the key authenticates
***

A single key authenticates the full API surface:

- Trigger and manage cloud automation runs (`/trigger`, `/stop`, `/run-data`).
- Check account quota (`/remaining-runtime`).
- Drive cloud browser sessions over CDP (Puppeteer, Playwright, or the imperative session functions).

Keys are account-scoped: there is no per-automation, per-team, or per-integration key today, and only one active key per account at a time.

## Security best practices
***

Treat your API key like a password.

- Don't commit it to git, even in private repos.
- Store it in environment variables or a secrets manager, not in client-side code. A key in client-side JavaScript is a key the world has.
- Rotate the key if you suspect it's been exposed. Remember to update every integration immediately afterwards, the old key stops working as soon as the new one is generated.
- When sharing automations or scripts with teammates, share the source, not the key. Each developer can generate their own.

## Related
***

- [Programmatic signup](/docs/developer-hub/api/programmatic-signup) — sign up + mint a key from code
- [Trigger an automation](/docs/developer-hub/api/run-automations/trigger)
- [Start a browser session](/docs/developer-hub/api/step-functions/start-a-session)
- [Check remaining runtime](/docs/developer-hub/api/usage-and-limits/remaining-runtime)