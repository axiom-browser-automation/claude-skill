---
title: Sneak peek at 4.0, open linked axioms, new steps, and more
version: "3.21"
date: 2023-08-03
featuredimg: /releases/axiom-3-2-1.png
video: https://www.youtube.com/embed/xU-Bn2NPl48?rel=0&amp
---

::HeroMedia
::

## Coming soon - Axiom 4.0
***

We've been hard at work on our next generation of the builder interface, which overhauls the UI and brings new abilities for nesting and combining steps that should streamline the logic of more complex axioms. We want to achieve this without increasing the complexity of the interface for new users.

This feature has been taking up most of our product development work time, but it's almost done! See below for a sneak peek...

We'd love to hear your feedback, so please get in touch if you have any queries.

We're also looking for early access testers to get an advance copy of this feature and let us know what we should change. Please email us at support@axiom.ai if you'd like to be part of this group!

## Open linked axioms from "Run another axiom" step
***

<img src="/releases/run-another.jpg" alt="Run another Axiom step link to Axiom added">

Now when you use the "Run another axiom" step, a link is available that will let you go directly to that axiom and edit it, rather than having to go back to the main axiom listing and find it from there.

## Disable page change monitoring
***

<img src="/releases/monitor.jpg" alt="Disable page change monitoring in Axiom settings">

On some (rare) sites, animated elements can cause Axiom to hang indefinitely.

Previously we have fixed this as issues were reported, but now there's a new option available in the "Settings" page that will disable all page monitoring. This skips the code that waits for a page to stop changing, which will fix indefinite hanging issues and may work to speed up some slow sites.

Please note that disabling this will likely require more manual waits to be added!

## New pricing options in the Ultimate tier
***

Two new tiers have been added above Ultimate to capture use cases which need a lot of runtime each month. Previously, one would have to sign up to multiple accounts or request a custom package, which was inconvenient.

You can now select from the Ultimate 500 and Ultimate 750 tier, which offer 500 and 750 hours of runtime respectively.

## Monthly option in Scheduler
***

<img src="/releases/settings-schedule.jpg" alt="monthly schedule option in Axiom">

You can now set schedules to trigger once a month.

## New step: "Count rows"
***

<img src="/releases/count-rows.jpg" alt="count rows in Axiom">

As its name suggests, this new step will return the number of rows in a piece of data.

## Minor fixes
***

- Fixed a permission issue that affected Google Sheets within Team Workspaces
- Updated branding on desktop app splash screen to reflect current visual design language
- Step finder now updates if the desktop app is started while it's open, removing the "download desktop app" errors
- Prevented registration from anonymous email providers to protect against spammers abusing the free tier
- A payment reminder is now shown in the extension for lapsed payments
- Fixed minor bug in conditional widget
- Fixed an issue where reading out of range of a google sheet was treated differently to reading an empty cell
- New helper article on running multiple bots, linked for users with concurrency
- Fixed display issues in some error messages caused by attempting to render the HTML of the element we tried to click
- Clearer error message when files not found
- Changes to runtime calculation to improve performance and fix some exploits that could extra runtime
- The auto-convert option in Google Drive if a file is uploaded by axiom
