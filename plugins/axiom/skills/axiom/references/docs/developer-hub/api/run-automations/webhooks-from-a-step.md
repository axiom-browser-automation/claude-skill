---
title: Webhooks from a step
metaTitle: Send and receive webhooks inside an axiom.ai automation
description: Use webhook steps inside an automation to push data to external services or trigger an automation from inbound webhooks.
order: 6
---

Webhooks in axiom.ai are not part of the REST API surface, they are step types you add inside an automation. This page explains the two webhook step types and how they relate to `/trigger`.

## Trigger vs webhook steps
***

Two different directions, two different mechanisms:

| Direction | Use this | What it does |
|---|---|---|
| External system → axiom.ai | [`/trigger`](/docs/developer-hub/api/run-automations/trigger-an-automation) (REST endpoint) | An external service tells axiom.ai to start an automation. |
| External system → axiom.ai | [**Receive data from another app**](/docs/no-code-tool/reference/steps/webhook-receive) (step) | An automation step waits for inbound data from a webhook URL axiom.ai provides. |
| axiom.ai → external system | [**Trigger webhook**](/docs/no-code-tool/reference/steps/trigger-webhook) (step) | An automation step POSTs collected data to a URL you provide, mid-run. |

Use `/trigger` when your code is the orchestrator and axiom.ai is one of many things it kicks off. Use webhook steps when the automation itself is the orchestrator, calling out to other services as it runs.

## Send data to an external service mid-run
***

Add a **Trigger webhook** step anywhere in your automation. When the run reaches it, axiom.ai POSTs the configured payload to your URL.

Common patterns:

- **End-of-run notification.** Place a **Trigger webhook** step at the end of the automation. Your service receives a POST when the run finishes, removing the need to poll [`/run-data`](/docs/developer-hub/api/run-automations/check-run-status).
- **Streaming results.** Inside a [**Loop through data**](/docs/no-code-tool/reference/steps/loop) step, add a **Trigger webhook** step. Each iteration of the loop POSTs its result to your service, useful for processing scraped data in real time rather than waiting for the whole automation to finish.
- **Branching to external logic.** Use **Trigger webhook** to hand off to a serverless function that does something axiom.ai can't, then continue the automation with the function's response.

## Receive data from an external service
***

Add a **Receive data from another app** step at the start of your automation (or wherever you want to consume external data). The step provides a webhook URL you give to your external service. Data POSTed to that URL is available to subsequent steps as if it had been entered manually.

This is separate from `/trigger`. The differences:

- `/trigger` starts a run and accepts an optional `data` payload.
- **Receive data from another app** runs as part of an automation that's already executing, pulling data in mid-flow.

If you need to start a run AND pass data, use `/trigger` with the `data` parameter, see [Pass input data](/docs/developer-hub/api/run-automations/pass-input-data). Use **Receive data from another app** when you want a step inside a longer automation to pause and wait for external input.

## Configuration and security
***

Both webhook step types are configured inside the **Builder**, not via the API. Open the relevant step's reference page for the configuration fields and authoring details:

- [Trigger webhook](/docs/no-code-tool/reference/steps/trigger-webhook)
- [Receive data from another app](/docs/no-code-tool/reference/steps/webhook-receive)

For inbound webhook URLs, treat the URL itself as a secret. Anyone who knows the URL can POST data into your automation. Rotate the URL (by re-creating the step) if you suspect it's been exposed.

## Related
***

- [Trigger an automation](/docs/developer-hub/api/run-automations/trigger-an-automation)
- [Check run status](/docs/developer-hub/api/run-automations/check-run-status)