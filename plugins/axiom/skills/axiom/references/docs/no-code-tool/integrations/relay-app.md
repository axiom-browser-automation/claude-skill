---
title: Relay.app
metaTitle: Connect axiom.ai to Relay.app workflows in either direction
description: Trigger Relay.app workflows from axiom.ai automations and trigger axiom.ai automations from Relay.app, with built-in field mapping support.
order: 9
---

[Relay.app](https://www.relay.app) is a workflow builder for AI agents that connects services like Zapier and Make. The axiom.ai integration works in either direction.

## Get started with Relay.app
***

Sign up at [Relay.app](https://www.relay.app) and complete their onboarding to learn the basics. Workflows are created from the Relay.app dashboard by clicking **+ New workflow**.

## Trigger a Relay.app workflow from an axiom.ai automation
***

In Relay.app:

1. Click **+ Add trigger** and select **Webhook is called** from the list.
2. Leave the HTTP method as **POST** (the default).
3. Copy the webhook URL Relay.app provides.

In axiom.ai:

1. Build out your automation as normal. When you're ready to fire the Relay.app workflow, add a [**Trigger webhook**](/docs/no-code-tool/reference/steps/trigger-webhook) step.
2. Set `Endpoint` to the Relay.app webhook URL.

Run the automation to test. The trigger may take a few seconds. Check the Relay.app dashboard to confirm the workflow ran.

## Trigger an axiom.ai automation from Relay.app
***

> **Note:** This integration is built and maintained by the Relay.app team. axiom.ai's support is limited to issues on our side. For axiom.ai-specific errors, see [common errors](/docs/no-code-tool/troubleshooting/errors).

In Relay.app, after adding a trigger, click **+ Add step**, search for **axiom.ai**, and select **Run automation**.

In axiom.ai, make sure the automation starts with a [**Receive data from another app**](/docs/no-code-tool/reference/steps/receive-data-from-another-app) step.

### Connect your axiom.ai account

In Relay.app, click **Connect** on the axiom.ai step. Enter your axiom.ai API key when prompted. To find your API key, see the [API key documentation](/docs/developer-hub/api/keys).

### Pick the automation to trigger

Enter the automation's name in `Automation name`. The value is case-sensitive and must match the name shown in the axiom.ai dashboard exactly.

### Pass data into the run

Use the **Fields to populate** section of the **Run automation** step in Relay.app to map data into the run. Mapped fields become available in the **Receive data from another app** step at the start of your axiom.ai automation.

## Wrapping up
***

Relay.app's catalog of integrations gives you a quick way to wire axiom.ai automations into a much larger ecosystem of apps and AI agents.