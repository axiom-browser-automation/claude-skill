---
title: Trigger webhook step  
description: Post data to other web apps via webhook.
category: Webhook & API
icon: WidgetRestApi.svg
---

::HeroMedia{video="https://www.youtube.com/embed/Q7O7QzaDS3I?rel=0&amp;start=340&end=1050?rel=0"}
::

## What to Use the Trigger webhook step for
***

The Trigger webhook step sends a POST request containing data from your automation to an endpoint. The data is output in a 2D array.

You can use this step to:
- Send data to [Zapier](/guides/zapier-scraper) or [Make](/guides/post-data-to-make).
- Post data to any web app or API.

## How to configure the Trigger webhook step
***

### Payload

Enter the payload for the request as JSON. To send data from a step, click **'Insert Data'**, select the token of the step you wish to post data from, and the payload will be set up automatically. The data will be posted in a 2D array.

You can also construct your own payload using JSON and a combination of the tokens available for selection. See the example below:

```
{
  "request": "[google-sheet-data?all&1]",
  "customer": {
    "first_name": "[google-sheet-data?all&2]",
    "last_name": "[google-sheet-data?all&3]",
    "email": "[google-sheet-data?all&4]",
    "phone": "[google-sheet-data?all&5]",
    "company": {
      "name": "[google-sheet-data?all&6]",
      "job_title": "[google-sheet-data?all&7]",
      "industry": "[google-sheet-data?all&8]"
    },
  }
}
```

### Endpoint

Insert the URL of the **'Endpoint'** you wish to post to.

### API Key

You can access your [API key](/docs/developer-hub/api/keys) here, which is only available for Pro subscribers and higher.

### Keen to Learn More?

- Post data from [Zapier](/guides/zapier-scraper).
- Read about our [API](/docs/developer-hub/api).
