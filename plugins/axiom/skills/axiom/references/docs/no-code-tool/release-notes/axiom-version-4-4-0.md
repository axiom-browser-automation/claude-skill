---
title: Live run status, step recommendations, keyboard shortcuts, and more
version: "4.4"
date: 2024-10-07
featuredimg: /releases/ax-43.png
video: https://www.youtube.com/embed/8pSPg2LuONU?rel=0&amp
---

::HeroMedia
::

## New run status overlay
***

For users with multiple running bots, or those that run via API or schedule, it can be difficult to keep track of what is running and what isn't.

To help with this, we have introduced a new sidebar button that shows a summary of all running bots, as well as the status of the last three completed runs. This is available in the builder and on the dashboard.

<img src="/releases/run-status-sidebar.jpg" alt="New autoamtion run status in sidebar">

## Enhanced step recommendations
***

Previously, Beginner Snippets were available to give a quick entry point for some common actions, but these always showed no matter the current status of the axiom.

We've altered this section so that it will now show 'Recommended' steps depending on the context of your automation. This should mean less time searching the step list!

<img src="/releases/recommended-steps.jpg" alt="Enhanced step recommendations when using step finder in axiom.ai">

## New keyboard shortcuts
***

Two new shortcuts have been added:

- When using the scraper, Ctrl-n will add a new column
- When in the builder, '+' will open the step finder

<img src="/releases/short-cut-new-column.jpg" alt="New keyboard short cut to add new column">

## Live system status available in sidebar
***

The current live system status is now displayed in the extension on the sidebar.

- Green: all is well
- Orange: degraded performance
- Red: system is down

## Inline JSON validation added
***

For steps that allow JSON input (currently "Trigger Webhook"), live JSON validation has been added.

Now if there's a syntax error in your JSON, you can see the issue before running your axiom, which should speed debugging.

<img src="/releases/validate-json.jpg" alt="New valitdate JSON in Trigger Webhook step">

## Refresh preview button added
***

Previews automatically refresh on certain events in the builder, but in some cases (for example, if data is manually altered in a Google Sheet) the preview would not refresh.

To cover these cases, a manual refresh button has been added to the preview header. Enjoy!

<img src="/releases/refresh-preview.jpg" alt="New refreash data previews">

## Local storage now available to save in cloud
***

Most of the time, sessions are possible to recreate using only a session cookie. However, a few sites also require a local storage value in order for a login session to be properly recreated.

This option has now been added. If cookie storage alone is not sufficient to recreate your session, you can try turning this on and see if it helps.

<img src="/releases/local-storage-to-cloud.jpg" alt="Send local storage to cloud on run">

## Minor fixes
***

- Notifications on run ending now accept multiple email addresses
- Fixed a bug caused by inner text selectors being too long and causing a hang
- Schedules no longer have to be re-enabled if runtime expires; they will automatically start working once the account is updated
- Bugfix on the number option in conditional check, which only evaluated 1 digit numbers correctly
- Added explicit Copy / Move item into step kebab menu to make the option more clear to users
- Improved description of the "First Cell" option in the "Write to a Google Sheet" step
- When writing to a Google Sheet the default option is now to append data instead of clear it
- Re-allowed changing the run time of a schedule if the schedule date is in the past
