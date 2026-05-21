---
title: Upload files from your computer
metaTitle: Upload local files to a web form with axiom.ai
description: Use the Upload a file step to upload files from your local computer to any web form, with optional support for loops.
video: https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=3384&end=3860
order: 20
---

To upload files from your local computer, use the [**Upload a file**](/docs/no-code-tool/reference/steps/upload-file) step. This step requires running the automation in the [axiom.ai desktop app](/docs/install#installing-the-desktop-app-optional). To upload from Google Drive in the cloud instead, see [upload files from Google Drive](/docs/tutorials/files/upload-cloud).

::HeroMedia
::

## Upload a single file
***

Add a **Go to page** step that loads the page with the upload field, then add **Upload a file** below it.

1. Open the step finder and add **Upload a file**.
2. Click `File input field` and select the file field on the page.
3. Set `File path`. Click **Insert data** to use a path from earlier steps, or click **Click to select** to pick a file manually.

::YouTubeDialog{url="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=3384&end=3860"}
::

## Upload multiple files to the same field
***

To upload several files to a single input field, store the file paths in a Google Sheet and loop through them.

1. Add a [**Read data from a Google Sheet**](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step) step pointing at a sheet of file paths.
2. Add a **Go to page** step that loads the page with the upload field.
3. Add a [**Loop through data**](/docs/no-code-tool/how-it-works/loop) step using the sheet data.
4. Inside the loop, add an **Upload a file** sub-step.
5. Click `File input field` and select the upload field on the page.
6. Click **Insert data** in `File path` and pick the column with the file paths.

## Upload files to multiple pages
***

To upload files to a series of pages that share the same template (for example, product pages in a CMS), loop through both URLs and file paths.

1. Add a Google Sheet with one row per page, containing the page URL and the file path.
2. Add a **Read data from a Google Sheet** step pointing at the sheet.
3. Add a **Loop through data** step using the sheet data.
4. Inside the loop, add a **Go to page** step. Click **Insert data** and pick the URL column.
5. Add an **Upload a file** sub-step.
6. Click `File input field` and select the upload field.
7. Click **Insert data** in `File path` and pick the file path column.

## Upload local files with the Google Drive step
***

The **Upload a file from Google Drive** step can also upload from a local folder when running in the desktop app. This is useful when you want a single step that works in both cloud and desktop modes.

1. Add a **Go to page** step that loads the page with the upload field.
2. Open the step finder and add [**Upload a file from Google Drive**](/docs/no-code-tool/reference/steps/upload-file-google-drive).
3. Click `File input field` and select the upload field.
4. Set `Google Drive file URL` to the file URL.
5. Toggle `Local folder` on and enter a local folder path.

::YouTubeDialog{url="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=3312&end=3860"}
::

> **Warning:** Don't use this configuration when running in the cloud. The `Local folder` setting only works in the desktop app.

## Troubleshooting
***

If the file doesn't upload, check that the filename and path are correct, the file is present at that location, and your local user has read access to the folder.

> **Note:** The **Upload a file** step only runs in the desktop app. To upload in the cloud, use the **Upload a file from Google Drive** step.