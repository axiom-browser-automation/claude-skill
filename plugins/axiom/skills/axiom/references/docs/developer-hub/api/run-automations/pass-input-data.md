---
title: Pass input data
metaTitle: Pass input data into an axiom.ai automation via the API
description: Send dynamic input into a No-Code Tool automation when triggering it via the API, using the table-shaped data payload.
order: 3
---

The `/trigger` endpoint accepts an optional `data` field that's passed into the automation as if you'd uploaded a spreadsheet. This lets the same automation act on different inputs each time it runs, fetching different URLs, filling forms with different values, scraping different search terms, and so on.

## The data shape
***

The `data` field is an **array of tables**. Each table is an array of rows, and each row is an array of cell values. Three levels deep:

```
data
└── tables (array)
    └── rows (array)
        └── cells (array of strings)
```

A minimal payload with one table and one data row:

```json
"data": [
  [
    ["header1", "header2"],
    ["value1", "value2"]
  ]
]
```

The outermost array is the list of tables. Most automations only consume one table, but you can pass several if the automation reads from multiple sources.

## Why three levels deep
***

The shape mirrors how the No-Code Tool handles spreadsheets and CSVs internally. When you upload a Google Sheet to an automation in the **Builder**, you're handing it a table of rows and cells. The API just lets you skip the upload step, you pass the same shape directly.

This means you don't pass key-value objects like `{ "email": "x@y.com" }`. You pass rows of values, and the automation's steps reference them positionally (column 1, column 2, and so on).

## A complete example
***

An automation called `Scrape product page` that visits a list of URLs and writes results back to a Google Sheet:

```bash
curl -X POST https://lar.axiom.ai/api/v3/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "key": "your-api-key-here",
    "name": "Scrape product page",
    "data": [
      [
        ["url"],
        ["https://example.com/product/1"],
        ["https://example.com/product/2"],
        ["https://example.com/product/3"]
      ]
    ]
  }'
```

The automation receives a single table with one column (`url`) and three data rows, then loops over them.

## Multiple tables
***

If the automation reads from two distinct inputs, pass two tables in order:

```json
"data": [
  [
    ["search_term"],
    ["browser automation"],
    ["web scraping"]
  ],
  [
    ["target_url"],
    ["https://example.com/log"]
  ]
]
```

The first table is referenced as the first input in the automation, the second table as the second input.

## Header rows
***

Whether the automation expects a header row depends on how it was authored. Match what you'd upload as a Google Sheet for the same automation: if you'd include a header row in the sheet, include one here.

When in doubt, open the automation in the **Builder** and look at how the input source is configured. If it references columns by name, you need a header row. If it references them by position, you don't.

## Cell value rules
***

- **Use strings.** Numbers and booleans are coerced to strings on the server, so passing `"42"` and `42` produces the same result.
- **Use empty strings for missing values**, not `null`. A `null` cell breaks the row alignment.
- **Don't nest objects or arrays inside a cell.** Cells are flat scalar values. To pass structured data, flatten it across multiple columns.

## Common pitfalls
***

- **Forgetting the outer array.** Sending `[["a","b"],["c","d"]]` (two levels) instead of `[[["a","b"],["c","d"]]]` (three levels) is silently misinterpreted as multiple single-cell rows. Always count the brackets.
- **Mismatched row lengths.** Every row should have the same number of cells as the header row. Ragged rows cause unpredictable behaviour in steps that reference columns by index.
- **Trailing empty rows.** Some authors strip trailing empties; others count them. If your automation processes "every row," include only the rows you actually want processed.

## Related
***

- [Trigger an automation](/docs/developer-hub/api/run-automations/trigger-an-automation)
- [Check run status](/docs/developer-hub/api/run-automations/check-run-status)