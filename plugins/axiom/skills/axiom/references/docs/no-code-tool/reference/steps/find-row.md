---
title: Find Row step
description: 
category: Read and write data
summary: Search for a specific row in a Google Sheet. Use with Write data to Google Sheet to update specific cells without overwriting the entire sheet.
icon: WidgetFindRowGoogleSheet.svg
---

::HeroMedia{video="https://www.youtube.com/embed/Q7O7QzaDS3I?rel=0&amp;start=150&end=255?rel=0&amp;start=1503&end=1560?rel=0"}
::


## Purpose of the **Find Row** step
***

The Find Row step allows you to locate a specific row in a Google Sheet by searching for a value. Once the row is found, the row number is returned as a token, which can be used as data in your automation.

You can use the Find Row step to locate rows for tasks such as:

- Updating stock levels
- Editing scraped data
- Generating reports

## How to Configure the Find Row step
***

### Spreadsheet

Select a Google Sheet to search, or paste its URL.

### Sheet Name

Optionally, specify the sheet name where you want to perform the search.

### Values (comma-separated)

Enter a list of values, separated by commas, or provide data with one value per row. These values will be used to find the specific row in the sheet.

The remaining settings are optional and should be used when necessary.