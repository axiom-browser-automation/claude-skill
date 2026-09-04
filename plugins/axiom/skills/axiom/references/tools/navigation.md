# Navigation and page reality

## When to use
Every task. The automation runs inside Axiom's cloud browser — what renders
THERE is the only truth.

## Call shapes
MCP: `step` with `method` goto / click / enterText / getCurrentUrl and
positional `params` (same signatures as the api methods below), plus
`get_page_html` to read the resulting DOM. On AXIOM-6354 backends prefer
the REPORTING variants — `gotoV4600` / `clickV4600` / `enterTextV4600` —
whose results say what happened (`{ok, matched, currentUrl, title}`), so
you skip the read-back call after every action. Api fallback:
```js
await axiom.goto('https://example.com')          // navigate current session
await axiom.click('#accept-cookies', 'left')     // dismiss overlays, click
await axiom.scrapeMetadata(['title', 'url'])     // cheap "where am I" check
await axiom.datePicker('.cal .title', '.cal .next', 'December, 2026', '5')
// calendars: pages until the title matches — never a run of arrow clicks,
// which only work from the month the widget showed when you authored
```
Note: scrape() navigates by itself — a goto before a scrape of the same URL
is redundant (and a scrape straight after an unrelated goto can detach the
frame; just let scrape navigate).

## Failure modes
- **Consent walls** (most news/EU sites): probes that return "We use
  cookies"/"Accept"-type text are reading the OVERLAY. Two obligations,
  always both: (1) dismiss it in your session before trusting probes;
  (2) add a click step that dismisses it INSIDE the automation, before any
  extract — every fresh run starts with a clean profile and hits the wall
  again. An automation without that step scrapes the wall.
- Static fetches lie: content may be JS-rendered, geo/viewport-dependent,
  or gated. Never validate a selector with curl/wget/requests/fetch — only
  in the Axiom browser session.

## Anti-patterns
- Reading pages via the command line "just to check" — different renderer,
  invisible to the user, and selectors that match there routinely fail in
  the real browser.
- Navigating per probe: batch probes (scrape.md) so navigation happens once
  per call, not once per question.
