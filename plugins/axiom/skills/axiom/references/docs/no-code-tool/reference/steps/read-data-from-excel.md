---
title: Read data from Excel sheet step
category: Read and write data
videoguide:
imagestep: /step-images/read-sheet.png
icon: WidgetReadGoogleSheet.svg
---

## What to use the Read data from an Excel sheet step for

---

Use this step to read data from an Excel spreadsheet, useful for loading data into your automations.

You can use this step for:

- Importing data to loop through.
- Reading in authentication credentials to log into websites.
- Reading in data to input into forms.

## How to configure the Read data from an Excel sheet step

---

### Spreadsheet

Enter a URL for the sheet that you wish to read from, or enter the name in the search box.

### Sheet name

The name of the sheet within the workspace to read data from.

### First cell

The first column and row that you wish to start your read operation. This should be formatted as "column:row", for example, "B10". The column must be capitalised.

### Last cell

The last column and row that you wish to finish your read operation on. This should be formatted as "column:row", for example, "B10". The column must be capitalised.

### Continue when empty

If enabled, the automation will proceed even if the sheet is empty, otherwise, this will cause an error.