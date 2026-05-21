---
title: Stop a run
metaTitle: Stop an in-flight axiom.ai cloud automation run
description: Cancel a triggered automation that's still running in the cloud, freeing the concurrency slot for other runs.
order: 5
---

The `/stop` endpoint cancels an in-flight cloud run. Use it when an automation is taking longer than expected, when your application logic determines the run is no longer needed, or when you need to free a concurrency slot for a more urgent run.

Unlike most other axiom.ai endpoints, `/stop` does not take your API key plus an automation name. It takes two values that are unique to a single live run: `pid` and `pw`. Both are extracted from the viewer URL that `/trigger` returns.

## Request
***

```http
POST /api/v3/stop
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `pid` | string | Yes | Internal run identifier. The last two digits of the host name in the viewer URL. See [How to get pid and pw](#how-to-get-pid-and-pw) below. |
| `pw` | string | Yes | Unique password for the run, also extracted from the viewer URL. Changes for every run. |

## Request payload

```json
{
  "pid": "<PID>",
  "pw": "<PASSWORD>"
}
```

## Example
***

```bash
curl -X POST https://lar.axiom.ai/api/v3/stop \
  -H "Content-Type: application/json" \
  -d '{
    "pid": "02",
    "pw": "your-run-password"
  }'
```

## How to get pid and pw
***

When you trigger a run, the response includes a viewer URL. The viewer URL contains a longer host that embeds both values. Example:

```
dev-c-0002-v4-proxy.axiom.ai&port=443&password=abc123xyz&taskId=22842
```

From this URL:

- **`pid`** is the last two digits of the host name. In the example above, the host is `dev-c-0002-v4-proxy.axiom.ai`, so `pid` is `02`.
- **`pw`** is the value of the `password` query parameter. In the example, `pw` is `abc123xyz`.

Both values are tied to one specific run. They change every time you trigger.

## When to stop a run
***

Common reasons to call `/stop`:

- **The user cancelled the request that triggered the run.** If your application kicked off a run for a user-initiated action and the user backs out, stop the run rather than letting it complete.
- **The run is taking too long.** Some runs hang on a slow page or a captcha. If you have an SLA, stop the run after a deadline and surface the failure to your application.
- **You triggered duplicates.** If your trigger logic accidentally fires the same run twice, stop the duplicate before it starts consuming runtime.
- **You need a concurrency slot for something more urgent.** Stopping a queued or low-priority run frees a slot immediately for the next trigger.

## What happens to a stopped run
***

A stopped run reports `Failure` from [`/run-data`](/docs/developer-hub/api/run-automations/check-run-status) after cancellation. Any partial output the automation had already written (rows added to a Google Sheet, files downloaded) stays where it was written; the cleanup is your responsibility.

Stopped runs still count against your runtime allowance for the time they were actually executing. A queued run that's stopped before it starts uses no runtime.

## Notes
***

- You must extract `pid` and `pw` from the viewer URL at trigger time. There's no way to look them up later from your API key alone, so store them if you might need to stop the run.
- Stopping a run that's already finished (status `Success` or `Failure`) is a no-op; the call returns successfully without doing anything.
- There's no way to "pause" a run today, only stop. If you need to interrupt a long-running flow and resume later, design the automation around `/trigger` calls that pick up where the previous one left off (for example, by reading a checkpoint from a Google Sheet).
- Stopping a run doesn't undo any external side effects the automation produced before the stop signal arrived. If the automation sent emails, made API calls, or moved money, those actions are not reversed.
