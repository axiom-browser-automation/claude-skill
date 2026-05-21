---
title: New debugger, generate text with chatgpt, save to drive, and more
version: 3.19
date: 2023-05-17
video: https://www.youtube.com/embed/h9hQb4yLUfQ?rel=0&amp
---

::HeroMedia
::

## Debugger improvements
***

We've added a new sidebar to allow you to view and filter errors more easily.

You can also now view multiple warnings or errors simultaneously, and disable or re-enable "continue on error" without having to go via the settings page.

<img src="/releases/axiom-debug.jpg" alt="axiom.ai new debbuger view and filter in out chrome extension">

We plan to expand this feature in the coming months with breakpoints, inline data viewing and more - stay tuned!

## ChatGPT text generation
***

A new step has been added which allows you to generate text using ChatGPT.

This uses the ChatGPT API so will be much faster than the equivalent step of visiting the ChatGPT website and entering the text manually. Give it a try!

<img src="/releases/chatgpt-prompt-to-text.jpg" alt="axiom.ai submit a prompt and get back text in ChatGPT">

This step requires an OpenAI API key to use, and will not currently run on a schedule in cloud.

## Minimum interval lowered to one minute for local scheduling
***

Quite a few people have asked us in the past how they can trigger the desktop application from Zapier. While this isn't directly possible, it is possible to have Zapier write to a google sheet, and then process that sheet on a schedule with Axiom.

However, the minimum frequencies for scheduling (1 day for Pro, down to 15 mins for Ultimate) are really too slow for this use case. So now we've removed those limits - everyone with access to the scheduler (Pro or above) can now trigger local schedules every minute. Remember to keep an eye on your runtime if you are doing this!

The previous limits still apply to cloud schedule runs.

<img src="/releases/schedule-every-minute.jpg" alt="axiom.ai schedule evey minute on th desktop">

## Clear a range from a Google Sheet
***

As a companion to the "Delete rows from a Google Sheet" step, you can now clear rows from a Google Sheet too.

Instead of deleting the row, this simply wipes an area of the sheet. This is good for cases where you want to keep formatting or formulas intact!

<img src="/releases/clear-data.jpg" alt="axiom.ai clear data from Google sheet">

## Save a screenshot to Google Drive
***

Along with saving a screenshot to your desktop, you can now save a screenshot to Google Drive too.

<img src="/releases/screen-shot-drive.jpg" alt="axiom.ai save screen shot to google drive">

## New button to reboot VPS
***

For those on the ultimate tier who have access to a VPS, we have now provided a button to let you reboot your own server in case you run into issues.

## Minor fixes
***

- You can now pass a data variable into "Max Cycles" when jumping
- Custom file name field now available on the "Export CSV" step
- Download to Google Drive now returns a token for filename
- Desktop app "busy" check no longer triggers if the desktop app is not running
- Fix to incorrect display on the upcoming schedules page if a start date for a schedule wasn't set
- Big reduction on email send speed to nerf spam use cases
- Jump steps will now reset the result count once they've finished, which will let sub-loops work much better
- Small fixes to data output consistency across the board
- When supplying multiple columns for words to filter on, now all columns are used instead of just the first
- Fixed an issue with duplicated file extensions when "Force file download" was checked
- When the Iframe box is ticked, iframes are now processed in reverse order to reduce the chance of selector collisions
- Fixed an issue where the trial time would appear to still be subtracted from a user's runtime on the first day after subscription
- You can now use the node filesystem library (fs) in javascript steps (only when running in app)
- Improved template loading from [/guides/](/guides)
