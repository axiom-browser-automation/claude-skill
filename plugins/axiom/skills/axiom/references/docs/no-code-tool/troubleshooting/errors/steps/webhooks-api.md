---
title: Webhook and API step errors
metaTitle: Fix errors with webhook and API steps in axiom.ai
description: Errors that can occur when using the Trigger webhook and Receive data from another app steps, including JSON validation issues and missing test data.
order: 8
---

The errors on this page can occur with steps that send or receive data over webhooks. For errors returned by the axiom.ai API itself, see [API errors](/docs/no-code-tool/troubleshooting/errors/api).

## Text must be valid JSON
***

**Error:** Text must be a valid JSON string. The error can also appear as **`(Something)` is not valid JSON**.

**Problem:** The payload set on a [**Trigger webhook**](/docs/no-code-tool/reference/steps/trigger-webhook) step isn't valid [JSON](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON).

**Fix:** Check the payload for syntax issues such as missing quotes, trailing commas, or unescaped characters. Paste it into an online JSON validator if you're unsure.

## Webhook returned an error
***

**Error:** Webhook server returned an error. Please check your JSON for errors.

**Problem:** axiom.ai sent the payload, but the receiving server responded with an error. The cause is on the receiving end, not in axiom.ai.

**Fix:** Check what the receiving service expects. Common causes include payload structure mismatches, missing authentication headers, or a service outage on the receiving end.

## No data received from webhook
***

**Error:** No data has been received from an external service and no test data entered for this step.

**Problem:** A [**Receive data from another app**](/docs/no-code-tool/reference/steps/receive-data-from-another-app) step ran without any data flowing in from the trigger, and no test data is set on the step.

**Fix:** When testing the automation manually, toggle `Test data` on and set a sample 2D array so the step has something to work with. When triggering from a webhook, check the upstream service is actually sending data in the format axiom.ai expects.