---
title: Runtime errors
metaTitle: Fix errors that occur during an axiom.ai automation run
description: Errors that occur while an automation is running, including missing elements, browser navigation issues, and runtime limits on long jobs.
order: 3
---

The errors on this page occur during an automation run.

## Selectors found no content
***

**Error:** Your chosen selectors have failed to find any content on the page. The error can also appear as **Could not find the requested element**, **Error in all rows of loop**, or **Error in all rows of loop, your chosen selectors have failed to find any content on the page**.

**Problem:** The element your step is configured to interact with isn't on the page. Common causes:

- The selector is inconsistent across pages.
- The automation is on the wrong page when the step runs.
- The page hasn't finished loading.
- The site is blocking the automation.

**Fix:** Confirm the element is on the page when you load it manually, and that the automation is on the correct page when the step runs. To handle slow-loading pages, increase the minimum wait time in the [step's configure scraper options](/docs/no-code-tool/how-it-works/browser-actions/scraping#configure-the-scraper-for-speed). If the site is blocking the automation, try the [desktop app](/docs/install#installing-the-desktop-app-optional) or [bypass bot detection](/docs/no-code-tool/reference/settings/chrome/bypass-bot-detection). If none of these resolve the issue, [contact support](/customer-support).

## Browser closed
***

**Problem:** The browser was closed while the automation was still running.

**Fix:** Don't close the browser during a run. If the browser closes on its own, [contact support](/customer-support).

## Execution context was destroyed, most likely because of a navigation
***

**Error:** Execution context was destroyed, most likely because of a navigation.

**Problem:** The browser navigated away from the page or tab the automation was working on.

**Fix:** Don't switch tabs while a run is in progress. If the automation needs to follow a link that opens in a new tab, handle the switch with the [**Switch browser tab**](/docs/no-code-tool/reference/steps/switch-browser-tab) step.

## Runtime errors on long automations
***

**Problem:** Larger automations can hit single-run runtime limits or concurrency limits.

**Fix:** Break large jobs into smaller batches. For example, split a 10,000-record scrape into ten runs of 1,000 records each. This reduces the chance of a single error costing you the whole job and makes restarts much faster. For runtime and concurrency limits per plan, see the [pricing page](/pricing).