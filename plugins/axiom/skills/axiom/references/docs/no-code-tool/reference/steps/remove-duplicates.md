---
title: Remove duplicates step
description: Check and remove duplicate data from sources such as Google Sheets or CSV files. Use to clean and prepare data before use.
category: Manipulate data
icon: WidgetFilterRemoveDuplicates.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=366&end=395?rel=0"}
::

## What to use the Remove duplicates step for
***

Use this step to remove duplicates from the specified data. This can be limited to particular columns. This step can be used when importing data from Google Sheets or CSV files as well as scraping data.

You can use this step to:

- Filter [scraped data](/guides/web-scraping-looping-through-pages) for duplicates
- Clean up data stored in [CSV](/docs/no-code-tool/reference/steps/import-csv-file.html) files
- Remove duplicates from [Google Sheet](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step)
## How to configure the Remove Duplicates step
***

### Data

Select the data to deduplicate.

### Columns to check

Specify a list of column numbers, each separated with a comma. Only these columns will be checked for duplicates.

For example, entering 'A,B' here will check for duplicates in columns A and B only.

### Output

The step outputs a preview of the deduplicated data.