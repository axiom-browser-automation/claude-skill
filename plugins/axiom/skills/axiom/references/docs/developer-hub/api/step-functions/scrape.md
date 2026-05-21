---
title: Scrape
metaTitle: Extract a list of records from a page in an axiom.ai cloud browser session
description: Smart-scrape a list of records from one or more pages, with optional pagination and a maximum-results cap, using axiom.scrape().
order: 15
---

`axiom.scrape(url, selector, pager, max_results, settings)` extracts a list of structured records from a page (or a sequence of pages, if you supply a pager). The same step type as the No-Code Tool's [**Get data from bot's current page**](/docs/no-code-tool/reference/steps/scrape), called from your code with selectors you choose at runtime.

## Signature
***

```javascript
const rows = await axiom.scrape(url, selector, pager, max_results, settings);
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | string \| string[] \| null | Yes | URL (or array of URLs) to scrape. Pass `null` to scrape the page currently loaded in the session. Multiple URLs are scraped in sequence. |
| `selector` | object | Yes | Selector definition for the records to extract. Use the No-Code Tool's selector tool (or a recorded selector from a previous run) to produce this. |
| `pager` | object \| null | Yes | Selector for the "next page" link. Pass `null` for single-page scraping. With a pager, the scraper paginates until `max_results` is hit or the pager stops resolving. |
| `max_results` | number \| null | Yes | Cap on the number of records returned. Must be a positive whole number (or `null` for unlimited). |
| `settings` | object | Yes | Behavioural tuning (output format, minimum wait, …). Pass `{}` for defaults. |

Returns a 2D array of records (rows × fields).

## Example
***

Scrape product cards from a category page, paginating until 100 results:

```javascript
const products = await axiom.scrape(
  null,                                  // stay on the current page
  { hierarchy: ".product-card" },        // record selector
  { hierarchy: "a.pagination-next" },    // pager selector
  100,                                   // max results
  {}                                     // default settings
);
```

## Notes
***

- The `selector` and `pager` shapes match the selector tokens emitted by the No-Code Tool's selector tool. If you're authoring by hand, capturing them once via the No-Code Tool and copy-pasting is the lowest-friction approach.
- For single-record extraction (page title, OG image, single field), use [`axiom.scrapeMetadata()`](/docs/developer-hub/api/step-functions/scrape-metadata) — it's faster and simpler.
- The scraper handles lazy-loaded content by waiting briefly after each pager click. Sites with slow infinite-scroll may need a higher `minWait` in `settings`.
- Multiple URLs in `url` are scraped sequentially and the results concatenated; failures on one URL fail the whole call.

## Related
***

- [Scrape metadata](/docs/developer-hub/api/step-functions/scrape-metadata)
- [Go to URL](/docs/developer-hub/api/step-functions/goto)
