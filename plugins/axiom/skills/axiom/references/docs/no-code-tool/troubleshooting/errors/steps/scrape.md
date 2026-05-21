---
title: Scrape step errors
metaTitle: Fix errors with axiom.ai web scraping steps
description: Errors that can occur with scrape steps including Get data from a URL and Get data from current page, with the cause and recommended fix.
order: 2
---

The errors on this page can occur with scrape steps such as **Get data from a URL** and **Get data from bot's current page**.

## Element not found on page
***

**Error:** Your chosen selectors have failed to find any content on page. The error can also appear as **Could not find the requested element** or **Error in all rows of loop, your chosen selectors have failed to find any content on page**.

**Problem:** The element selected in the step wasn't on the page when the automation ran. Common causes:

- The page didn't finish loading before the scrape fired.
- The page changed since the automation was set up, and the selector no longer matches.
- The automation is on a different page from the one the selector was built against.

**Fix:** Re-select the element using the selector tool inside the failing step. If the page is slow to load, increase the minimum wait time in the step's [configure scraper](/docs/no-code-tool/how-it-works/browser-actions/scraping#configure-the-scraper-for-speed) options.