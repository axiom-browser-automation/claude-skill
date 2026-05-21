---
title: List run reports
metaTitle: List recent axiom.ai automation runs
description: Fetch a list of recent automation runs on your account, each with its status, description, and timestamps.
order: 4
---

The `/run-reports` endpoint returns recent runs on your account, each with the automation name, status, description, and timestamps. Use it to check whether a recently triggered run has finished, to build a run-history view in your own dashboard, or to audit what your integration has been doing.

## Request
***

```http
POST /api/v3/run-reports
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `key` | string | Yes | Your API key. See [Authentication](/docs/developer-hub/api/authentication). |
| `count` | number | No | Number of reports to return. Defaults to `5`. |

## Request payload

```json
{
  "key": "<API_KEY>",
  "count": 10
}
```

## Response
***

```json
{
  "status": "success",
  "data": {
    "reports": [
      {
        "task_name": "Automation Name",
        "status": "Success",
        "description": "Execution started with Axiom cloud version 4.6.0 (remotely triggered)\n\nAxiom run completed successfully!",
        "created_at": "2025-04-10T15:14:51.000000Z",
        "updated_at": "2025-04-10T15:15:00.000000Z"
      }
    ]
  }
}
```

| Field | Type | Description |
|---|---|---|
| `status` | string | `success` on a successful call, otherwise an error string. |
| `data.reports` | array | Array of run reports, most recent first. |
| `reports[].task_name` | string | Name of the automation that ran, matching the `name` passed to `/trigger`. |
| `reports[].status` | string | One of `Running`, `Success`, or `Failure`. |
| `reports[].description` | string | Human-readable run summary, including the cloud version and any failure details. |
| `reports[].created_at` | string | ISO 8601 UTC timestamp of when the run started. |
| `reports[].updated_at` | string | ISO 8601 UTC timestamp of the most recent status change. |

## Example
***

```bash
curl -X POST https://lar.axiom.ai/api/v3/run-reports \
  -H "Content-Type: application/json" \
  -d '{"key": "your-api-key-here"}'
```

A common pattern is to trigger a run, then poll `/run-reports` until your task's most recent report shows `Success` or `Failure`:

```javascript
const KEY = process.env.AXIOM_API_KEY;
const TASK = "My First Automation";

await fetch("https://lar.axiom.ai/api/v3/trigger", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ key: KEY, name: TASK }),
});

while (true) {
  await new Promise(r => setTimeout(r, 10000));
  const res = await fetch("https://lar.axiom.ai/api/v3/run-reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: KEY }),
  });
  const { data } = await res.json();
  const latest = data.reports.find(r => r.task_name === TASK);
  if (latest && latest.status !== "Running") {
    console.log(`Run finished with status: ${latest.status}`);
    break;
  }
}
```

## Notes
***

- Reports are returned most-recent first based on `created_at`.
- Each call to `/run-reports` counts against the [100-per-minute rate limit](/docs/developer-hub/api/usage-and-limits/rate-limits). Don't poll faster than once every 5 to 15 seconds.
- `description` can contain multi-line text including stack traces for failed runs. Render it as preformatted text, not HTML, to preserve formatting.
- The endpoint returns recent runs only. There's no historical archive accessible over the API today.
