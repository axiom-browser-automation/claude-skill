---
title: Read data from Airtable
description: Import data from Airtable into your automations.
category: Read and write data
icon: WidgetReadAirtable.svg
---


## What to use the Read data from Airtable step for
***


The read data from airtable step is used to loop through rows of data, such as lists of URLs, so you can scrape content or send data to web forms.

It is often the starting point for many bots built with Axiom. When combined with the loop step, it allows you to pass data from a table to a website or web app without writing code.

If you need to process thousands of rows, use a pattern called [batch scraping](/guides/batching). This helps you run tasks in smaller chunks. You can also use a batch template for this. If your goal is only to scrape links, use the [scraper](/docs/no-code-tool/reference/steps/get-a-list-of-links-to-pages) template instead.

You can use this step to:

- Combine with the ['Get data from a URL'](/docs/no-code-tool/reference/steps/Get-data-from-website) step to loop through links and scrape pages
- Import data to output as a CSV
- Read data to input in a form via the ['Interact'](/docs/no-code-tool/reference/steps/interact-with-a-pages-interface) and ['Enter text'](/docs/no-code-tool/reference/steps/enter-text) steps.

If you have an [Excel sheet](/docs/no-code-tool/reference/steps/read-data-from-excel), use the excel step.

## How to configure the Read data from Airtable step
***

### Base ID

Input your airtable base ID.

### Table ID or name

Input the table ID or name.