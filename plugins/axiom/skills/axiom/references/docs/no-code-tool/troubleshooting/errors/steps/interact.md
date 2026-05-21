---
title: Interact step errors
metaTitle: Fix errors with click, enter text, and press key axiom.ai steps
description: Errors that can occur with interact steps including click, enter text, and press key, with the cause and recommended fix for each.
order: 1
---

The errors on this page can occur with interact steps such as **Click element**, **Enter text**, and **Press key(s)**.

## Element not found on page
***

**Error:** Your chosen selectors have failed to find any content on page. The error can also appear as **Could not find the requested element**, **Error in all rows of loop, your chosen selectors have failed to find any content on page**, or **Node is either not clickable or not an HTMLElement on row 1**.

**Problem:** The element selected in the step wasn't on the page when the automation ran. Common causes:

- The page didn't finish loading before the step fired.
- The page changed since the automation was set up, and the selector no longer matches.
- The automation is on a different page from the one the selector was built against.

**Fix:** Re-select the element using the selector tool inside the failing step. If the page is slow to load, increase the minimum wait time in the step's configure scraper options.

## Text is not iterable
***

**Error:** Text is not iterable.

**Problem:** An [**Enter text**](/docs/no-code-tool/reference/steps/enter-text) or [**Press key(s)**](/docs/no-code-tool/reference/steps/press-keys) step has an empty `Text` field.

**Fix:** Set `Text` on the step to a value, or pass data in via **Insert data**.

## Character not recognised
***

**Error:** `(Something)` is not a character.

**Problem:** The text contains a character axiom.ai doesn't recognise as a single character. This often happens with copy-pasted content that includes hidden formatting or zero-width characters.

**Fix:** Look at the text in the failing step and replace any unusual characters. If the text was copy-pasted, retype it manually to strip any invisible metadata.

## Browser closed
***

**Error:** Browser closed. The error can also appear as **Automation could not continue as all open browser tabs were closed**.

**Problem:** The browser or all of its tabs were closed during the run.

**Fix:** Keep the browser open while the automation runs. To run unattended without this risk, run the automation in the cloud instead of on the desktop.