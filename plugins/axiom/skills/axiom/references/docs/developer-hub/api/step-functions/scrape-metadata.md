---
title: Scrape metadata
metaTitle: Extract page-level metadata in an axiom.ai cloud browser session
description: Extract page-level metadata (title, analytics IDs, schema.org structured data, or any meta-tag content) using axiom.scrapeMetadata().
order: 16
---

`axiom.scrapeMetadata(metadata)` extracts page-level metadata fields from the current page: the document title, common analytics IDs (Google Analytics, Facebook Pixel), schema.org structured data, and the content of arbitrary `<meta>` tags. Use it when you want a few specific page-level fields rather than a list of records.

## Signature
***

```javascript
const values = await axiom.scrapeMetadata(metadata);
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `metadata` | array | Yes | Array of `{ id, value, description }` items describing which fields to extract. See **Field types** below. |

Returns a 2D array of extracted values, in the same order as the input items.

## Field types
***

Each item in the `metadata` array has an `id` that selects an extractor. The built-in extractors are:

| `id` | Description |
|---|---|
| `general_metadata_title` | The page's `<title>`. |
| `analytics_and_tracking_google_analytics_id` | The first GA measurement ID found in inline scripts (`G-…`, `UA-…`). |
| `analytics_and_tracking_facebook_pixel_id` | The first Facebook Pixel ID found in inline scripts. |
| `schema.org_structured_data_<TYPE>` | A `<script type="application/ld+json">` block whose `@type` matches the `@type` named in the item's `description`. |
| any other `id` | The extractor falls back to `value` as a CSS selector, returning the matched element's `content` attribute, `href` attribute, or `outerHTML` (in that order of preference). |

## Example
***

Pull the page title, GA ID, and the contents of `<meta name="description">`:

```javascript
const [title, gaId, description] = await axiom.scrapeMetadata([
  { id: 'general_metadata_title' },
  { id: 'analytics_and_tracking_google_analytics_id' },
  { id: 'meta_description', value: 'meta[name="description"]' }
]);
```

Pull a specific schema.org block:

```javascript
const [product] = await axiom.scrapeMetadata([
  { id: 'schema.org_structured_data_Product', description: '@type: Product' }
]);
const parsed = JSON.parse(product[0]);
```

## Notes
***

- Each item returns a single value. For multi-row extraction, use [`axiom.scrape()`](/docs/developer-hub/api/step-functions/scrape) instead.
- Schema.org extraction parses the matched JSON-LD block and returns its serialised form. Parse it on your side.
- The fallback selector extractor reads `content` first (for `<meta>` tags), then `href` (for `<link>` tags), then `outerHTML`. This is convenient for the common cases but means the same selector can return different shapes depending on the element type.

## Related
***

- [Scrape](/docs/developer-hub/api/step-functions/scrape)
