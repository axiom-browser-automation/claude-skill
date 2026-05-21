---
title: Split a name into columns step
description: Extract first names, middle names, and surnames from scraped data. Pass in a token from your selected data source to use.
category: Manipulate data
icon: WidgetFilterSplitName.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=1146&end=1211?rel=0"}
::

## What to use the Split a name into columns step for
***

This step takes any full name and splits it into its parts - title, first name, last name, and additional name. Useful when scraping LinkedIn Sales Navigator, and you want to send personalised messages. [See this LinkedIn template.](/guides/sales-navigator-connect)
You can use this step to:

- To extract first names to create personalised messages
- Extract names for CRM data
- Extract first and last name from LinkedIn
- Extract first names from data in a [Google Sheet](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step) or [CSV](/docs/no-code-tool/reference/steps/import-csv-file)- Extract names to personalise email campaigns

## How to configure the Split a name into columns step
***

### Data

Select the data containing the names.

### Column

Enter the column in the data where the names can be found. You can enter either a number (starting from 1) or a capital letter (starting from A).

Please ensure you only enter one value as only the first column provided will be used.

### Fields

Select the fields to split the name into.
### Output

The step outputs a preview of the split names.