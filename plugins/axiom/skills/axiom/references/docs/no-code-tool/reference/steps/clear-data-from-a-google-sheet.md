---
title: Clear data from a Google Sheet step
description: Clear data from your Google Sheet. Use to remove rows, columns, or entire ranges before writing new data.
category: Read and write data
icon: WidgetClearGoogleSheet.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=1709&end=1749?rel=0"}
::


## What to use the Clear data from a Google Sheet step for
***

This step clears the contents of the selected cell range while preserving formatting in a Google sheet. Use this step to clear data stored in a Google Sheet rather than [deleting rows.](/docs/no-code-tool/reference/steps/delete-rows-from-a-google-sheet)
You can use this step to:

- Clear values from a Google Sheet

## How to configure the Clear data from a Google Sheet step
***

### Spreadsheet

Select a Google Sheet to clear, or paste its URL here . You can also use 'Insert Data' to pass spreadsheet URLs into this step.

### Sheet name

Leave blank to use the first sheet or select a sheet name.

### First cell

Enter a column and row number if you wish to start your clear operation from a particular cell in your Google Sheet. For example, 'B10' will
mean your bot will start clear data from the second column on the 10th row.

### Last Cell
Enter a column and row number combination if you wish to end the clear operation at a particular cell in your Google Sheet. For example, 'B100' will mean your bot will end clearing data at the 100th row in the second column.