---
title: Wait
metaTitle: Pause an axiom.ai cloud browser session
description: Pause the session for a fixed duration on the pod, keeping the session alive while you wait for content to render or for a server-side process to finish.
order: 19
---

`axiom.wait(time)` pauses the session for `time` milliseconds. Use it between steps to let content render, to throttle a sequence of clicks, or to wait out a server-side process before the next action. The same step type as the No-Code Tool's [**Wait**](/docs/no-code-tool/reference/steps/wait).

## Signature
***

```javascript
await axiom.wait(time);
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `time` | number | Yes | Duration to wait, in milliseconds. |

## Example
***

```javascript
await axiom.click("button.export");
await axiom.wait(5000);                   // give the export job time to finish
await axiom.click("a.download-link");
```

## Why this and not a local `setTimeout`?
***

`axiom.wait()` pauses on the pod, not in your client process. The cloud session has an inactivity timer that closes the browser after a period without step traffic — a local `setTimeout` from your code wouldn't reset that timer, so a long local sleep would let the session idle out and auto-close while your client thought everything was fine.

For waits where there is no session open yet (rare — typically before `browserOpen()`), `axiom.wait()` falls back to a local sleep, so the same call is safe in both cases.

## Notes
***

- For "wait until X is on the page" rather than a fixed pause, the library doesn't expose a wait-for-selector step today. Loop on [`axiom.click()`](/docs/developer-hub/api/step-functions/click) with `optionalClick: true` and re-check, or fall back to a No-Code Tool automation with a proper wait step via [`/trigger`](/docs/developer-hub/api/run-automations/trigger-an-automation).
- Long waits still count against your runtime quota.

## Related
***

- [Click](/docs/developer-hub/api/step-functions/click)
- [Go to URL](/docs/developer-hub/api/step-functions/goto)
