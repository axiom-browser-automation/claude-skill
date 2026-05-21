---
title: New Make integration, better loops, smarter scraping, and fixes
date: 2022-07-19
version: 3.10
featuredimg: /version3-10.jpg
---

## New features
***

- Integromat / Make app integration added. Look out for the axiom app appearing on their platform soon!
- New “unconditional jump” step - allows you to create more complex loops without having to provide a condition that always passes
- Added a visual indication when data has been selected in scrapers and other interact steps
- Improvements to step renaming
- When your login expires, you can now re-enter your details right there rather than being sent back to the main login page
- Visual indication of result grouping added, extended scraper tool tutorial to encompass it
- Step number now available in error messages to help with debugging
- Added the run time for each bot run to the Reports page

## Bug fixes
***

- Google Sheet previews no longer default to a maximum of 52 columns
- Improved template setup flow by adding a confirmation when the setup is complete
- Scraper now better supports pages which load content in via AJAX
- Fixes to scrolling behaviour during scraping that should work better on some sites, such like Linkedin
- Fixed several issues with writing to Google Sheets when there were a very large (1000+) number of columns
- Select list behaviour is now smarter and is able to find elements in a larger variety of cases
