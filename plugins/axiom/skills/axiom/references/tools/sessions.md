# Browser sessions

## When to use
One session per research phase. Open (or attach to) a session before any
page work; every probe and navigation rides the same session; close once
when research ends.

## Call shapes
```js
const {AxiomApi} = await import('@axiom_ai/api')
const axiom = new AxiomApi(API_KEY)

// open — returns the CDP endpoint and stores it on axiom.cdpLink
const endpoint = await axiom.browserOpen({idleTimeoutMs: 600000})

// attach to an existing session (e.g. one your runtime pre-opened)
axiom.cdpLink = '<endpoint you saved earlier>'

// close (only when the whole research phase is done)
await axiom.browserClose()
```

## Failure modes
- **Sessions die fast when idle.** `idleTimeoutMs` is requested but the pod
  currently enforces its own ~60s idle window regardless. Any gap over a
  minute between calls can kill the session. Recovery: `SESSION_CLOSED` /
  HTTP 409 "No running browser session" → `browserOpen()` again and continue.
  Never treat it as fatal.
- **A failed step can close the session.** A selector that matches nothing
  can return HTTP 500 "Couldn't find content during run" AND tear the
  session down. The next call then gets `SESSION_CLOSED`. Recovery: reopen;
  and prefer probing patterns that cannot zero-match (see scrape.md).
- **Sessions bind to the credential that opened them.** Steps sent with a
  different credential are rejected. Never mix credentials across one
  session.

## Anti-patterns
- Open/close per probe: each cycle costs ~10-45s, cycles the live view a
  user may be watching, and burns a browser slot.
- A second concurrent session for the same user: it competes for the pod
  and confuses the user's watch view. One session.
- Assuming the session survives your thinking time — write batched scripts
  so gaps stay short, and always handle `SESSION_CLOSED` by reopening.
