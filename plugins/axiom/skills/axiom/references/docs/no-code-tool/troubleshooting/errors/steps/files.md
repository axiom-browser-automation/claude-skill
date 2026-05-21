---
title: File step errors
metaTitle: Fix errors with axiom.ai file upload and download steps
description: Errors that can occur with file steps including Upload a file and Download file, with the cause and recommended fix for each.
order: 5
---

The errors on this page can occur with file upload and download steps.

## File to upload not found
***

**Error:** Could not find the file to upload. Please double check that a file exists at the given path.

**Problem:** The path set on an [**Upload a file**](/docs/no-code-tool/reference/steps/upload-file) step doesn't point at a file that exists when the automation runs.

**Fix:** Open the **Upload a file** step and click **Click to select** to browse for the file. Confirm the file is at that path on the machine running the automation. For desktop runs that's your local machine; for cloud runs you'll need a path the cloud runner can reach (typically a Google Drive file via the [**Upload a file from Google Drive**](/docs/no-code-tool/reference/steps/upload-file-google-drive) step instead).

## File download did not start
***

**Error:** File download did not start.

**Problem:** axiom.ai triggered the download but no file started downloading. The most common cause is a network issue or the site blocking the download.

**Fix:** Try the download manually in your browser to confirm it works at all. If it does, run the automation in the [desktop app](/docs/install#installing-the-desktop-app-optional) so the local browser handles the download instead of the cloud runner.

## Could not create folder
***

**Error:** Couldn't create folder. Try a different location or change write permissions.

**Problem:** A [**Download file**](/docs/no-code-tool/reference/steps/download-file-step) step couldn't create the destination folder. Either the parent folder doesn't exist, or the user running axiom.ai doesn't have write permission for the location.

**Fix:** Check that the parent folder exists. axiom.ai can only create one folder at a time, so a path like `/Downloads/scrapes/2025/january` fails if `2025` doesn't already exist. Confirm your user account has write permission for the destination.