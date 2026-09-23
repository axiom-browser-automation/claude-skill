# scrape() — probing and extracting page data

## The research loop (backends that ship `scrapeProbe`)
1. `get_page_html` — read the current DOM, find candidate selectors.
2. `step` method **`scrapeProbe`** (params: `[selectors, sample?]`) — the
   purpose-built probe: CURRENT page, no navigation, no sweep, zero matches
   is a RESULT (`count: 0`), never an error. Returns per-column
   `{count, sample}` plus an **`aligned`** verdict (all non-zero counts
   equal). Candidates and hrefs all in one call:
   `[".title a", {"selector": ".title a", "resultType": "href"}, ".score"]`
3. ONE `step` method **`scrapeV4600`** (same params as scrape) as the final
   verification sweep: positional zip, rows ALWAYS full width, short
   columns pad with `''` — no silent narrowing, no phantom rows.

## When to use classic scrape()
Older backends only. VERIFICATION, not discovery. A scrape call
**navigates to the URL and sweeps (auto-scrolls) the whole page on every
call** — so the unit of efficiency is: as few calls as possible, each
answering as many questions as possible. Via MCP, `step` with
`method: "scrape"`; via @axiom_ai/api, `axiom.scrape(...)`.

## Call shapes
```js
// Multi-column, zipped — THE canonical probe AND how the final extract runs.
// resultType: 'textContent' (default) or 'href'. A bare STRING selector is
// always textContent; the array-of-objects shape is the ONLY way to get href.
const rows = await axiom.scrape('https://example.com/list', [
    {selector: '.item .title > a', resultType: 'textContent'},
    {selector: '.item .title > a', resultType: 'href'},
    {selector: '.item .price',     resultType: 'textContent'},
], null, 3, {})   // pager=null, max_results small for probes, settings {} NOT null

// Candidate comparison — candidates are columns too. One sweep, counts and
// samples side by side:
await axiom.scrape(url, [
    {selector: '.title a',  resultType: 'textContent'},   // candidate A
    {selector: '.row > a',  resultType: 'textContent'},   // candidate B
], null, 3, {})
```

## The alignment rule (the single most important fact)
The zip is **positional with NO padding**. Each column is collected
independently across the page and rows are formed by index. Therefore:

- Columns whose selectors match DIFFERENT counts **misalign silently**: if
  row 7 lacks a price, every price from row 8 on is attributed to the wrong
  row. No error is raised. (Verified live: 30 titles + 28 scores zip into 30
  rows with shifted values.)
- **Before trusting any multi-column result, verify counts match**: probe
  each column with a generous max and compare lengths. Counts equal → the
  zip is trustworthy. Counts differ → fix the selectors, not the data.
- Fields that are OPTIONAL per row (e.g. scores missing on some list
  entries) cannot be safely zipped by absolute selectors. Options, in order:
  scope all columns to a container/row-type that always carries every field;
  scrape the whole containing element as ONE text column and let the
  consumer split it; or drop the optional column.

## The href-container rule (verified live, silent failure)
A column with `resultType: 'href'` locks row-grouping to ITS container:
any column whose selector lives in a DIFFERENT container is silently
dropped from the rows (you asked for 4 columns, rows come back 2-wide —
no error). Text-only columns may span containers (subject to the
alignment rule); the moment an href column is present, every other column
must live in the SAME repeating container as it. On pages that split a
record across sibling elements (e.g. a title row and a details row), your
options: keep href + same-container columns only; take the other
container's fields in a SEPARATE text-only scrape and join the results;
or scrape the other container as one text blob column and split it
downstream. ALWAYS check the row width of a multi-column result equals
the number of columns you asked for.

## Failure modes
- Zero-match column in a multi-column call → that column returns empty
  strings; the call succeeds (safe for candidates).
- Zero-match SINGLE selector → HTTP 500 "Couldn't find content during run",
  and it can close the session (see sessions.md). Prefer multi-column
  probing with at least one known-good column.
- `settings` must be `{}`, never `null` (null crashes the pager resolution).
- max_results must be a positive whole number; keep it ≤3 for probes — the
  sweep stops early, saving the user's time.

## Anti-patterns
- One selector per call ("test title… now test URL…"): N candidates cost N
  full page sweeps and N waits. Batch them as columns.
- Passing resultType anywhere except inside the selector objects: it is
  silently ignored and you get text.
- Trusting a zip whose column counts you never compared.
