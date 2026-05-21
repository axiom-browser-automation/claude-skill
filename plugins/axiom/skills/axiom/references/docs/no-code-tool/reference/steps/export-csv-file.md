---
title: Export to CSV step
description: Export any data from Axiom in the form of a CSV. Use to download structured results for use outside the automation.
category: Read and write data
icon: WidgetExportCSV.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=2113&end=2143"}
::

## What to use the Export to CSV step for
***

This step exports data from any step in your Axiom into a CSV file on your local machine. A helpful step when scraping leads to upload into your CRM or when you need to merge a series of CSVs into a single file. Please note that the CSV will not download if triggered if you are running your automation in the Cloud.

You can use this step to:

- Export scraped data into a CSV
- Use with ['Import CSV'](/docs/no-code-tool/reference/steps/import-csv-file) step to merge CSVs into a single file
- Turn a [Google Sheet](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step) into a CSV

## How to configure the Export to CSV step
***

### DATA

Select the data to convert into a CSV file by clicking 'Insert data' inside the step.

### Folder

Set a folder to export the file to, copy and paste a path to the folder or use the 'Click to select' button to find the folder. Click 'Insert data' if you wish to pass file path from a data source into this step.

### File name

Enter a name to save the file as. If the file already exists it will be renamed by the export process unless the overwrite option is used. You can also 'Insert data' and pass file name from a Google Sheet.

### Overwrite existing file

Toggle on to overwrite existing file rather than renaming the new file.