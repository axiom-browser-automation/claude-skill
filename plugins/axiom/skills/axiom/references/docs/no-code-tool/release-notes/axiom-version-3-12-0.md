---
title: Solve captchas, press keys smarter, fix iframe hangs, and more
date: 2022-09-22
version: 3.12
featuredimg: /version3-12.jpg
---

## New features
***
- Fixes to issues that caused pages to hang when certain types of iframe were present
- Integrated CAPTCHA solve step using a third party service
- Added new extension open / close toggle
- Press Key(s) step now can be set to automatically delay between key presses
- Updated design for error reporting and displayed messages

## Bug fixes
***

- Faster and less error-prone algorithm when writing huge volumes of data to Google Sheets
- Added all missing Puppeteer page functions to code box, including page.screenshot
- Fixes to click events on some sites
- Local storage loading now optional
