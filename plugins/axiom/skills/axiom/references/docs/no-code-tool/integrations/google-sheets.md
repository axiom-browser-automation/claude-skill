---
title: Google Sheets
metaTitle: Read, write, and manage Google Sheets in an automation
description: Connect a Google Sheets account to axiom.ai to read, write, find, and delete rows from your sheets during an automation.
order: 2
---

Connect Google Sheets to axiom.ai to read data into your automations, write results back, find or update specific rows, and create new sheets on the fly.

## Connect a Google Sheets account
***

![The Google Sheets and API key screen in the axiom.ai dashboard with the Connect button highlighted](/docs/tutorials/google-sheets-connect-your-sheet.jpg)

1. Open axiom.ai.
2. Navigate to **Google Sheets and API key**.
3. In the **Google Sheets** section, click **Connect Google Sheets**.

### Disconnect Google Sheets

![The Google Sheets and API key screen with the Disconnect button highlighted](/docs/tutorials/google-sheets-axiom-disconect.jpg)

1. Open axiom.ai.
2. Navigate to **Google Sheets and API key**.
3. In the **Google Sheets** section, click **Disconnect Google Sheets**.

## Create a new Google Sheet
***

The [**Create a new Google Sheet**](/docs/no-code-tool/reference/steps/create-a-new-google-sheet) step creates a sheet in your Google Drive and returns the sheet URL as a variable. Use the variable in later steps to read or write to the new sheet.

## Read data from a Google Sheet
***

The [**Read data from a Google Sheet**](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step) step pulls data from a sheet into your automation.

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=311&end=366"}
::

Configuration options:

- `Spreadsheet`: start typing the sheet name to autocomplete, or paste in the URL. Can be set from a variable.
- `Sheet name`: pick a specific tab from the dropdown.
- `First cell`: when enabled, set the first cell to read from. For example, `A2` skips a header row.
- `Last cell`: when enabled, set the last cell to read up to. For example, `B10`.
- `Continue when empty`: when enabled, the automation continues if the sheet has no data instead of erroring.

::YouTubeDialog{url="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=311&end=366"}
::

The step outputs a variable containing the sheet data. Use it in a [**Loop through data**](/docs/no-code-tool/how-it-works/loop) step to iterate row by row, or [pass it](/docs/no-code-tool/the-builder/pass) to any other step that accepts data.

## Write data to a Google Sheet
***

The [**Write data to a Google Sheet**](/docs/no-code-tool/reference/steps/write-data-to-a-google-sheet-step) step writes data into a sheet from your automation.

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=2315&end=2378"}
::

Configuration options:

- `Spreadsheet`: start typing the sheet name to autocomplete, or paste in the URL. Toggle **Set sheet URL from data** to drive this from a variable.
- `Sheet name`: pick a specific tab from the dropdown.
- `Data`: the variable containing the data to write. Pick it from the dropdown.
- `Write options`: choose **Clear data before writing** to overwrite the sheet, or **Add to existing data** to append.
- `Write method`: defaults to **Raw**, which writes data as-is. **User entered** simulates typing into the cell, which is useful for adding formulas.

::YouTubeDialog{url="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=2315&end=2378"}
::

### Edit a specific row

You can use the **Write data to a Google Sheet** step to update a particular row instead of appending or overwriting:

- Set `Write options` to **Add to existing data** so existing rows aren't cleared.
- Set `First cell` to the cell you want to write from, for example `A2`. Combine with the **Find row in a Google Sheet** step to target dynamically.

## Find a row in a Google Sheet
***

The [**Find row in a Google Sheet**](/docs/no-code-tool/reference/steps/find-row-in-a-google-sheet) step looks up rows that match a set of values.

Configuration options:

- `Spreadsheet`: start typing the sheet name to autocomplete, or paste in the URL.
- `Sheet name`: pick a specific tab from the dropdown.
- `Values`: a comma-separated list of values to search for.
- `Exact match`: tick to match whole values rather than partial matches.
- `Value matching mode`: choose **Any** to match rows containing any value, or **All** to require all values.
- `Columns`: a comma-separated list of column numbers to search. For example, `1,2` searches columns A and B.

The step outputs a variable that includes the row number when a match is found.

## Delete rows from a Google Sheet
***

The [**Delete rows from a Google Sheet**](/docs/no-code-tool/reference/steps/delete-rows-from-a-google-sheet) step removes a contiguous range of rows.

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=1940&end=1998"}
::

Configuration options:

- `Spreadsheet`: start typing the sheet name to autocomplete, or paste in the URL.
- `Sheet name`: pick a specific tab from the dropdown.
- `First row to delete`: the row number to start from.
- `Last row to delete`: the row number to end at.

::YouTubeDialog{url="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=1940&end=1998"}
::

## Clear data from a Google Sheet
***

The [**Clear data from a Google Sheet**](/docs/no-code-tool/reference/steps/clear-data-from-a-google-sheet) step empties a range of cells without deleting the rows themselves.

Configuration options:

- `Spreadsheet`: start typing the sheet name to autocomplete, or paste in the URL.
- `Sheet name`: pick a specific tab from the dropdown.
- `First cell`: the start of the range to clear, for example `A3`.
- `Last cell`: the end of the range to clear, for example `B33`.

## Convert Excel to Google Sheets
***

axiom.ai's Google Sheets steps don't read native Microsoft Excel files. To use an Excel file, convert it first:

1. Upload the `.xls` or `.xlsx` file to a Google Drive folder.
2. Open the file in Google Sheets.
3. Click **File** > **Save as Google Sheets**.

For native Excel support, see the [Excel integration](/docs/no-code-tool/integrations/excel).

## Google token expiry
***

When you connect Google Sheets to axiom.ai, axiom.ai stores a token from Google instead of your password. Google sometimes expires these tokens with no notice.

This is controlled entirely by Google. The most common pattern we've seen is high-frequency reads and writes triggering the expiry. If your token expires often, consider running the automation less frequently.