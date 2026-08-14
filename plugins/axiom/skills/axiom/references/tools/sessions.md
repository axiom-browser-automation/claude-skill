# Browser sessions

## When to use
One session per research phase. Open (or attach to) a session before any
page work; every probe and navigation rides the same session; close once
when research ends.

## Call shapes — MCP tools first
The session handle is a `cdp_link` string. When your runtime pre-opened a
session, the handle is saved for you (OpenHands sandboxes: /tmp/.axiom-session).
- `open_browser` () → returns a fresh `cdp_link` (only when none exists or
  the old one died)
- `step` / `get_page_html` (…, cdp_link) → all page work rides the handle
- `close_browser` (cdp_link) → once, when research ends

## Call shapes — @axiom_ai/api fallback
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
- **Sessions die when idle.** On backends with AXIOM-6354 (our dev slice)
  the requested `idleTimeoutMs` is honoured (clamp [5s, 600s]); older pods
  enforce ~60s regardless. Any gap beyond the window kills the session.
  Recovery: `SESSION_CLOSED` / HTTP 409 "No running browser session" →
  reopen and continue — with `browserOpen({reuse: '<old handle>'})` where
  supported, which returns the old session if it is actually still alive
  instead of stacking a new browser. Never treat it as fatal.
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
