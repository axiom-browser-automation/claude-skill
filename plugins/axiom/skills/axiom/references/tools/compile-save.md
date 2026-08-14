# Compile, save, verify

## When to use
The end of every configure/build task: filled IR → compile → save → verify
run. The deliverable is a SAVED automation that has been seen to run.

## Call shapes
- **Compile**: the `axiom-mcp_compile_ir` MCP tool is the ONLY compiler.
  There is no compile HTTP endpoint — `/api/v4/compile` and `/api/v5/compile`
  do not exist (they return the login page).
- **Extract steps** compile from `columns`: one entry per scraped field,
  each an ABSOLUTE CSS selector:
  ```json
  "columns": [{"name": "<field>", "selector": "<absolute css>", "resultType": "textContent"}]
  ```
  The runtime scrapes each column across the page and zips by index — the
  alignment rule in scrape.md applies verbatim to the final automation, so
  only ship columns whose counts you verified equal.
- **maxResults**: the compiler defaults configured extracts to 100; set it
  explicitly only when the user named a count.
- **Save**: `POST <backend>/api/v4/automation` with your API key. Verify the
  response contains the task id; the document you save must be the COMPILED
  output, not the IR.
- **Verify**: trigger a run of the saved task and poll its run report. A
  first-run Failure is information, not defeat: read the report, fix the
  document, re-run. Success = the report says Success AND the output
  contains the expected rows.

## Failure modes
- Compiler column warnings are real: an extract that compiles with an empty
  selector produces an EMPTY scraper — a failed deliverable even if
  everything else passes.
- Runs fail legitimately at steps whose values only the user can supply —
  an expected failure at a user-owned empty field is not your bug; a
  failure at a field you filled is.

## Anti-patterns
- Inventing compile endpoints.
- Saving the IR instead of the compiled document.
- Declaring success without a verify run, or with a verify run that wrote
  the wrong shape/amount of data.
