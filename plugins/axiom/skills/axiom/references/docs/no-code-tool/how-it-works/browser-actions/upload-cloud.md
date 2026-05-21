---
title: Upload files from Google Drive
metaTitle: Upload files from Google Drive in cloud automations
description: Use the Upload a file from Google Drive step to upload files from Google Drive to any web form, including looped uploads.
video: https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=3312&end=3860
order: 19
---

To upload files from Google Drive in a cloud automation, use the [**Upload a file from Google Drive**](/docs/no-code-tool/reference/steps/upload-file-google-drive) step. This step requires running the automation in the cloud. To upload from local storage instead, see [upload files from your computer](/docs/tutorials/files/upload-local).

## Upload a single file
***

::HeroMedia
::

Add a **Go to page** step that loads the page with the upload field, then add **Upload a file from Google Drive** below it.

1. Open the step finder and add **Upload a file from Google Drive**.
2. Click `File input field` and select the file field on the page.
3. Set `Google Drive file URL` to the URL of the file in Google Drive.

::YouTubeDialog{url="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=3312&end=3860"}
::

## Upload multiple files to the same field
***

To upload several files to a single input field, store the file URLs in a Google Sheet and loop through them.

1. Add a [**Read data from a Google Sheet**](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step) step pointing at a sheet of file URLs.
2. Add a **Go to page** step that loads the page with the upload field.
3. Add a [**Loop through data**](/docs/no-code-tool/how-it-works/loop) step using the sheet data.
4. Inside the loop, add an **Upload a file from Google Drive** sub-step.
5. Click `File input field` and select the file field on the page.
6. Click **Insert data** in `Google Drive file URL` and pick the column with the file URLs.

## Upload files to multiple pages
***

To upload files to a series of pages that share the same template (for example, product pages in a CMS), loop through both URLs and file paths.

1. Add a Google Sheet with one row per page, containing the page URL and the file URL.
2. Add a **Read data from a Google Sheet** step pointing at the sheet.
3. Add a **Loop through data** step using the sheet data.
4. Inside the loop, add a **Go to page** step. Click **Insert data** and pick the URL column.
5. Add an **Upload a file from Google Drive** sub-step.
6. Click `File input field` and select the upload field.
7. Click **Insert data** in `Google Drive file URL` and pick the file URL column.

## Troubleshooting
***

If the file doesn't upload, check that the filename and Google Drive URL are correct, and that the file is present at the specified location.