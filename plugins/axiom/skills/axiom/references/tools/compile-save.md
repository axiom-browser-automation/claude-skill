# Compile, save, verify

## When to use
The end of every configure/build task: filled IR → save → verify run. The
deliverable is a SAVED automation that has been seen to run.

## Call shapes (MCP tools — they act as the user)
- **`save_automation`** — pass your completed IR via `ir` (+ `name`): it is
  compiled AND saved in one call and returns the saved task id. Treat any
  `warnings` on the result as real defects: fix the IR and re-save with the
  SAME `id` (omitting `id` creates a new automation; passing it updates).
  `data` exists only for automation JSON that came from outside the session
  (e.g. supplied by the user); anything you author goes through `ir`.
- **`compile_ir`** — standalone validation of an IR without saving. Useful
  for checking column shapes mid-flight; never required before
  save_automation (which compiles internally).
- **`run_automation`** — THE way to verify: pass the saved `task_id`. It
  BLOCKS until the run finishes and returns status plus full error context
  inline — no triggering, no polling. Scraped data is never returned
  through tools; the automation delivers it to its configured destination
  (sheet, webhook, email) — a Success status is the verification.
- **`get_run_report`** — run history/detail: `task_id` (or `name`) alone
  for the newest report, `+ count` for the last N, `id` for one exact
  report.
- **`trigger_bot` / `get_run_status` / `stop_run`** — fire-and-forget
  cloud runs monitored separately. Not needed for normal verification.

## IR rules that decide success
- Extract steps compile from `columns`: one entry per scraped field, each
  an ABSOLUTE CSS selector:
  ```json
  "columns": [{"name": "<field>", "selector": "<absolute css>", "resultType": "textContent"}]
  ```
  Columns zip positionally — the alignment rule in scrape.md applies to the
  final automation verbatim: only ship columns whose match counts you
  verified equal.
- An extract whose selector/columns are empty compiles to an EMPTY scraper
  — a failed deliverable even when everything else passes.
- maxResults defaults to 100 for configured extracts; set it only when the
  user named a count.

## Widget choice (the wrong widget fails silently)
- Page CONTENT (articles, products, listings, tables, prices) → an extract
  step. NEVER `WidgetDriverScrapeMetadata` for content: it reads META TAGS
  only (title, og:/twitter:) and is right only when the user explicitly
  asked for page metadata.
- A LIST OF LINKS as the deliverable → `WidgetDriverScrapeLinks`
  (purpose-built for link output). But when each link must then be
  VISITED, extract the links into a named output instead and loop over it
  (goto each link → extract inside the loop body).
- Google Sheets: data FROM a sheet → `WidgetReadGoogleSheet` (usually with
  a per-row loop); results TO a sheet → extract, then
  `WidgetWriteGoogleSheet`. They are not interchangeable.
- Write-javascript steps (`evaluate`) only when the user explicitly asked
  for code/JS — never as a workaround for a selector you have not found.

## Failure modes
- `warnings` on save_automation are the compiler telling you a field will
  not work — never ship without resolving them.
- Runs fail legitimately at steps whose values only the user can supply —
  an expected failure at a user-owned empty field is not your bug; a
  failure at a field you filled is.

## Anti-patterns
- Copying compiled JSON between tools — save_automation takes the IR.
- Saving through raw HTTP when the MCP tools are available (the HTTP path
  is the documented fallback, not the default).
- Declaring success without a verify run, or with a verify run that wrote
  the wrong shape/amount of data.
