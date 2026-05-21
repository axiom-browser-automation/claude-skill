---
title: n8n
metaTitle: Trigger axiom.ai automations from n8n and vice versa
description: Trigger n8n workflows from axiom.ai and trigger axiom.ai automations from n8n using webhooks and HTTP requests.
order: 7
---

[n8n](https://n8n.io) is a workflow builder you can connect to axiom.ai in either direction. Trigger an n8n workflow when an axiom.ai automation runs, or trigger an automation from any n8n workflow.

## Trigger an n8n workflow from an axiom.ai automation
***

Use the [**Trigger webhook**](/docs/no-code-tool/reference/steps/trigger-webhook) step to start an n8n workflow when your automation runs. You'll need an n8n instance.

In n8n:

1. Create a new workflow.
2. Add a trigger node and select **Webhook**.
3. Set the webhook to listen for **POST** requests.
4. Copy the webhook URL n8n provides. Save it for the next section.
5. Optionally configure the webhook to accept specific data or parameters.
6. Build out the rest of your workflow with the nodes you need.

In axiom.ai:

1. Open your automation and add a **Trigger webhook** step.
2. Set `Endpoint` to the webhook URL you copied from n8n.
3. Set `Payload` to the data you want to send.

![The Trigger webhook step configured with an n8n endpoint and payload](/docs/no-code-tool/integrations/trigger-webhook-make-integration.png)

For n8n's side of the setup, see n8n's webhook documentation.

## Trigger an axiom.ai automation from an n8n workflow
***

> **Note:** A subscription that includes Webhooks is required to use the **Receive data from another app** step. See [pricing](/pricing) for details.

You'll need:

- **API key**. Find it on the [API key dashboard](/docs/developer-hub/api/keys).
- **Automation name**. The exact name of the automation you want to trigger.
- **Endpoint**. `https://lar.axiom.ai/api/v3/trigger`.

In n8n:

1. Add an **HTTP Request** node to your workflow.
2. Set `URL` to the axiom.ai endpoint above.
3. Set `Method` to **POST**.
4. Set `Content Type` to **JSON**.
5. Add the JSON request body. See [sending data with the API](/docs/developer-hub/api/requests) for the format.

In axiom.ai:

1. Add a [**Receive data from another app**](/docs/no-code-tool/reference/steps/receive-data-from-another-app) step at the start of your automation.

![An n8n HTTP Request node configured to call the axiom.ai trigger endpoint](/docs/no-code-tool/integrations/http-module-make-integration.png)

When the run is successful, axiom.ai returns a JSON response n8n can use in later nodes. See [understanding the API response](/docs/developer-hub/api#understanding-the-api-response) for the format.

## Test the integration
***

To test the axiom.ai → n8n direction, click **Run** in the axiom.ai extension, wait a few seconds, then check the execution history in n8n.

To test the n8n → axiom.ai direction, manually execute the workflow in n8n, wait a few seconds, then check [run reports](/docs/dashboard#run-reports) in axiom.ai.

## Future plans
***

axiom.ai doesn't yet have a dedicated n8n node, but webhooks and HTTP requests cover both directions reliably. We plan to expand the docs with more examples over time.