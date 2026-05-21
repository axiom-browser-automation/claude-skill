---
title: Rate limits
metaTitle: axiom.ai API rate limits and how to stay inside them
description: The axiom.ai API allows 100 calls per minute per API key. Calls past that limit return a 429 error and the requested automation does not run.
order: 4
---

The axiom.ai API allows up to 100 calls per minute per API key. This protects our infrastructure and keeps resources available for every user. We recommend that you limit calls in the application that triggers your automations to prevent failures.

## The limit
***

- **100 calls per 1 minute window**, counted per API key.
- Applies to every endpoint, not just `/trigger`. `/run-data`, `/stop`, `/remaining-runtime`, and all step functions count against the same allowance.
- The window is rolling, not aligned to wall-clock minutes.

## What happens when you hit it
***

Calls past the limit return a [`429: Too Many Requests`](/docs/developer-hub/api/reference/errorcodes) error. The automation does not run, and the failed call does not appear in your run reports.

That means a 429 isn't logged anywhere in the Dashboard, so if you're missing runs you'd expect to see, check your own application logs for `429` responses first.

## How to stay inside the limit
***

- **Throttle on your side.** Add a 100-per-minute cap (or lower) in the application that calls the API, so excess calls back up in your own queue instead of being rejected.
- **Use exponential backoff** when you do hit a 429. Wait, retry, wait longer, retry. Don't fire the same call again in a tight loop.
- **Spread calls evenly.** A burst of 100 calls in the first second of the window is still over the limit. Pace them across the full minute.
- **Cache responses you don't need to refetch.** `/remaining-runtime` doesn't change second to second. Poll it once a minute, not once a second.

## Related
***

- [Queue and concurrency](/docs/developer-hub/api/usage-and-limits/queue-and-concurrency)
- [Check remaining runtime](/docs/developer-hub/api/usage-and-limits/check-remaining-runtime)
- [Error codes](/docs/developer-hub/api/reference/errorcodes)
