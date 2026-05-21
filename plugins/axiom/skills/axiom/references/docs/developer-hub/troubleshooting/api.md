---
title: API errors
metaTitle: Fix common errors when using the axiom.ai API
description: Errors returned by the axiom.ai API when triggering automations, including authentication failures, missing fields, and incorrect data formats.
order: 2
---

The errors on this page are returned by the axiom.ai API when triggering automations. For background on the API, see the [API documentation](/docs/developer-hub/api).

## Missing API key
***

**Error:** Unable to authenticate, you must send an API key.

**Problem:** The request payload doesn't contain a `key` field.

**Fix:** Add `"key": "<API_KEY>"` to the payload. See [API requests](/docs/developer-hub/api/requests) for the full payload format.

## Invalid API key
***

**Error:** Unable to authenticate, please check your API key and try again.

**Problem:** The API key in the payload doesn't match a valid axiom.ai key. Common causes are an expired or regenerated key, or a copy-paste error.

**Fix:** Open the axiom.ai extension, navigate to the [API key dashboard](/docs/developer-hub/api/keys), and copy the current key into your request.

## Missing automation name
***

**Error:** Missing task name, you must send the name of the task that you wish to trigger.

**Problem:** The request payload doesn't contain a `name` field. The API needs the automation name to know which automation to trigger.

**Fix:** Add `"name": "<AUTOMATION_NAME>"` to the payload. See [API requests](/docs/developer-hub/api/requests) for the full payload format.

## Automation not found
***

**Error:** Task not found, please check the name and try again.

**Problem:** The `name` field in the payload doesn't match any automation in the connected account. The match is case-sensitive.

**Fix:** Open the axiom.ai extension and copy the automation name exactly as it appears in the dashboard, including capitalisation and spacing.

## Data format incorrect
***

**Error:** Data must be sent as an array of arrays.

**Problem:** The `data` field in the payload isn't formatted as a 2D array. The API expects every row to be its own array, even when there's only one row.

**Fix:** Wrap the payload data as an array of arrays, where each inner array is one row:

```json
{
  "data": [
    ["Row 1 - Column 1", "Row 1 - Column 2"],
    ["Row 2 - Column 1", "Row 2 - Column 2"]
  ]
}
```

For the full payload structure, see [API requests](/docs/developer-hub/api/requests).