---
title: Download files to your computer
metaTitle: Download files locally from any website with axiom.ai
description: Save files from any website to a local folder using the Download file, Download files, or Download file from URL steps.
order: 18
---

To save files to a local folder, use one of three steps: [**Download file**](/docs/no-code-tool/reference/steps/download-file-step), [**Download files**](/docs/no-code-tool/reference/steps/download-files), or [**Download file from URL**](/docs/no-code-tool/reference/steps/download-file-from-url). All three require running the automation in the [axiom.ai desktop app](/docs/install#installing-the-desktop-app-optional).

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=2988&end=3055"}
::

## Download files from the current page
***

Add a **Go to page** step that loads the page containing the file, then add **Download file** (single file) or **Download files** (multiple).

1. Click **Select** and choose the file element on the page.
2. Click **Click to select** and choose the destination folder, or enter a path.
3. Set `File name` to the name you want the saved file to have.

## Download files from multiple pages
***

To download a file from each page in a list, store the URLs in a Google Sheet and loop through them.

1. Add a [**Read data from a Google Sheet**](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step) step pointing at a sheet of page URLs.
2. Add a [**Loop through data**](/docs/no-code-tool/how-it-works/loop) step using the sheet data.
3. Inside the loop, add a **Go to page** step. Set the URL using **Insert data** to pick the column.
4. Add **Download file** or **Download files** as the next sub-step.
5. Click **Select** and choose the file element. Click **Click to select** for the folder. Set `File name`.

## Download a file from a URL
***

When you have direct file URLs (rather than pages that contain files), use the **Download file from URL** step.

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=2913&end=2984"}
::

1. Open the step finder and add **Download file from URL**.
2. Enter the file URL in `URL`.
3. Click **Click to select** and choose the destination folder.
4. Set `File name`.

::YouTubeDialog{url="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=2913&end=2984"}
::

## Download files from multiple URLs
***

To download files from a list of URLs:

1. Add a **Read data from a Google Sheet** step pointing at a sheet of file URLs.
2. Add a **Loop through data** step using the sheet data.
3. Inside the loop, add a **Download file from URL** step.
4. Set `URL` by clicking **Insert data** and selecting the URL column.
5. Click **Click to select** and choose the destination folder.
6. Set `File name`. axiom.ai appends a unique number when the name is reused.

## Download locally with the Google Drive step
***

The **Download a file to Google Drive** step can also save files locally when running in the desktop app. This is useful when you want a single step that works in both cloud and desktop modes.

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=2833&end=2915"}
::

1. Add a **Go to page** step that loads the page containing the file.
2. Open the step finder and add **Download a file to Google Drive**.
3. Click **Select** and choose the file element.
4. Set `Drive folder URL` to the destination folder in Google Drive.
5. Set `File name`.
6. Toggle `Local folder` on and set a local folder path.

> **Note:** The `Local folder` setting only takes effect when running the automation in the desktop app.

## Advanced settings
***

![The advanced settings panel for download steps](/docs/tutorials/files-advanced-settings.jpg)

### Overwrite existing file

Toggle `Overwrite existing file` on and tick the box to replace files with the same name instead of renaming the new download.

### Force download

Some files open in the browser instead of downloading. Toggle `Force download` on and tick the box to force them. If the issue persists, contact support.

### Download start wait time

Toggle `Download start wait time` on to set how long axiom.ai waits for the download to begin. The value is in hundredths of a second.

## Troubleshooting
***

If the file doesn't download, check that the file path is correct and the destination folder has write permission set for the local user.