---
title: Trigger an automation
metaTitle: Trigger an axiom.ai cloud automation via the API
description: Start a saved No-Code Tool automation in the cloud by name, with optional input data passed in the request body.
order: 2
---

The `/trigger` endpoint starts a cloud run of a saved No-Code Tool automation. The automation must already exist in your account and be saved to the cloud. The call returns immediately with a viewer link, or with a queued/error response if the run could not start.

## Request
***

```http
POST /api/v3/trigger
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `key` | string | Yes | Your API key. See [Authentication](/docs/developer-hub/api/authentication). |
| `name` | string | Yes | Exact name of the automation, as it appears in the **Dashboard**. Case-sensitive and whitespace-sensitive. |
| `data` | array | No | Input data passed into the automation. See [Pass input data](/docs/developer-hub/api/run-automations/pass-input-data) for the shape. |

## Response
***

The response shape depends on what happened. Three variants:

### Success: run started

```json
{
  "OPEN LINK IN BROWSER": "<LINK_TO_RUN_VIEWER>"
}
```

| Field | Type | Description |
|---|---|---|
| `OPEN LINK IN BROWSER` | string | URL to a live noVNC view of the cloud browser. Useful for watching the run in real time or sharing a screencast with support. |

### Queued: run accepted but waiting for a slot

```json
{
  "status": "queued",
  "message": "Axiom could not start due to a lack of available resources. The task has been queued and will retry in five minutes."
}
```

| Field | Type | Description |
|---|---|---|
| `status` | string | `queued` when the call was accepted but no concurrency slot is free yet. |
| `message` | string | Human-readable description of what's happening and when the run will be retried. |

See [Queue and concurrency](/docs/developer-hub/api/usage-and-limits/queue-and-concurrency) for details on how queueing works.

### Error: run did not start

```json
{
  "status": "error",
  "message": "Task not found, please check the name and try again."
}
```

| Field | Type | Description |
|---|---|---|
| `status` | string | `error` when the call failed. |
| `message` | string | Description of what went wrong. See [Errors](#errors) below for common messages. |

## Example
***

```bash
curl -X POST https://lar.axiom.ai/api/v3/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "key": "your-api-key-here",
    "name": "My First Automation"
  }'
```

With input data:

```bash
curl -X POST https://lar.axiom.ai/api/v3/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "key": "your-api-key-here",
    "name": "Scrape product page",
    "data": [
      ["url"],
      ["https://example.com/product/1"],
      ["https://example.com/product/2"]
    ]
  }'
```

`data` is a 2D array of `[row][col]`. The first row is typically a header. See [Pass input data](/docs/developer-hub/api/run-automations/pass-input-data) for the full format and how to consume it inside an automation with the **Receive data from another app** step.

## Errors
***

| Response | Cause |
|---|---|
| `Task not found, please check the name and try again.` | The `name` doesn't match any automation in your account. Almost always a case or whitespace mismatch. |
| `Invalid key` | The `key` is missing or doesn't match an active API key. Generate a new one in the **Dashboard**. |
| `Quota exceeded` | Your account has used its full cloud runtime allowance for the billing period. See [Check remaining runtime](/docs/developer-hub/api/usage-and-limits/remaining-runtime). |

## Notes
***

- Triggering a run never returns a "concurrency limit" error. If your account is already at its concurrent-run limit, the new run is queued and the call returns a queued response (see above). See [Queue and concurrency](/docs/developer-hub/api/usage-and-limits/queue-and-concurrency).
- To track a run after triggering, poll [`/run-data`](/docs/developer-hub/api/run-automations/check-run-status) with the same `name` you triggered. It returns the current status of that automation's most recent run.
- Names are matched exactly. `My Automation`, `my automation`, and `My  Automation` (two spaces) are three different names. If you keep getting `Task not found`, copy the name directly from the **Dashboard** rather than retyping it.
- Only the latest saved version of the automation runs. There's no way to pin to an older revision via the API today.