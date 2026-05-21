---
title: Import CSV File step
description: Import data from a CSV. Pass to other steps via a token for use in your automation.
category: Read and write data
icon: WidgetImportCSV.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=2143&end=2195&rel=0"}
::

## What to use the Import CSV File step for
***

This step imports data from a CSV into your Axiom. You can then use the data in other automation steps, such as web actions like ['Enter text'](/docs/no-code-tool/reference/steps/enter-text) step. For example, import data from a CSV to upload via a web form.

You can use this step to:

- Import data for data entry
- Upload multiple CSVs to merge into single CSV for [export](/docs/no-code-tool/reference/steps/export-csv-file)- Import CSV data to upload into a CRM
- Import data to filter and clean

## How to configure the Import CSV File Step
***

### Import CSV

Select the CSV file to upload. Manually enter the file path or use 'Click to select.' You can also use 'Insert data' to pass a file name or path from another step as a variable. Combine a string and variable to create a file path if required. If you see corrupted characters, please ensure the file is encoded in UTF-8 format.

### Fist cell

Use the first and last cell settings to specify the data range you wish to import. Will use A1 if no value provided.

### Last cell

Will use ZZ if no value provided

### Output

You will see a preview of the imported CSV data.
