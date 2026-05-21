---
title: API responses
metaTitle: axiom.ai API response shapes for every endpoint
description: Every JSON response shape returned by the axiom.ai API, including success, queued, and error variants.
order: 2
---

Every axiom.ai API endpoint returns JSON. Successful responses always include the data the endpoint promised. Queued and error responses use a `status` field so your code can branch on it cleanly. The full set of shapes is below, grouped by endpoint.

## /trigger
***

Three possible responses. Inspect the keys to know which one you got.

### Success: run started

```json
{
  "OPEN LINK IN BROWSER": "<LINK_TO_RUN_VIEWER>"
}
```

The link opens a live noVNC view of the cloud browser.

### Queued: waiting for a concurrency slot

```json
{
  "status": "queued",
  "message": "Axiom could not start due to a lack of available resources. The task has been queued and will retry in five minutes."
}
```

See [Queue and concurrency](/docs/developer-hub/api/usage-and-limits/queue-and-concurrency) for how queueing works.

### Error: run did not start

```json
{
  "status": "error",
  "message": "Task not found, please check the name and try again."
}
```

Common `message` values are listed in [Error codes](/docs/developer-hub/api/reference/errorcodes).

## /remaining-runtime
***

```json
{
  "status": "success",
  "data": {
    "used": 0.47,
    "allowance": 15000,
    "remaining": 14999.53
  }
}
```

All values are in minutes. See [Check remaining runtime](/docs/developer-hub/api/usage-and-limits/remaining-runtime) for field descriptions.

## /list-automations
***

```json
{
  "status": "success",
  "data": {
    "names": [
      "Automation 1",
      "Automation 2"
    ]
  }
}
```

`names` are the exact strings you pass to `/trigger` as the `name` parameter. See [List automations](/docs/developer-hub/api/run-automations/list-automations).

## /run-reports
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

Reports are sorted most-recent first. `status` is one of `Running`, `Success`, or `Failure`. Default is 5 reports, override with the optional `count` parameter. See [List run reports](/docs/developer-hub/api/run-automations/run-reports).

## /run-data
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

`status` is one of `Running`, `Success`, or `Failure`. `data` is an object keyed by the token name of each writer step (typically a Google Sheet). Each value is a 2D `[row][col]` array of what the step wrote. See [Check run status](/docs/developer-hub/api/run-automations/check-run-status).

## Reading any response
***

A robust client checks for the `status` field first:

```javascript
const data = await res.json();

if (data.status === "error") {
  throw new Error(data.message);
}
if (data.status === "queued") {
  console.log("Queued:", data.message);
  return;
}
if (data.status === "success") {
  return data.data;
}

// /trigger success has no `status` field, just the viewer link.
if (data["OPEN LINK IN BROWSER"]) {
  return data["OPEN LINK IN BROWSER"];
}
```

## Related
***

- [Endpoints](/docs/developer-hub/api/reference/endpoints)
- [Error codes](/docs/developer-hub/api/reference/errorcodes)
- [Data payload](/docs/developer-hub/api/reference/data-payload)
