---
title: Upload to drive, undo mistakes, upgrade steps, and more
version: 3.16
date: 2023-02-22
video: https://www.youtube.com/embed/iHl-0OBRwm8?rel=0&amp
---

::HeroMedia
::

We're excited to present axiom version 3.16. This is a bumper release containing a huge number of improvements, and we've additionally been working on updates to our debugger and onboarding which we're excited to bring to you soon. Read on to find out what's new in 3.16.

## Google Drive integration for file operations in the cloud
***

<img src="/releases/google-drive.jpg" alt="Use Axiom to automate file downloads and uploads to Google Drive">

Previously, file uploads and downloads were only possible using the desktop application.

New in this release is an integration with Google Drive that allows you to upload files in our cloud runner. You can now upload files directly from Google Drive to a website, and download files from a website directly to Google Drive, all without needing the desktop application. Your remote drive folder acts as a 1-1 replacement for your own local filesystem.

This feature allows file operations to be directly integrated with tools like Zapier and with our cloud scheduler. Have fun!

## Undo / redo
***

<img src="/releases/undo.jpg" alt="Made a mistake, undo a new feature in axiom.ai">

Undo and Redo is now available. Anything can be un/re-done in the builder, from text entry to adding new steps, up to a maximum of 50 interactions. Both buttons and handy keyboard shortcuts (ctrl+z and ctrl+y) are available.

## Javascript evaluation in conditional steps
***

Now, in addition to checking whether particular data is present or not, you can write a javascript expression in order to determine whether to trigger a conditional step.

This feature is available for both "Continue only if a condtion is met" and "Conditional jump" steps and will allow you to more precisely control flow within your automations.

## New data variable options
***

Data variables can now be entered into the First Cell and Last Cell parameters of all Google Sheet widgets, allowing you to dynamically specify these values.

In addition, the "Replace text" step now allows data variables to be used for both of its parameters, making it more flexible and useful.

## Improvements to date step
***

The existing "Current Date and Time" step has been overhauled, allowing you to specify custom dates - previously, javascript had to be used for this. In addition to using the current date and time, you can also generate a date for either the last day of the previous month, first day of the month, or a number of days in the past of future.

In addition, formatting options have been expanded for times, primarily to make them more compatible with file names.

<img src="/releases/day.jpg" alt="updated date step in axiom.ai">

## Upgrade your axiom steps
***

We often release updated versions of steps in our releases. By default, your existing axioms keep you on the previous version of a step to maintain backwards compatibility, and in order to upgrade and take advantage of new features you were required to delete and re-add the step - rather a pain.

Now we've provided a button which automatically upgrades your old step to the new format, and automatically remaps your existing data, which should make taking advantage of new features in your older automations much more convenient.

## Edit token selections
***

Now you can click on a token in order to edit your selection, rather than having to remove and re-add the token. Handy!

## Delete multiple steps at once
***

The move and copy selection steps have been updated to include a "Delete all" function, so now you can clear out multiple steps with a few clicks.

<img src="/releases/delete-all.jpg" alt="select and delete multiple steps in axiom.ai">

## New templates
***

Several more templates have been added to get you started quicker with your automations:

- How to automate downloading files
- How to automate taking screenshots
- How to automate Apollo.io lists
- How to automate data from LinkedIn to ClickUp
- How to scrape Album data from Spotify

## New API endpoint to retrieve google sheet data
***

We've added a new API endpoint that lets you see the current running status of a bot and automatically extracts any google sheet data that was written, returning it back to you. This should come in handy for those who want to integrate axiom into other automation systems and would prefer not to manually check google sheets.

## ... and many other improvements
***

- Extra caching has been added to axiom which will significantly improve performance over a session
- Trial time is no longer counted towards your monthly total after you subscribe
- Subscriptions now roll over at the date you subscribed rather than the beginning of the month
- More error message improvements to the "Press Key(s)" and "Webhook" steps
- Scheduler now notifies you by email when your runtime has run out
- HTML scraper now can return outer HTML if inner HTML returns no results
- Interaction points are now more clear when in template setup mode
- New subscriber email updated with some tips and tricks
- These release notes now appear in the Chrome extension ;)
- You can now delete your account from within axiom
- It's now possible to retrieve your API key without regenerating it
- Multiple updates to the documentation
- In fields where commas are inappropriate, like in filenames, the data variable system will no longer place commas when appending multiple values
- The Test Data parameter in the "Receive data from another app" step now consistently generates a preview
- Improvements to batching and retrying code, increasing the reliability of axioms that handle large amounts of data
- Fixes and improvements to the Webhook step in handling JSON and returning useful error messages
- Captcha solver now works in iframes
- Stopped axiom cloud from hanging when it's sent axioms with hundreds of steps
- Fixed issues with custom token replacement inside sub-axioms
