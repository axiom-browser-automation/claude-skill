---
title: Download files to Google Drive
metaTitle: Download files to Google Drive in cloud automations
description: Use the Download a file to Google Drive step to save files from any webpage to a Google Drive folder, including looped downloads.
video: https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=2833&end=2915
order: 17
---

To save files to Google Drive from a cloud automation, use the [**Download a file to Google Drive**](/docs/no-code-tool/reference/steps/download-files-to-google-drive) step. It works without code and runs in the cloud or on the desktop.

## Download a single file
***

::HeroMedia
::

Add a **Go to page** step that loads the page containing the file, then add **Download a file to Google Drive** below it.

1. Open the step finder and add **Download a file to Google Drive**.
2. Set `Select file` by clicking **Select** and choosing the file element on the page.
3. Set `Drive folder URL` to the URL of the destination folder in Google Drive.
4. Set `File name` to the name you want the saved file to have.

::YouTubeDialog{url="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=2833&end=2915"}
::

## Download files from multiple pages
***

To download a file from each page in a list, store the URLs in a Google Sheet and loop through them. The pattern works best when every page uses the same template.

1. Add a [**Read data from a Google Sheet**](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step) step pointing at a sheet of page URLs.
2. Add a [**Loop through data**](/docs/no-code-tool/how-it-works/loop) step using the sheet data.
3. Inside the loop, add a **Go to page** step. Set the URL by clicking **Insert data** and choosing the URL column.
4. Add **Download a file to Google Drive** as the next sub-step.
5. Set `Select file` to the file element. Set `Drive folder URL` to the destination folder. Set `File name` as desired.

## Download multiple files from one page
***

To download several files from a single page, list their custom CSS selectors in a Google Sheet and loop through them.

1. Add a **Read data from a Google Sheet** step pointing at a sheet of one CSS selector per row.
2. Add a **Loop through data** step using the sheet data.
3. Inside the loop, add a **Go to page** step (only needed once per loop iteration if the URL changes; skip if it doesn't).
4. Add **Download a file to Google Drive** as a sub-step.
5. In `Select file`, click **Select**, choose **Custom**, tick **Set selector from data**, and pick the column with the CSS selectors.
6. Set `Drive folder URL` and `File name`. axiom.ai appends a unique number to each file when the name is reused.

## Advanced settings
***

![The advanced settings panel for the Download a file to Google Drive step](/docs/tutorials/files-advanced-settings.jpg)

### Force download

Some files open in the browser instead of downloading. Toggle `Force download` on and tick the box to force them. If the issue persists, contact support.

### Auto convert

Toggle `Auto convert` on and tick the box to convert the file into a Google Docs editor format on download.

### Download start wait time

Toggle `Download start wait time` on to set how long axiom.ai waits for the download to begin. The value is in hundredths of a second.

## Troubleshooting
***

If the file doesn't download, the most common cause is an incorrect Drive folder path. Double-check the folder URL is correct and you have write access.

## Download to a local folder instead
***

The **Download a file to Google Drive** step can also save files locally when running in the desktop app. See [download files locally](/docs/tutorials/files/download-local#download-locally-with-the-google-drive-step) for instructions.