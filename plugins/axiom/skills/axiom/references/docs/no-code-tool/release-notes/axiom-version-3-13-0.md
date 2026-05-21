---
title: Optional steps, screenshot tool, scraper upgrades
version: 3.13
date: 2022-10-15
video: https://www.youtube.com/embed/WiIhSol4DPM?rel=0&amp;
---

::HeroMedia
::

## Changes to Steps
***

### Optional click

We have added the ability to set clicks as optional. Instead of throwing an error, axiom will click the element if present, and continue if not.

<img src="/optional-click.png" alt="Instead of throwing an error, axiom will click the element if present, and continue if not.">

### Improved 'Split Name' step

Improved support for foreign and unicode characters in the split name step.

### Improved CAPTCHA step

Improved the CAPTCHA solver consistency and the number of CAPTCHAs supported.

### New step: 'Save a Screenshot'

We have added a new step to save a screenshot of the current page.

<img src="/screenshot.png" alt="Get you bot to take a screen shot of the browser.">

## Scheduling
***

Users can now schedule Axioms on the Desktop Runner application instead of on the Cloud Runner.

<img src="/desktop-runner.png" alt="Users can now schedule Axioms on the Desktop Runner application instead of on the Cloud Runner">

## Chrome Extension UI
***

Axiom builder can now be minimised and docked to the side of the browser.

<img src="/expand-collapse.gif" alt="Users can now schedule Axioms on the Desktop Runner application instead of on the Cloud Runner">

## Web scraper
***

We've made numerous scraper improvements to increase the number of pages we support and to improve general consistency and speed.

Most notably, Axiom will no longer scroll all the way to the bottom of the page before scraping, which allows us to scrape all data from pages that unload content when the screen
scrolls below a certain point.

Successfully scraped data is now also highlighted orange, so you can see what's being grabbed as you go.

## Minor bug fixes
***

- Remove words step now correctly removes no results when no words are given, instead of removing all
- Improved error messaging when attempting to access bad URLs
- Fixed issues where the UI would get stuck if the network connection to the backend was lost during saving
- Added rename operation to the javascript API
