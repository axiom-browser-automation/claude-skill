---
title: Check run status
metaTitle: Check the status of an axiom.ai cloud automation run
description: Poll the axiom.ai API for the current status of an automation by name and retrieve any data it wrote out.
order: 4
---

The `/run-data` endpoint returns the current status of an automation and any data it wrote out (for example, rows added to a Google Sheet, or values returned from a custom JavaScript step). Identify the run by the automation's `name`, the same string you pass to [`/trigger`](/docs/developer-hub/api/run-automations/trigger-an-automation). Poll this endpoint after triggering to know when the run is finished.

## Request
***

```http
POST /api/v3/run-data
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `key` | string | Yes | Your API key. See [Authentication](/docs/developer-hub/api/authentication). |
| `name` | string | Yes | Exact name of the automation, as it appears in the **Dashboard**. Case-sensitive and whitespace-sensitive. Same string you pass to `/trigger`. |

## Request payload

```json
{
  "key": "<API_KEY>",
  "name": "<AUTOMATION_NAME>"
}
```

## Response
***

```json
{
  "status": "Success",
  "data": {
    "google-sheet-data": [
      ["A1", "B1", "C1"],
      ["A2", "B2", "C2"]
    ]
  }
}
```

| Field | Type | Description |
|---|---|---|
| `status` | string | One of `Running`, `Success`, or `Failure`. |
| `data` | object | Data the automation wrote out, keyed by the token name of each Google Sheet (or other writer step). Each value is a 2D array of `[row][col]`. |

### Status values

| Value | Meaning |
|---|---|
| `Running` | The run is in the queue or actively executing. |
| `Success` | The run completed without errors. The `data` field contains any output. |
| `Failure` | The run hit an error and stopped. Check the run report in the **Dashboard** for details. |

## Example
***

```bash
curl -X POST https://lar.axiom.ai/api/v3/run-data \
  -H "Content-Type: application/json" \
  -d '{
    "key": "your-api-key-here",
    "name": "My First Automation"
  }'
```

A typical polling loop:

```javascript
async function waitForRun(name, key) {
  while (true) {
    const res = await fetch("https://lar.axiom.ai/api/v3/run-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, name }),
    });
    const result = await res.json();

    if (result.status === "Success") return result.data;
    if (result.status === "Failure") throw new Error("Run failed");

    await new Promise(r => setTimeout(r, 10_000)); // poll every 10s
  }
}
```

## Polling cadence
***

Poll every 5 to 15 seconds for most automations. Faster polling won't make the run finish any quicker, and may trip [rate limits](/docs/developer-hub/api/usage-and-limits/rate-limits). For long-running automations (those that take more than a few minutes), increase the interval to 30 seconds or use exponential backoff: start at 5 seconds, double each time, cap at 60.

## When there's no completion webhook
***

The API doesn't push a notification when a run finishes; polling `/run-data` is the only way to detect completion from outside. If you want a push-style notification, add a [**Trigger webhook**](/docs/developer-hub/api/run-automations/webhooks-from-a-step) step inside the automation itself. The automation will POST to your URL when it reaches that step, which you can place at the end of the flow to get a "done" signal.

## Notes
***

- `/run-data` returns the status of the most recent run of an automation with the given name. To see runs further back in history, use [`/run-reports`](/docs/developer-hub/api/run-automations/run-reports).
- The `data` object is keyed by the token name of each writer step (most commonly a Google Sheet token). One automation can write to several sheets, in which case `data` has several keys. Each value is the 2D `[row][col]` content of that sheet.
- An automation that doesn't write any data returns `data` as an empty object.
- A run that's been queued reports `Running`, the same as a run that's actively executing. There's no separate `Queued` state today. See [Queue and concurrency](/docs/developer-hub/api/usage-and-limits/queue-and-concurrency) for ways to tell the two apart.
- Names are matched exactly. Case and whitespace must match the **Dashboard**.
