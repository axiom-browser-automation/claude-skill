---
title: Make
metaTitle: Trigger axiom.ai automations from Make and vice versa
description: Trigger Make scenarios from axiom.ai automations and trigger axiom.ai automations from Make using webhooks and HTTP requests.
order: 6
---

[Make](https://make.com) is a workflow builder you can connect to axiom.ai in either direction. Trigger a Make scenario when an axiom.ai automation runs, or trigger an automation from any Make scenario.

## Trigger a Make scenario from an axiom.ai automation
***

Use the [**Trigger webhook**](/docs/no-code-tool/reference/steps/trigger-webhook) step to start a Make scenario when your automation runs. You'll need a Make account.

In Make:

1. Click **Create new scenario**.
2. Add a trigger and search for **Webhooks**, then choose **Custom webhook**.
3. Click **Create a webhook**, enter a name, and click **Save**.
4. Copy the webhook URL Make gives you. It starts with `https://hook...`. Save it for the next section.
5. Optionally, edit the advanced settings to define a data structure.
6. Build out the rest of your scenario with the modules you need.

In axiom.ai:

1. Open your automation and add a **Trigger webhook** step.
2. Set `Endpoint` to the webhook URL you copied from Make.
3. Set `Payload` to the data you want to send.

![The Trigger webhook step configured with a Make endpoint and payload](/docs/no-code-tool/integrations/trigger-webhook-make-integration.png)

For Make's side of the setup, see Make's [receiving a webhook](https://www.integromat.com/en/help/receiving-a-webhook-from-a-web-service) docs.

## Trigger an axiom.ai automation from a Make scenario
***

> **Note:** This setup uses the axiom.ai webhook API. A subscription that includes Webhooks is required to use the **Receive data from another app** step. See [pricing](/pricing) for details.

> **Note:** We're aware of an issue with the official Make integration that can prevent new users from adding connections. Use the HTTP request setup below in the meantime.

You'll need:

- **API key**. Find it on the [API key dashboard](/docs/developer-hub/api/keys).
- **Automation name**. The exact name of the automation you want to trigger.
- **Endpoint**. `https://lar.axiom.ai/api/v3/trigger`.

In Make:

1. Add a new module to your scenario. Search for **HTTP** and add **Make a request**.
2. Set `URL` to the axiom.ai endpoint above.
3. Set `Method` to **POST**.
4. Set `Body type` to **Raw**.
5. Set `Content type` to **JSON (application/json)**.
6. Add the JSON body in `Request content`. See [sending data with the API](/docs/developer-hub/api/requests) for the format.

In axiom.ai:

1. Add a [**Receive data from another app**](/docs/no-code-tool/reference/steps/receive-data-from-another-app) step at the start of your automation.

![A Make HTTP request module configured to call the axiom.ai trigger endpoint](/docs/no-code-tool/integrations/http-module-make-integration.png)

When the run is successful, axiom.ai returns a JSON response Make can use in later modules. See [understanding the API response](/docs/developer-hub/api#understanding-the-api-response) for the format.

## Test the integration
***

To test the axiom.ai → Make direction, click **Run** in the axiom.ai extension, wait a few seconds, then check **History** in Make.

To test the Make → axiom.ai direction, click **Run once** in Make, wait a few seconds, then check [run reports](/docs/dashboard#run-reports) in axiom.ai.

## Future plans
***

We have an official Make integration but are aware of issues with new connections, likely related to the Integromat-to-Make migration. We hope to restore full integration support soon, which will make this setup simpler than the HTTP request workaround above.