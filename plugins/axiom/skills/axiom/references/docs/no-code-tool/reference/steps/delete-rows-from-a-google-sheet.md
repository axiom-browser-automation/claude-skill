---
title: Delete rows from a Google Sheet step
description: Delete rows from a Google Sheet. Use with Find rows in Google Sheet to locate and remove specific cells or rows.
category: Read and write data
icon: WidgetDeleteRowsFromGoogleSheet.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=1940&end=2001?rel=0"}
::

## What to use the Delete rows from a Google Sheet step for
***

This step does what it says on the step: it deletes rows from a Google Sheet. But why would you want to do this?

We use it as part of a technique called batching. This involves looping through steps using a jump step. For example, we start by reading a single row from a Google Sheet; we execute automation using that row's data. Then, we delete the row before moving on to read a new row.

To learn more about batching [click here.](/docs/batching-bot-runs)
We also have templates [you can try.](/guides/web-scraping-in-batches)
## How to configure the Delete rows from a Google Sheet step
***

### Spreadsheet Url

Search in the box for a Google Sheet or just cut and paste a URL into the field.

### First row to delete

Enter the number of the first row to delete.

### Last row to delete
Enter the number of the last row to delete. Everything between the first and last rows will also be deleted.

### Sheet name

Axiom fetches sheet names for you to select or type in a valid sheet name into the input field.

If you liked this step you may also wish to checkout our [read](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step) and [write](/docs/no-code-tool/reference/steps/write-data-to-a-google-sheet-step) Google Sheet steps.
