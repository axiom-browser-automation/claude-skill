---
title: Append or Merge data step
description: Join data from separate steps. Use to combine scraped data with data from a Google Sheet. Join single columns or entire datasets.
category: Manipulate data
icon: WidgetFilterAppend.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=1634&end=1690?rel=0"}
::

## What to use the Append or Merge data step for
***

This step merges data by appending one set to another, either horizontally to merge rows or vertically to add columns from the second set to the end of the first. It's commonly used to append a webpage's URL to ['scraped data.'](/docs/no-code-tool/reference/steps/Get-data-from-website)
You can use this step to:

- Combine Google Sheet data with scraped data
- Merge scraped data to a CSV
- Join two sets of scraped data

If you are looking to join different data sources based on matching columns try this [step.](/docs/no-code-tool/reference/steps/join-different-data-sources)
## How to configure the Append or Merge data step
***

If you need to combine more than two sets of data, use multiple Append data steps. 

### Data A
***

Select the Data to be appended to (For example, data from a [Google Sheet.](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step) When selecting data, click on the token to see a preview. Click 'Save and close' to select all or click 'Clear All' to choose columns individually. 

### Data B
***

Select the Data to be appended (For example, data from the [Get data step.](/docs/no-code-tool/reference/steps/get-data-from-website) When selecting data, click on the token to see a preview. Click 'Save and close' to select all or click 'Clear All' to choose columns individually. 

### Append mode
***

Choose to append the data horizontally or vertically. axiom.ai's data is formatted in a 2D array, so we commonly use the horizontal method which adds a column to the end of the array.

### Output
***
A preview of the appended data, so you can decide how you want to add it.