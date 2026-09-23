# Browser-automation rules (shared core)

Actor-independent rules for building Axiom browser automations. This is the
single source of truth shared by the Claude builder skill and the OpenHands
setup agent — lessons learned here apply to BOTH. The copy baked into the
agent sandbox image is regenerated from this file by the maintainers' sync step.

Scope: how to research pages, choose selectors, and configure extractions.
Actor policy (credentials, deliverable format, interaction protocol) lives in
each consumer's own skill — not here.

## The runtime is the only truth

- The automation runs inside Axiom's runtime browser — a cloud pod, or the
  desktop app's local browser on the desktop host. Static HTML fetched any
  other way lies: content may be rendered by JavaScript, gated behind consent
  banners, or differ by viewport. Never trust a selector you have not seen
  match in an Axiom browser session.
- Probe before you commit: a `scrape(url, selector, null, 1–3, {})` call is a
  cheap selector test. Keep `max_results` small — larger probes waste the
  user's time and money.
- **Probe ALL columns in ONE call, zipped, with per-column result types.**
  The `selector` argument accepts an array of `{selector, resultType}`
  objects — the same shape the final extract step runs — and returns the
  columns zipped into rows:

      await axiom.scrape(url, [
          {selector: '.item .title > a', resultType: 'textContent'},
          {selector: '.item .title > a', resultType: 'href'},
          {selector: '.item .score',     resultType: 'textContent'},
      ], null, 3, {})

  One call verifies every selector, the href extraction, AND the row
  alignment (mismatched counts corrupt the zip) exactly as the automation
  will run it. Do NOT probe one selector at a time — every `scrape()` call
  re-navigates and re-scrolls the whole page, so N single-selector probes
  cost N page sweeps and N waits for nothing extra. Do NOT try to get URLs
  by passing `resultType` anywhere else (settings, a bare string): a plain
  string selector is always scraped as `textContent` — the array-of-objects
  shape above is the ONLY way to request `href`.
- **Candidate selectors are columns too.** Comparing `.title a` against
  `.row > a`? Put every candidate in the same call as its own column and
  read counts/samples side by side from one sweep. A candidate that matches
  nothing yields empty strings — it cannot fail the call (verified live).
  An entire research phase should rarely need more than 1-2 scrape calls.

## Cookie/consent overlays

Most news and EU sites open under a consent wall. If probes return consent
text ("We use cookies", "Accept", "Let me choose"), you are looking at the
overlay, not the page. Two obligations, always both:

1. Dismiss it in your research session first — only trust probes taken after.
2. Dismiss it in THE AUTOMATION: every fresh run starts with a clean profile
   and hits the wall again, so the automation needs a click step that
   dismisses the overlay BEFORE any extract step. An automation without one
   scrapes the wall.

## Sessions are scarce and watched

- Batch all probing into ONE script and ONE session per research phase. Each
  open/close cycles the live view a user may be watching, and re-opening is
  slow.
- Close the session when research ends — an open session holds one of the
  account's browser slots, and slots cost money.
- Error semantics: `CONTENT_NOT_FOUND` = the selector matched nothing (try
  another). `SESSION_CLOSED` = the session expired; reopen and continue.
  `CAPACITY` / "all bot allocations in use" = wait a few seconds and retry —
  do not spin.

## Writing selectors

- Prefer stable, semantic selectors (`article.product_pod h3 a`) over brittle
  positional ones (`div > div:nth-child(3) > a`).
- Prefer the smallest selector that uniquely identifies the target.
- Never bind to auto-generated or per-load-random ids/classes (long hex-ish
  tokens): they change on every visit and the automation breaks on replay.

## Dedicated steps over hand-built click sequences
What you did in the live session is not automatically what the automation
should do. A sequence of clicks reproduces the state the page was in when
you authored; a dedicated step reads the page at run time. Calendars are
the clearest case: N clicks on the next arrow encode the month the widget
happened to open on today and land on the wrong month any other day. Use
`datePicker` / `WidgetDatePicker` (month-title selector, next/previous
button selector, the month text exactly as the title shows it, the day) —
it pages until the title matches. Likewise a dropdown is `selectList` /
`WidgetDriverSelectList`, not an open-click plus an option-click. If the
IR you are about to save has the same click step repeated, ask what state
it is walking to and which step reaches that state directly.

## Multi-column extraction

- One column per scraped field. Each column's CSS must be scoped so every
  column matches the SAME number of elements — the runtime zips matches into
  rows in column order, and misaligned counts shear the rows.
- `resultType` defaults to text; use the link/href variant for URLs and the
  image/src variant for images.
- Verify after configuring: fetch the page and check each column's counts;
  after compiling/emitting, confirm the scraper's selector field actually
  carries your columns. An extract with no columns (or an empty selector)
  produces an EMPTY scraper — a failed deliverable, even if everything else
  works.

## Verification is a run, not a review

- The proof a configuration works is a real run in the Axiom runtime, not the
  code or JSON looking right.
- A run that fails at a step whose values the user still has to supply (their
  spreadsheet, folder, login) is an EXPECTED failure — everything before it
  succeeding is the verification. Do not spend repair effort on it.
- Skip live verification only when the automation has side effects that must
  not happen twice (orders, messages, account-locking logins) — and say so.

## Do no harm

- No destructive browser actions: no purchases, deletions, or submitting real
  forms unless the task explicitly requires it.
- Stay on the backend you were configured for; never call a different one.
