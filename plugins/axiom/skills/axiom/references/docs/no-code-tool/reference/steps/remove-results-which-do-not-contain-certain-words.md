---
title: Remove results which do not contain certain words step
description: Filter data by words they do not contain. Works with multiple sources including Google Sheets and Get data steps.
category: Manipulate data
icon: WidgetFilterWord.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=2255&end=2315?rel=0"}
::

## What to use the Remove results which do not contain certain words step for
***

Use this step to filter out rows from your data that do not contain particular words. Helpful if you wish to filter scraped data or import data from a [Google sheet.](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step)

You can use this step to:

- Remove rows from a Google Sheet
- Clean data from a CSV
- Filter scraped data

## How to configure the Remove results which do not contain certain words step
***

### Data

Select the data you wish to remove rows from.

### Words (comma separated)

Enter either a list of any number of words to check for, separated by commas, or data containing a list of words, one in each row.

Any row that does not contain the given word will be removed.

### Word matching mode

Select Any or All words.

### Match on word boundary

Check this to match only when the complete word appears in the data. Only the characters a-z A-Z 0-9 and _ are considered to be part of a word, all other characters are considered as being part of a word boundary.

### Columns (optional)

Specify a list of column numbers, each separated with a comma. Only rows that have matches within these columns will be removed.

For example, entering '1,2' here will check in columns 1 and 2 only.

### Output

A preview results returned by this step.