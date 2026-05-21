---
title: Edit Row step
description: This step combines Find row and Write to Google Sheet. Use to locate a row and overwrite its data.
category: Read and write data
icon: TemplateEditRowGoogleSheet.svg
---

::HeroMedia{video="https://www.youtube.com/embed/Q7O7QzaDS3I?rel=0&amp;start=257&end=338?rel=0"}
::


## Purpose of the Edit Row step
***

The Edit Row step is a combination of two steps: **"Find Row"** and **"Write to Google Sheet"**. This combination allows you to locate a row based on a specific value and then overwrite its data. Both steps need to be configured correctly to function.

You can use the Edit Row step to update spreadsheet data, such as:

- Adjusting stock levels in a spreadsheet
- Updating cryptocurrency values
- Modifying report data

## How to Configure the 'Find Row' Step
***

### Spreadsheet

Select a Google Sheet to search, or paste its URL.

### Sheet Name

Optionally, specify the name of the sheet to search.

### Values (comma-separated)

Enter a list of values, separated by commas, or provide data containing values in separate rows. These values will be used to locate the specific row in the sheet.

The remaining settings are optional and can be used as needed.

### Select

Click 'Select' to choose the item you want to interact with.

## How to Configure the 'Write to Google Sheet' Step
***

### Spreadsheet

Select a Google Sheet to search, or paste its URL.

### Sheet Name

Optionally, specify the name of the sheet to write to.

### Data

Select the data that you want to write to the sheet.

### Write Options

If no value is set, the data will be written to column 'A' of the row found by the **Find Row** step. If you need to modify column, adjust the 'A' value as needed.
