---
title: Restart browser
metaTitle: Restart the cloud browser within an axiom.ai session
description: Restart the cloud browser within the current session to recover from a wedged state without losing the session itself, using axiom.restartBrowser().
order: 20
---

`axiom.restartBrowser()` restarts the cloud browser within the current session. Use it when the browser is wedged (an unrecoverable dialog, a hung page, leaked memory from a previous run) but you want to keep using the same session — and the same quota of concurrent slots — rather than `browserClose()`-ing and `browserOpen()`-ing.

## Signature
***

```javascript
await axiom.restartBrowser();
```

No parameters, no return value.

## Example
***

```javascript
try {
  await axiom.goto("https://example.com/heavy-page");
  await axiom.click(".main-action");
} catch (e) {
  // Browser may be stuck. Restart and retry once.
  await axiom.restartBrowser();
  await axiom.goto("https://example.com/heavy-page");
  await axiom.click(".main-action");
}
```

## What's preserved, what's lost
***

A restart spins up a fresh Chrome instance inside the same session:

- **Lost:** cookies, `localStorage`, open tabs, in-flight network requests, anything else held in browser memory.
- **Preserved:** the session itself — your `axiom` instance keeps the same `cdpLink`, you don't need to re-authenticate, and the session's runtime quota and concurrency slot are unchanged.

If you need to retain cookies across the restart, save what you need with [`axiom.scrape()`](/docs/developer-hub/api/step-functions/scrape) before calling `restartBrowser()`, and re-apply them on the new browser.

## Notes
***

- For most error-recovery flows, simply [`browserClose()`](/docs/developer-hub/api/step-functions/close-a-session) + [`browserOpen()`](/docs/developer-hub/api/step-functions/start-a-session) on a new instance is cleaner. Reach for `restartBrowser()` only when you want to avoid waiting in the session queue again.
- This step is rare in normal flows. Use it as a recovery primitive, not a routine reset.

## Related
***

- [Start a session](/docs/developer-hub/api/step-functions/start-a-session)
- [Close a session](/docs/developer-hub/api/step-functions/close-a-session)
