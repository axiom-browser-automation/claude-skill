---
title: Import data with a webhook
metaTitle: Trigger automations and pass in data with a webhook
description: Externally trigger an axiom.ai automation and pass data into it with a webhook from Zapier, Make, or any other app.
order: 4
---

Use a webhook to trigger an axiom.ai automation from another app and pass data into it at the same time. For background on the API and how to find your API key, see the [API reference](/docs/developer-hub/api). For a worked example using Zapier forms, see the [Zapier forms guide](/guides/zapier-forms).

## Build and test the automation
***

Build the automation with dummy data first, then connect the webhook once it works. To start a new automation, click **New automation** then **Add first step** on the [Dashboard](/docs/no-code-tool/the-builder/dashboard).

## Add a Receive data from another app step
***

This step receives data from the webhook and returns a token (`[webhook-data-1]`) that later steps can use.

1. Open the step finder, search for **receive**, and add the step.
2. Toggle `Test data` on and add a 2D array of test data, for example `[["Row 1 colA", "Row 1 colB", "Row 1 colC"], ["Row 2 colA", "Row 2 colB", "Row 2 colC"]]`.

## Add a Go to page step
***

This step loads the web page you want to interact with.

1. Open the step finder, search for **go**, and add the step.
2. Click **Insert data** and select `[webhook-data-1]` to pass a URL in from the **Receive data from another app** step.

## Build out the rest of the automation
***

Add any further steps you need. Click **Insert data** and select the `[webhook-data-1]` token to pass values from the webhook into later steps.

## Test with dummy data
***

Run the automation to confirm it works end to end with the test data. Failed runs do not count against your usage.

## Set up the POST request
***

To trigger the automation from outside axiom.ai, send a `POST` request to `https://lar.axiom.ai/api/v3/trigger` with your API key, the automation's name, and the data as a 2D array.

```json
{
    "key": "1jf8SSbf73gfa",
    "name": "My Axiom",
    "data": [["A1", "B1", "C1"], ["A2", "B2", "C2"]]
}
```

## Go live
***

When the automation is working with dummy data, switch the **Receive data from another app** step to live data. For details on rate limits and authentication, see the [API reference](/docs/developer-hub/api).