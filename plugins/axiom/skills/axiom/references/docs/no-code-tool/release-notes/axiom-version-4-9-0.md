---
title: Axiom.ai v4.9
version: "4.9"
date: 2025-11-04
video: https://www.youtube.com/embed/uTqrBrNWH7Q?rel=0&amp;
---

::HeroMedia
::

## Team requests for Ultimate tier

***

Ultimate tier users can now request team access, allowing runtimes to be shared across selected accounts for improved collaboration, billing and resource management.

<img src="/releases/team-account.webp" alt="New to axiom.ai team accounts share runtime with your team.">

## Code editor improvements

***

The code editor has been significantly improved with support for templated snippets, a full-screen editing mode, and multiple quality-of-life enhancements to improve usability.

<img src="/releases/updated-code-step.webp" alt="New code snippet feature in the Javascript step, axiom.ai">

## Improvements to support flows

***

Added an improved support pane into the builder, with better instructions, shortcuts and the ability to export the currently active browser tab as an HTML file to share in case the site is behind a login.

<img src="/releases/new-support-flow.webp" alt="New support workflow in axiom.ai">

## Double click option for Click step

***

The Click step now supports a double-click option, expanding interaction capabilities for sites that require more advanced UI actions.

<img src="/releases/double-click.webp" alt="New double click feature in the Click element step, axiom.ai">


## New Row Numbers step

***

Introduced a new data step that allows row numbers to be automatically added to datasets, making it easier to reference, debug, and post-process extracted data.

<img src="/releases/row-numbers.webp" alt="New row number step in axiom.ai">


## Minor Fixes

* Fixed issue in Go To step where IP addresses were incorrectly prevented from loading
* Fixed empty error message when “Upload a file from Google Drive” element is not found
* Added refresh button to run reports
* Added ability to choose fixed columns for the Append Data step when input data has variable lengths
* Operating system is now shown in task reports for desktop runs
* Fixed issue where inserting data into the Integrate AI token field cleared all text
* Fixed issue where upgrading a step did not set the default value correctly, resulting in issues with the optional field toggles
* Fixed resource blocking not working when “open in new tab” is used
* Fixed override of website iframe classes breaking builder
* Added data refresh button to data preview
* Fixed unhandled exceptions hanging the desktop app and requiring a restart
* Fixed “Do not share local storage” option being ignored on Go To Page step
* Fixed UI issue on Proxy page when protocol is entered twice
* Fixed YouTube video embedding in the extension
* Fixed inaccuracy in the 1-minute runtime interval on the desktop scheduler


