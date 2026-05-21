---
title: Last stop before 4.0, Scrape images, reorder columns, and more
version: "3.22"
date: 2023-10-30
featuredimg: /axiom-release-v3.22.png
releasevideo: 
---

## Axiom 4.0 - early access is ready
***

We've been hard at work on our next generation of the builder interface, which overhauls the UI and brings new abilities for nesting and combining steps that should streamline the logic of more complex axioms. We want to achieve this without increasing the complexity of the interface for new users.

This feature has been taking up most of our product development work time, but will finally be here in the next axiom release.

We're also looking for early access testers to get an advance copy of this feature and let us know what we should change. We'll be in touch with those of you who have already expressed an interest - thank you! Please email us at support@axiom.ai if you'd like to be part of this group.

## Image type added to selector tool
***

A new "Image" type has been added to the selector tool. When scraping, this will return the URL for the selected image, so no more scraping the HTML and using splits to get at them.

<img src="/releases/image-selector.jpg" alt="Axiom selector tool new image selector option">

## Google Drive steps now usable on desktop
***

Previously, the upload from Google Drive and download to Google Drive features were available only for cloud runs.

Now, they are available when running on the desktop application too.

<img src="/releases/google-drive-local.png" alt="Axiom upload files from desktop feature with Google Drive">

## Columns in the multi-select tool can now be re-ordered
***

If you want to change the order of columns in a scrape, you can now use the provided arrows to move the column rather than having to delete and re-select.

<img src="/releases/move-column.jpg" alt="Multi selector tool new feature for re-ordering columns">

## New notification option added for warnings
***

In previous verisons of axiom, notification options allowed you to either send notifcations on success or failure (or on both).

We've now added a third option that allows notifications to only be sent on warnings, which should be particularly useful when "Continue on error" is used but you still want to know if an error was encountered.

<img src="/releases/error.png" alt="new error option in notifications">

## Minor fixes
***

- Improved handling of errors when using the Chat GPT features of axiom
- You can no longer run a search on the dashboard before axioms have loaded and get incorrect results
- Retry logic improved when connection issues occur, which should eliminate almost all axiom run failures with 502 or 504 error codes
- New 30 min option for scheduling
- You can now pass variables to specify the first and last rows in Google Sheet steps
- Search added to "Run another axiom" step interface
- Fixed a rare issue where the scraper would skip to the next page before it had fully scraped the current one
- Added better error handling when all browser tabs are closed during an automation
- Ctrl + S shortcut added for saving an axiom
- Axioms can now be deleted from the builder, instead of just from the dashboard
- Improved recursion detection in "Run another axiom" to reduce false positive errors
- Icon and tier added to dashboard when subscribed
