---
title: Join different data sources based on matching columns step
description: Merge data from multiple sources into a single dataset by matching columns. Used to combine data from large, database-style sets.
category: Manipulate data
icon: WidgetFilterMerge.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=661&end=706&rel=0"}
::

## What to use the Join different data sources based on matching columns step for
***

Use this to join data gathered from different sources together. A shared column is used to combine the two. For example, use this to join product info from different e-commerce sites or to merge a Google Sheet with a CSV.

You can use this step to:

- Merge a [CSV](/docs/no-code-tool/reference/steps/import-csv-file) with a [spreadsheet](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step)- Join data from separate ecommerce store
- Merge [scraped data sets](/docs/no-code-tool/reference/steps/Get-data-from-website)
## How to configure the Join different data sources based on matching columns step
***

### Base data

Enter the base data to join with another.

### Base data column

Column of data to use as the basis of the join. For example, if you want to join based on company name, enter the column number or letter which contains the company name here.

### Join data

Enter the data you want to join with the base data.

### Column

The column of the **join** data to match against (the section above sets the base data's column). Leave it blank and the first column is used.

### Fuzzyness of the match

Ranges from 0 to 1. 0 means the match must be exact, 1 means anything will match. Start with a low value.

### Output

A preview results returned by this step.