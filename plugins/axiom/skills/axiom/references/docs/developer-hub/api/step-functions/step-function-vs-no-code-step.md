---
title: Step function vs No-Code step
metaTitle: Map No-Code Tool steps to axiom-api methods
description: Find the axiom-api method equivalent of every No-Code Tool step, useful when porting a visual automation to code.
order: 30
---

If you've built an automation in the No-Code Tool and want to drive the equivalent flow via the `axiom-api` library, this table maps each step to its closest method. Steps without a direct equivalent are flagged in the **Notes** column with the recommended workaround.

## Mapping table
***

| No-Code Tool step | axiom-api method | Notes |
|---|---|---|
| [**Go to page**](/docs/no-code-tool/reference/steps/goto) | [`axiom.goto(url, ...)`](/docs/developer-hub/api/step-functions/goto) | Direct equivalent. |
| [**Click element**](/docs/no-code-tool/reference/steps/click) | [`axiom.click(select, ...)`](/docs/developer-hub/api/step-functions/click) | Direct equivalent. Supports left/right click and "click if present" via the `optionalClick` flag. |
| [**Click multiple elements**](/docs/no-code-tool/reference/steps/click-multiple) | [`axiom.clickMultiple(select, ...)`](/docs/developer-hub/api/step-functions/click-multiple) | Direct equivalent. |
| [**Click engagement button**](/docs/no-code-tool/reference/steps/click-engagement-button) | [`axiom.clickEngagementButton(select, setValueToCheck)`](/docs/developer-hub/api/step-functions/click-engagement-button) | Direct equivalent for like/follow/subscribe-style toggles. |
| [**Enter text**](/docs/no-code-tool/reference/steps/enter-text) | [`axiom.enterText(selectTextField, text, ...)`](/docs/developer-hub/api/step-functions/enter-text) | Direct equivalent. Per-character delay, append-vs-replace, and a custom-line-break token are all supported. |
| [**Press key(s)**](/docs/no-code-tool/reference/steps/press-keys) | [`axiom.pressKeys(key, delimiter, delay)`](/docs/developer-hub/api/step-functions/press-keys) | Direct equivalent. |
| [**Rollover element**](/docs/no-code-tool/reference/steps/rollover) | [`axiom.hover(select)`](/docs/developer-hub/api/step-functions/hover) | Direct equivalent. |
| [**Mouse click & drag**](/docs/no-code-tool/reference/steps/mouse-drag) | [`axiom.clickAndDrag(start, end)`](/docs/developer-hub/api/step-functions/click-and-drag) | Direct equivalent. |
| [**Select list**](/docs/no-code-tool/reference/steps/select-list) | [`axiom.selectList(select, text)`](/docs/developer-hub/api/step-functions/select-list) | Direct equivalent for native `<select>` elements. |
| [**Date picker**](/docs/no-code-tool/reference/steps/date-picker) | [`axiom.datePicker(...)`](/docs/developer-hub/api/step-functions/date-picker) | Direct equivalent for calendar-widget date pickers. |
| [**Wait**](/docs/no-code-tool/reference/steps/wait) | [`axiom.wait(time)`](/docs/developer-hub/api/step-functions/wait) | Direct equivalent. Pauses on the pod so the session's inactivity timer stays reset. |
| [**Random wait**](/docs/no-code-tool/reference/steps/random-wait) | Compose in code | Compute the delay in your code, then call `axiom.wait(delay)`. |
| [**Switch browser tab**](/docs/no-code-tool/reference/steps/switch-tab) | [`axiom.switchBrowserTab(selectTab)`](/docs/developer-hub/api/step-functions/switch-browser-tab) | Direct equivalent. |
| [**Open a new tab**](/docs/no-code-tool/reference/steps/open-tab) | [`axiom.goto(url, false, true)`](/docs/developer-hub/api/step-functions/goto) | Pass `openInNewTab: true` (third arg) to `goto`. |
| [**Close browser tab**](/docs/no-code-tool/reference/steps/close-tab) | [`axiom.browserClose()`](/docs/developer-hub/api/step-functions/close-a-session) | Closes the whole session. There is no single-tab close today. |
| [**Get data from bot's current page**](/docs/no-code-tool/reference/steps/scrape) | [`axiom.scrape(url, selector, pager, max_results, settings)`](/docs/developer-hub/api/step-functions/scrape) | Direct equivalent. Pass `null` for `url` to scrape the page already loaded. |
| [**Get page metadata**](/docs/no-code-tool/reference/steps/scrape-metadata) | [`axiom.scrapeMetadata(metadata)`](/docs/developer-hub/api/step-functions/scrape-metadata) | Direct equivalent for title/description/OG-tag style fields. |
| [**Get a list of links to pages from bot's current page**](/docs/no-code-tool/reference/steps/scrape-links) | [`axiom.scrape(...)`](/docs/developer-hub/api/step-functions/scrape) | Pass a selector that targets the links you want. |
| [**Read clipboard**](/docs/no-code-tool/reference/steps/clipboard) | [`axiom.getClipboardContents()`](/docs/developer-hub/api/step-functions/get-clipboard-contents) | Direct equivalent. |
| [**Save screenshot locally**](/docs/no-code-tool/reference/steps/save-screenshot) | Not exposed | Fall back to a No-Code Tool automation triggered via [`/trigger`](/docs/developer-hub/api/run-automations/trigger-an-automation), or take the screenshot yourself over [CDP](/docs/developer-hub/api/cdp) (`Page.captureScreenshot`). |
| [**Save page HTML**](/docs/no-code-tool/reference/steps/save-html) | Not exposed | Use [`axiom.scrape()`](/docs/developer-hub/api/step-functions/scrape) for structured extraction, or drop down to [CDP](/docs/developer-hub/api/cdp) and read `DOM.getOuterHTML`. |
| [**Download file from URL**](/docs/no-code-tool/reference/steps/download-from-url) | Not exposed | Use a normal HTTP client in your code. |
| [**Write javascript**](/docs/no-code-tool/reference/steps/write-js) | Not exposed | Fall back to `/trigger` for arbitrary JS execution, or use [CDP](/docs/developer-hub/api/cdp) `Runtime.evaluate`. |
| [**Clear cookies**](/docs/no-code-tool/reference/steps/clear-cookies) | Not exposed | Open a fresh session for cookie isolation. The `doNotShareLocalstorage` flag on [`axiom.goto()`](/docs/developer-hub/api/step-functions/goto) handles the `localStorage` case for a single navigation. |
| [**Current Url**](/docs/no-code-tool/reference/steps/current-url) | Not exposed | Track URLs in your own code from each `axiom.goto()` call. |
| [**Solve Captcha**](/docs/no-code-tool/reference/steps/solve-captcha) | [`axiom.solveCaptcha(apiKey)`](/docs/developer-hub/api/step-functions/solve-captcha) | Direct equivalent. You supply the solver API key. |
| [**Generate text with ChatGPT / AI**](/docs/no-code-tool/reference/steps/chatgpt-generate) | [`axiom.integrateAI(aiOptions)`](/docs/developer-hub/api/step-functions/integrate-ai) | Direct equivalent for the inline-AI step. For arbitrary OpenAI/Anthropic usage, call those APIs from your code instead. |
| [**Try / Catch**](/docs/no-code-tool/reference/steps/try) | Native language construct | `try { ... } catch (e) { ... }` |
| [**If condition**](/docs/no-code-tool/reference/steps/if-condition) | Native language construct | Branch based on data returned by previous calls. |
| [**Loop through data**](/docs/no-code-tool/reference/steps/loop) | Native language construct | `for` loop in your code. |
| [**Read data from a Google Sheet**](/docs/no-code-tool/reference/steps/read-sheet) | Not exposed | Use the Google Sheets API directly from your code. |
| [**Write data to a Google Sheet**](/docs/no-code-tool/reference/steps/write-sheet) | Not exposed | Use the Google Sheets API directly from your code. |
| [**Send an email**](/docs/no-code-tool/reference/steps/send-email) | Not exposed | Use your language's email library or a service like SendGrid. |
| [**Trigger webhook**](/docs/no-code-tool/reference/steps/trigger-webhook) | Native HTTP call | `fetch(url, { method: "POST", body })` from your code. |

## When to fall back to /trigger
***

The step-trigger surface covers the common interaction and extraction steps directly. For everything else (screenshots, raw HTML readout, arbitrary JS, file downloads, sheet I/O, email), the recommended workaround is:

1. Build the missing capability into a No-Code Tool automation.
2. Trigger that automation via [`/trigger`](/docs/developer-hub/api/run-automations/trigger-an-automation) from your code.

This gives you the imperative control of `axiom-api` for the parts of the flow that need it, plus the full No-Code Tool step library for the parts that don't.

## When to port and when not to
***

Porting a No-Code Tool automation to `axiom-api` makes sense when:

- The flow needs to branch based on what each step returned.
- The flow needs to live alongside other code in your stack (in a backend service, a CI job, a scheduled function).
- You want version control, code review, and tests on your automation logic.

Stick with the No-Code Tool when:

- The flow is short and stable, with no runtime branching.
- The person maintaining it isn't a developer.
- Triggering it via `/trigger` from your code already covers your needs.

The two surfaces aren't either-or. A common pattern is keeping the visual automation as the source of truth for stable workflows, then using `axiom-api` for the dynamic, branchy parts of your application.
