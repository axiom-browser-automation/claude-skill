---
title: How to import data to use in your automation
metaTitle: Import data from Google Sheets, CSVs, and webhooks
description: Learn how to import data from Google Sheets, CSVs, and web apps like Zapier, Make, Retool, and Airtable.
order: 1
---

You can import data into axiom.ai for your browser automation through various methods, such as web scraping, reading data from Google Sheets or posting data via apps like Zapier, Make, or Airtable.

## Import using "Read data from a Google Sheet"
***

To import data from a Google Sheet, use the Step Finder to search for "Read" and add the step.

1. First, select a Google Sheet to read from.
2. Next, specify the sheet name to read from.
3. Lastly, if you wish to set a cell range, enter values in "First cell" and "Last cell".

Once set up, you will see a preview output of the first three rows, and a token will be available to pass that data into any other step. If you wish to loop through your data, [see here](/docs/no-code-tool/how-it-works/loop#loop-using-the-loop-through-data-step).

## Import using "Import CSV file"
***

To import data from a CSV, use the Step Finder to search for "CSV" and add the step.

1. First, select CSV file to upload.
2. Next, if you wish to set a cell range, enter values in "First cell" and "Last cell".

Once set up, you will see a preview output of the first three rows, and a token will be available to pass that data into any other step. This step only works with the desktop runner.

## Import data using "Get data from a URL"
***

To scrape data from a webpage, use the Step Finder to search for "Get data from a URL" and add the step.

1. First, set the URL to scrape.
2. Second, select the data to scrape.
3. Lastly, set the number of results to scrape.

Once set up, you will see a preview output of the first three rows, and a token will be available to pass that data into any other step. To learn more about scraping data, [click here](/guides/web-scraping).

## Import data from other web apps
***

To import data from other apps such as Zapier, Make, Retool, and Airtable, use the "Receive data from another app" feature and the axiom.ai API. Use the Step Finder to search for "Receive data" and add the step.

For examples and to learn more about passing data from other apps, [click here](/docs/no-code-tool/the-builder/pass).

If you need help or want to suggest an alternative way of importing data into axiom.ai, please [let support know](/customer-support).