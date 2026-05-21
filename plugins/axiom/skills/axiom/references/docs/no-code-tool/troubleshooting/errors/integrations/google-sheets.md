---
title: Google Sheets errors
metaTitle: Fix common Google Sheets integration errors in axiom.ai
description: Errors that can occur when reading from or writing to Google Sheets, including expired tokens, missing data, permission issues, and invalid ranges.
order: 1
---

The errors on this page are specific to the Google Sheets integration. For general background on the integration, see [Google Sheets](/docs/no-code-tool/integrations/google-sheets).

## Google access token has expired
***

**Error:** Your Google access token is invalid or has expired. Please connect your Google account to continue.

**Problem:** Google has revoked the token axiom.ai uses to act on your behalf, usually as a security precaution. This is controlled by Google, not axiom.ai.

**Fix:** [Reconnect your Google account](/docs/no-code-tool/integrations/google-sheets#connect-a-google-sheets-account) and re-run the automation.

## No data in Google Sheet
***

**Error:** No data read from spreadsheet, aborting run. Turn on `Continue when empty` in this step if you want the run to proceed.

**Problem:** The automation couldn't find any data in the Google Sheet referenced by the step. Most often this is because the sheet itself is empty, but it can also happen if the sheet name or cell range points at an empty area.

**Fix:** Confirm there's data in the sheet. If you genuinely want the automation to continue when the sheet is empty, enable `Continue when empty` on the [**Read data from a Google Sheet**](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step) step.

## No editor permission for Google Sheet
***

**Error:** You do not have editor permissions for this Google Sheet with the Google account connected to your axiom.ai account. You will not be able to write to it.

**Problem:** The Google account connected to axiom.ai has read-only access to the sheet, so write operations fail.

**Fix:** Check the share settings on the [Google Sheet](/docs/no-code-tool/integrations/google-sheets). If you don't have editor access, ask the sheet owner to grant it.

## Sheet not found
***

**Error:** The sheet cannot be found. Please verify the URL and the name are valid. The error can also appear as **Requested entity not found**.

**Problem:** The Google Sheet URL or sheet tab name set in the step doesn't match a sheet your connected Google account can see.

**Fix:** Check the spreadsheet URL and the sheet name set in the step. Confirm the sheet exists, hasn't been deleted, and is shared with the Google account connected to axiom.ai.

## First cell is not correctly formatted
***

**Error:** First cell value is not in the correct format. It should be capital letters followed by optional numbers. For example, `B10` starts from column B and row 10.

**Problem:** The value in `First cell` doesn't match Google Sheets' cell-reference format. This field appears in every spreadsheet step.

**Fix:** Set `First cell` to a valid cell reference, for example `A2` or `B10`.

## Invalid range
***

**Error:** Invalid range set in step. Please adjust the value in `Add to existing data` to a valid range.

**Problem:** The range entered under `Add to existing data` in the [**Write data to a Google Sheet**](/docs/no-code-tool/reference/steps/write-data-to-a-google-sheet-step) step isn't a valid Google Sheets range.

**Fix:** Set the range to a valid value such as `A2:B10` or a single cell like `A2`.

## Values must be strings
***

**Error:** Values must be strings. Found value `undefined` of type `undefined` on row 1.

**Problem:** axiom.ai writes string values to Google Sheets. A row in the data being written contains a value that isn't a string (often `undefined` from an upstream step that didn't produce data).

**Fix:** Trace the data variable feeding the write step back to its source. Confirm every cell contains a string. If some rows can be empty, use a [**Replace text**](/docs/no-code-tool/reference/steps/replace-text-step) step or a [**Write javascript**](/docs/no-code-tool/reference/steps/write-javascript) step to substitute an empty string for any `undefined` values before writing.

## Cannot delete all rows
***

**Error:** You can't delete all the rows on a Google Sheet. Please make sure your sheet contains either empty rows, or rows with data.

**Problem:** Google Sheets requires at least one row in every sheet, so deleting them all isn't allowed.

**Fix:** Adjust the [**Delete rows from a Google Sheet**](/docs/no-code-tool/reference/steps/delete-rows-from-a-google-sheet) step so at least one row remains. Either lower `Last row to delete`, or leave the header row in place.

## Google Sheets unavailable
***

**Error:** Unable to fetch data from the Google Sheet. Please try again shortly. If the issue persists, contact customer support.

**Problem:** axiom.ai couldn't reach Google Sheets. This is usually a temporary network issue or a Google Sheets outage.

**Fix:** Wait a few minutes and try again. If the error persists, [contact support](/customer-support).