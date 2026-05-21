---
title: Error codes
metaTitle: axiom.ai API error codes and how to fix them
description: Every axiom.ai API error response, what it means, and how to resolve it.
order: 2
---

A reference of every error response the axiom.ai API can return, with the most likely cause and how to fix it. For programmatic handling, branch on the HTTP status code first, then on the error string.

## Errors by HTTP status
***

| Status | Meaning | Common cause |
|---|---|---|
| `200` | Success | Request was accepted and processed. The response body indicates the actual outcome (run started, run failed, and so on). |
| `400` | Bad request | A required field is missing, or the request body isn't valid JSON. |
| `401` | Unauthorised | The `key` field is missing or doesn't match an active API key. |
| `403` | Forbidden | Your account is over its quota for the billing period. |
| `404` | Not found | The named automation doesn't exist, or the `run_id` is invalid or expired. |
| `429` | Too many requests | You've exceeded the rate limit on this API key. Back off and retry. See [Rate limits](/docs/developer-hub/api/usage-and-limits/rate-limits). |
| `5xx` | Server error | A transient issue on the axiom.ai side. Retry with backoff. |

## Common error messages
***

The API returns a JSON body with an error string for failures. The exact wording is subject to change, so treat the HTTP status as the canonical signal and use the error string for diagnosis.

| Error string | HTTP status | Cause | Fix |
|---|---|---|---|
| `Task not found, please check the name and try again.` | `404` | The `name` in your `/trigger` request doesn't match any automation in your account. Almost always a case or whitespace mismatch. | Open the **Dashboard** and copy the automation name exactly. Names are case- and whitespace-sensitive. |
| `Invalid key` | `401` | The `key` field is missing or doesn't match any active API key. | Generate a new key, see [Authentication](/docs/developer-hub/api/authentication). Remember that generating a new key invalidates the old one. |
| `Quota exceeded` | `403` | Your account has used its full cloud runtime allowance for the billing period. | Wait for the next billing cycle, or upgrade your plan. Check usage with [`/remaining-runtime`](/docs/developer-hub/api/usage-and-limits/remaining-runtime). |
| `Rate limit exceeded. Try again in a few seconds.` | `429` | You're calling the API faster than your tier allows. | Implement exponential backoff. See [Rate limits](/docs/developer-hub/api/usage-and-limits/rate-limits). |
| `Run not found` | `404` | The `run_id` you passed to `/run-data` or `/stop` is invalid, expired, or wasn't created by this API key. | Check the `run_id` matches what `/trigger` returned. Run IDs are tied to the key that created them. |

## Run status: Failure
***

A successful API call (HTTP `200`) can still report that the run itself failed. Check the `status` field in the `/run-data` response:

| Status | Meaning |
|---|---|
| `Running` | Run is queued or actively executing. |
| `Success` | Run completed without errors. |
| `Failure` | Run hit an error inside the automation and stopped. |

When `status` is `Failure`, the API doesn't return the underlying error message in the response, the run failed inside the cloud browser, not at the API layer. To diagnose:

1. Open the run in the **Dashboard**, every run has a detailed report with screenshots and step-level error messages.
2. Open the `viewer_url` returned by `/trigger` if the run is still recent enough to be available.
3. Add an [**Add error metadata**](/docs/no-code-tool/reference/steps/error-metadata) step to your automation. Any data it captures is included in error reports for steps after it.

## Browser session errors
***

Errors driving a cloud browser via CDP appear as exceptions in your client library (Puppeteer, Playwright), not as HTTP responses. The most common:

| Symptom | Cause | Fix |
|---|---|---|
| `WebSocket connection failed` | The endpoint URL is wrong, or the API key in the `token` parameter is invalid. | Check the URL is exactly `wss://cdp-lb.axiom.ai/?token=YOUR_API_KEY`. Generate a new key if needed. |
| `Navigation timeout exceeded` | The target page is slow or unreachable from a datacentre IP. | Increase the timeout: `page.goto(url, { timeout: 60_000 })`. For sites that block datacentre IPs, this won't help, the page is simply unreachable. |
| `No element found for selector` | The selector doesn't match anything on the page, or the element hasn't rendered yet. | Use `page.waitForSelector(selector)` before clicking or typing. |
| `Browser has disconnected` | Your session timed out, was closed by the server, or the API key was rotated mid-session. | Reconnect with a fresh `puppeteer.connect()`. Wrap long-running scripts in retry logic. |

## Always retry on
***

A small number of error categories are safe to retry blindly with exponential backoff:

- HTTP `429` (rate limited).
- HTTP `5xx` (transient server error).
- WebSocket connection drops on the CDP endpoint that aren't due to an invalid key.

## Never retry on
***

These won't get better with retries, treat them as permanent failures and surface to your application:

- HTTP `400` (your request is malformed, fix the request).
- HTTP `401` (the key is invalid, rotate and update).
- HTTP `403` (out of quota, wait or upgrade).
- HTTP `404` (the automation or run doesn't exist, fix the reference).

## Related
***

- [Rate limits](/docs/developer-hub/api/usage-and-limits/rate-limits)
- [Endpoints](/docs/developer-hub/api/reference/endpoints)