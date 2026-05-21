---
title: Axiom academy is live, smarter scraping, improved validation
date: 2022-05-05
version: 3.8
releasevideo: https://www.youtube.com/embed/av5nk8UqqV0
featuredimg: /v3-8.jpg
video: https://www.youtube.com/embed/av5nk8UqqV0?rel=0&amp;
---

::HeroMedia
::

# New features
***

- Improvements to scraper tool which should lead to fewer missing data errors, as well as better speed in many cases.
- New axiom.ai academy site, replacing old docs.
- Improvements to error messages and validation across the board.
- Added a “report error” button into the scraper.
- “Space” is now supported when providing key presses via data.
- Some puppeteer functions are now usable in javascript steps.

## Bug fixes
***

- If your runs are blocked by the concurrency limit, you can now stop all of your running bots in case something is stuck.
- Removed confusing column selection when adding a loop token.
- Several fixes to scraper preview behaviour.
- Fixed a bug in the multiple file downloader that meant only one file would be downloaded when a page change occurred.
- Fixed bug in “Login” step where the username was not entered under some conditions.
- Fixes for several cases where passing data into a custom selector did not work as expected.
- Fixed conditional widgets when criteria were provided by data from another step.
