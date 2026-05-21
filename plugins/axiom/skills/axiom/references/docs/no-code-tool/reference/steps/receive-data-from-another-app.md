---
title: Receive data from another app
description: Use the 'receive data from another app' step to trigger your automation via our API and webhooks, an integration or a third-party service such as Postman, Power Automate, Google Apps Scripts and much more.
category: Webhook & API
icon: WidgetWebhookReceive.svg
---

::HeroMedia{video="https://www.youtube.com/embed/Q7O7QzaDS3I?rel=0&amp;start=340&end=1050?rel=0"}
::
*Please note: there may be design changes between the video and current design.*

## Introduction
***

The **receive data from another app** step allows you to receive data sent through our [API](/docs/developer-hub/api), an [integration](i/docs/no-code-tool/integrations), or a third-party service such as [Postman](/docs/developer-hub/api), [Power Automate](/guides/power-automate), [Google Apps Script](/guides/google-apps-script) and much more. This can trigger automations and allows data from your request to be used within your automation.

You can use this step to:

- [Trigger](/docs/developer-hub/api/requests) an automation via an API.
- Pass data to automations via a POST request.

This feature is limited to certain subscription levels, see [pricing](/pricing) for more details.

## Configuration
***

The options below allow you to configure this step to your workflows specific needs.

### API credentials
***

Click on an item to copy it to your clipboard. This provides essential information for your API requests.

### JSON payload example
***

An example payload that the automation is expecting when triggered from an external service. To perform a POST request, you'll need information from the [API credentials](#api-credentials) section. 

See our [API](/docs/developer-hub/api) documentation for more details on triggering your automation via webhook/API.

### Test data
***

To test your automation manually, or before your external trigger has been set up, use the **test data** option. Once enabled, this can be used to add mock data to your automation.

```
[["A1", "B1", "C1"], ["A2", "B2", "C2"]]
```

When you click **run** on your automation, this data will be used in place of data received via the API.

### Further reading
***

- Documentation: [API](/docs/developer-hub/api).
- Guides: [Postman](/docs/developer-hub/api), [Google Apps Script](/guides/google-apps-script), [Zapier](/guides/zapier-scraper), [Power Automate](/guides/power-automate) - [all guides](/guides?category=APIs+%26+Webhooks)