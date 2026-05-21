---
title: Endpoints
metaTitle: axiom.ai API endpoints reference
description: Every axiom.ai API endpoint at a glance, with method, path, required parameters, and links to full reference pages.
order: 1
---

A single-page lookup of every axiom.ai API endpoint. For full request and response details, follow the link in the rightmost column.

## REST endpoints
***

The base URL for all REST endpoints is `https://lar.axiom.ai/api/v3`. All requests are `POST` with a JSON body. Authentication is by API key in the `key` field of the body, see [Authentication](/docs/developer-hub/api/authentication).

| Method | Path | Required body fields | Optional | Reference |
|---|---|---|---|---|
| `POST` | `/trigger` | `key`, `name` | `data` | [Trigger an automation](/docs/developer-hub/api/run-automations/trigger-an-automation) |
| `POST` | `/list-automations` | `key` | | [List automations](/docs/developer-hub/api/run-automations/list-automations) |
| `POST` | `/run-reports` | `key` | `count` | [List run reports](/docs/developer-hub/api/run-automations/run-reports) |
| `POST` | `/run-data` | `key`, `name` | | [Check run status](/docs/developer-hub/api/run-automations/check-run-status) |
| `POST` | `/stop` | `pid`, `pw` | | [Stop a run](/docs/developer-hub/api/run-automations/stop-a-run) |
| `POST` | `/remaining-runtime` | `key` | | [Check remaining runtime](/docs/developer-hub/api/usage-and-limits/remaining-runtime) |

## CDP endpoint
***

For driving a cloud browser from your code, connect a Chrome DevTools Protocol client to the WebSocket endpoint below. The API key is passed as the `token` query parameter.

| Protocol | Endpoint | Reference |
|---|---|---|
| `wss` | `wss://cdp-lb.axiom.ai/?token=YOUR_API_KEY` | [Start a session](/docs/developer-hub/api/step-functions/start-a-session) |

## Versioning
***

The API version is part of the path. The current version is `v3`. Older versions are deprecated and not maintained, always use `v3` in new integrations.

When a future major version ships, both the new and old paths will be served in parallel for a transition period. Breaking changes within a version are avoided wherever possible.

## Transport and headers
***

- All requests use HTTPS, plain HTTP is not supported.
- The `Content-Type` header must be `application/json`.
- No other custom headers are required. Specifically, the API key does not go in an `Authorization` header, it goes in the JSON body.
- All responses are JSON.

## Related
***

- [Error codes](/docs/developer-hub/api/reference/error-codes)
- [Data payload format](/docs/developer-hub/api/reference/data-payload-format)
- [Rate limits](/docs/developer-hub/api/usage-and-limits/rate-limits)