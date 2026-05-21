---
title: Close a session
metaTitle: Close an axiom.ai cloud browser session with axiom-api
description: Close the cloud browser session to free its resources and stop consuming runtime quota.
order: 25
---

`axiom.browserClose()` closes the session and frees its resources. Cloud sessions consume runtime quota for their entire open lifetime, so always close yours when you're done. The cleanest pattern is to wrap your work in a `try` / `finally` block so the close happens even if your code throws.

## Signature
***

```javascript
await axiom.browserClose(cdpLink);
```

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `cdpLink` | string | No | `axiom.cdpLink` cached from the last `browserOpen()` | Pod CDP endpoint to close. Pass an explicit value only when closing a session you opened from a different `AxiomApi` instance (rare). |

Returns the server's confirmation message string.

## The standard pattern
***

```javascript
import { AxiomApi } from 'axiom-api';

const axiom = new AxiomApi(process.env.AXIOM_API_KEY);
await axiom.browserOpen();
try {
  await axiom.goto("https://example.com");
  // ... your automation
} finally {
  await axiom.browserClose();
}
```

The `finally` block runs whether your code succeeds or throws, so the session always closes. Without it, an unhandled error leaks the session and you keep paying for runtime until the server reaps it.

## What happens when a session is closed
***

- The cloud Chromium instance shuts down immediately.
- Any in-flight network requests are cancelled.
- Cookies, localStorage, and any other in-memory state for the session is discarded.
- Runtime stops accruing against your [remaining runtime](/docs/developer-hub/api/usage-and-limits/remaining-runtime).
- Subsequent calls on the same `axiom` instance throw until you call `browserOpen()` again.

## Notes
***

- Idle sessions are eventually timed out by the server, but this is not immediate. A leaked session can rack up several minutes of runtime before being reaped.
- There's no way to reconnect to a closed session. If you need to resume work later, store the relevant state (URL, form values) in your own code and re-apply it on the next session.
- For long-running scripts that do many independent tasks, prefer opening and closing a session per task rather than holding one open for the whole duration. Fresh sessions are more reliable and easier to reason about.

## Related
***

- [Start a session](/docs/developer-hub/api/step-functions/start-a-session)
- [Check remaining runtime](/docs/developer-hub/api/usage-and-limits/remaining-runtime)