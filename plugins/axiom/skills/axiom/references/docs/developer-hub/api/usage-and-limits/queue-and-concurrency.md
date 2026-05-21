---
title: Queue and concurrency
metaTitle: How axiom.ai queues cloud automation runs
description: Understand how axiom.ai handles concurrent cloud runs, when triggers get queued, and how the queue clears.
order: 3
---

Cloud runs are queued per account. Your plan determines how many runs can execute at the same time, and any trigger above that limit waits its turn instead of failing.

## How it works
***

When you call `/trigger`, the API always accepts the request and returns a `run_id`, even if your account is already at its concurrency limit. The new run is added to the back of your account's queue and starts as soon as a running slot frees up.

This means:

- Triggering a run never returns "too many concurrent runs" as an error. The call succeeds and you get a `run_id` regardless.
- The `run_id` you receive is real and pollable from the moment it's returned, but `/run-data` will report `Running` only once the run actually starts executing.
- Queued runs are processed in the order they were triggered. There's no priority queue or fast-track tier today.

## Check whether a run is queued or executing
***

The `/run-data` endpoint returns a `status` field. A run that's been triggered but is still waiting in the queue reports `Running`, the same as one that's actively executing in the cloud browser. There's no separate `Queued` state today, so you can't programmatically distinguish "waiting for a slot" from "actively running" without additional signals (for example, checking whether the bot has produced any output yet).

If you need to tell the two apart, the most reliable approach is to call `/remaining-runtime` before and after the trigger, queued runs don't consume runtime until they start executing.

## Cloud concurrency limits per plan
***

| Plan | Max concurrent cloud runs |
|---|---|
| Starter | 1 |
| Pro | 1 |
| Pro Max | 2 |
| Ultimate | 20 |

> **Note:** exact concurrency limits per plan tier are confirmed on the [pricing page](/pricing). Use that as the source of truth, the table above is for quick reference.

## Tips for high-volume callers
***

- **Stay inside the 100-per-minute rate limit.** The API allows 100 calls per minute per key (see [rate limits](/docs/developer-hub/api/usage-and-limits/rate-limits)). Past that, calls return `429: Too Many Requests` and the automation does not run. Throttle on your side so excess calls back up in your own queue instead of being silently rejected.
- **Use exponential backoff on polling.** If a run has been `Running` for several minutes, double your polling interval each time. A 5-second initial interval that backs off to 30 seconds works well for most automations and keeps polling clear of the rate limit.
- **Cap concurrency in your own code.** If your integration occasionally spikes, add a semaphore on your side so you don't queue hundreds of runs that won't complete for hours.
- **Stop runs you no longer need.** If your application logic determines a queued run is no longer relevant (for example, the user cancelled a request), call [`/stop`](/docs/developer-hub/api/run-automations/stop-a-run) to cancel it and free the slot for something else.