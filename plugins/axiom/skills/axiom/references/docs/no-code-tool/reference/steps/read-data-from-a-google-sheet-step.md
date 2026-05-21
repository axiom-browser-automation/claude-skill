---
title: Read data from a Google Sheet step
description: Fetch data from a Google Sheet to use in your automation. Pass it into steps using tokens.
category: Read and write data
icon: WidgetReadGoogleSheet.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=310&end=366?rel=0"}
::

## What to use the Read data from a Google Sheet step for
***

The read from a Google sheet step is most commonly used to loop through a list of URLs for scraping content and passing data to web forms. It's a common starting point for most bots made with Axiom. When used in combination with the 'Loop' step, data can be passed without code from the sheet to any website or web application.

If you are looking to create a process with thousands of rows, we recommend a design pattern called ['batch scraping'.](/docs/batching-bot-runs) 😊 You will also find a batch [template](/guides/batching) here. If you just want to scrape links, use this ['scraper'.](/docs/no-code-tool/reference/steps/get-a-list-of-links-to-pages)

You can use this step to:

- Combine with the ['Get data from a URL'](/docs/no-code-tool/reference/steps/Get-data-from-website) step to loop through links and scrape pages
- Import data to output as a CSV
- Read data to input in a form via the ['Interact'](/docs/no-code-tool/reference/steps/interact-with-a-pages-interface) and ['Enter text'](/docs/no-code-tool/reference/steps/enter-text/ steps.

If you have an Excel sheet, don't worry. They can be imported into Google Sheets and converted with a couple of clicks.

## How to configure the Read data from a Google Sheet step
***

### Spreadsheet

Search in the box for a Google Sheet or just cut and paste a URL into the field.

### Sheet name

Optionally specify a sheet name to read from. Sheets are different tabs visible at the bottom of your Google doc; enter the name that appears on the tab to specify the sheet. Leaving this blank will use the first sheet in the document.

### First cell

Enter a column and row number if you wish to start your read operation from a particular cell in your Google Sheet. For example, 'B10' will
mean your bot will start reading data from the second column on the 10th row.

### Last Cell

Enter a column and row number combination if you wish to stop the read operation at a particular cell in your Google Sheet. For example, 'B100' will
mean your bot will stop reading data at the 100th row in the second column. 

### Continue when empty

If this is turned on, the automation will proceed even if the input sheet is empty otherwise will throw an error.
