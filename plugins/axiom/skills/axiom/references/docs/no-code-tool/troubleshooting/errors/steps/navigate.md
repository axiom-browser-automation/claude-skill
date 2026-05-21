---
title: Navigate step errors
metaTitle: Fix errors with Go to page and Switch browser tab axiom.ai steps
description: Errors that can occur with navigate steps including Go to page and Switch browser tab, with the cause and recommended fix for each.
order: 3
---

The errors on this page can occur with navigate steps such as **Go to page** and **Switch browser tab**.

## Cannot navigate to blank URL
***

**Error:** Cannot navigate to blank URL.

**Problem:** A [**Go to page**](/docs/no-code-tool/reference/steps/go-to-page) step has an empty `URL` field.

**Fix:** Set `URL` on the step to a valid URL, or disable the step if it isn't needed.

## Cannot open this URL
***

**Error:** Could not open this URL.

**Problem:** The URL set in the **Go to page** step isn't valid or isn't reachable from axiom.ai's runner.

**Fix:** Open the URL manually in your browser to confirm it loads. Check for typos, expired links, or sites that block traffic from cloud runners.

## Tab does not exist
***

**Error:** `Switch browser tab`: You are attempting to switch to browser tab `{tab_number}` but only `{open_count}` browser tabs are open.

**Problem:** A [**Switch browser tab**](/docs/no-code-tool/reference/steps/switch-browser-tab) step is set to a tab number that doesn't exist when the step runs. For example, the step is set to switch to tab 3 but only 2 tabs are open.

**Fix:** Watch the automation run to see how many tabs are open at the moment the **Switch browser tab** step fires, then update `Tab position` on the step to match. If the tab count varies between runs, set the position to **Last opened tab** instead of a fixed number.