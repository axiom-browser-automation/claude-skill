---
title: Data payload format
metaTitle: axiom.ai API data payload format reference
description: Schema reference for the 3-D data array passed in axiom.ai automation triggers.
order: 3
---

The canonical reference for the `data` field in `/trigger` requests. For tutorials, examples, and common patterns, see [Pass input data](/docs/developer-hub/api/run-automations/pass-input-data).

## Schema
***

```json
data: array<table>

table: array<row>

row: array<cell>

cell: string
```

Three levels deep, all arrays. The outermost array holds tables, each table holds rows, each row holds cells. Cells are strings.

## Minimal example
***

One table, one header row, one data row:

```json
"data": [
  [
    ["header1", "header2"],
    ["value1", "value2"]
  ]
]
```

## Validation rules
***

| Rule | Detail |
|---|---|
| `data` is optional | Omit it entirely if your automation doesn't expect input. |
| `data` is an array | The outermost element is always an array of tables, even if there's only one table. |
| Each table is an array of rows | A table with no rows (`[]`) is allowed but unusual, the automation receives an empty input. |
| Each row is an array of cells | Empty rows (`[]`) cause unpredictable behaviour, avoid them. |
| Cells are strings | Numbers and booleans are coerced to strings on the server. Pass `"42"` for clarity. |
| Cells must not be `null` | Use `""` for missing values. A `null` cell breaks the row. |
| Cells must not contain nested arrays or objects | Cells are flat scalars. To pass structured data, flatten across columns. |
| All rows in a table should have the same length | Ragged rows cause column-index references to misalign. |

## Multiple tables
***

If the automation reads from two distinct inputs, pass them in order:

```json
"data": [
  [
    ["url"],
    ["https://example.com/a"]
  ],
  [
    ["search_term"],
    ["browser automation"]
  ]
]
```

The first table is the first input, the second table is the second input. Order matters and is matched positionally to the automation's input sources.

## Header rows
***

Whether a header row is required depends on how the automation references columns:

| Automation references columns by | Header row required |
|---|---|
| Name (e.g. `[url]`, `[search_term]`) | Yes |
| Position (e.g. column 1, column 2) | No |

Match the convention the automation was authored with. If unsure, open it in the **Builder** and inspect how the input source step references columns.

## Encoding
***

- The `data` field is JSON, sent as part of the `application/json` request body.
- UTF-8 throughout. Non-ASCII characters in cell values are passed through unchanged.
- No size limit is documented per cell or per request, but very large payloads (multiple megabytes) may hit timeout or rate limit issues. For high-volume input, batch across multiple `/trigger` calls instead of one giant payload.

## Related
***

- [Pass input data](/docs/developer-hub/api/run-automations/pass-input-data) (tutorial with examples and common patterns)
- [Trigger an automation](/docs/developer-hub/api/run-automations/trigger-an-automation)