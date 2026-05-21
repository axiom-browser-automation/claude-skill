---
title: Start a session
metaTitle: Open a cloud browser session with the axiom-api library
description: Install axiom-api, instantiate the AxiomApi class with your API key, then open a cloud browser session.
order: 2
---

`axiom.browserOpen()` opens a fresh, isolated cloud browser session. Once open, every other `axiom.*` method drives that session until you call [`axiom.browserClose()`](/docs/developer-hub/api/step-functions/close-a-session).

## Install
***

```bash
npm install axiom-api
```

## Instantiate the client
***

Pass your API key into the constructor. See [Authentication](/docs/developer-hub/api/authentication) to generate one.

```javascript
import { AxiomApi } from 'axiom-api';

const axiom = new AxiomApi(process.env.AXIOM_API_KEY);
```

> **Note:** never hard-code the key. Store it in an environment variable or a secrets manager.

## Open the session
***

```javascript
await axiom.browserOpen();
```

The call resolves once the cloud browser is ready to accept commands. There's nothing to capture from the return value, the `axiom` instance itself holds the session.

## Standard pattern
***

Wrap the work in a `try` / `finally` so the session always closes, even on errors:

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

## Notes
***

- Each `AxiomApi` instance manages one session at a time. To run multiple sessions in parallel, create multiple instances.
- `browserOpen()` returns the session's CDP endpoint string and caches it on the instance as `axiom.cdpLink`. Subsequent step methods automatically pass this through, so you don't need to capture it for normal use.
- Sessions consume runtime quota for the entire time they're open, not just when actively executing a command. Always close sessions when you're done. See [Close a session](/docs/developer-hub/api/step-functions/close-a-session).
- The number of concurrent sessions per API key is limited by your plan tier. See [Queue and concurrency](/docs/developer-hub/api/usage-and-limits/queue-and-concurrency).

## Related
***

- [Go to URL](/docs/developer-hub/api/step-functions/goto)
- [Close a session](/docs/developer-hub/api/step-functions/close-a-session)