---
title: How to export data from axiom.ai
metaTitle: Export automation data to Google Sheets, CSV, and webhooks
description: Learn how to extract data from your automation into CSVs and Google Sheets, and even post to apps like Zapier, Retool, Airtable, and Make using our API and webhooks.
order: 2
---

You can export data from axiom.ai using various methods, such as writing data to a Google Sheet or posting data via apps like Zapier, Make, or Airtable.

## Export data using "Write data to a Google Sheet"
***

To extract data to a Google Sheet, use the Step Finder to search for "Write data" and add the step.

1. First, select a Google Sheet to write to.
2. Next, specify a sheet name to write to.
3. Lastly, select the data to write, click and select the variable to use.

If looping your automation, we recommend inserting the step inside the loop.

## Export using "Export to CSV"
***

To write data into a CSV file, use the Step Finder to search for "Export to" and add the step.

1. First, select "Export to CSV," click "Insert Data," and choose the variable to use.
2. Next, enter a name to save the file as.

The file will be saved in your downloads folder. Note that this step is only for the desktop runner.

## Export data using a webhook
***

Integrate with any site that supports webhooks by sending them whatever data you want using our "Trigger webhook" step. Use the Step Finder to search for "Webhook" and add the step.

1. Set your Endpoint.
2. Enter your payload, valid JSON only.

To see examples and learn more about webhooks [click here](/docs/no-code-tool/how-it-works/webhooks).