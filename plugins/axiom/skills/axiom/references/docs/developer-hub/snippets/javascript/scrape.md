---
title: Scrape snippets
metaTitle: JavaScript snippets for scraping data from web pages
description: JavaScript snippets for scraping data in axiom.ai automations, including HTML tables, element attributes, page body, and meta tags.
order: 6
---

Scrape snippets pull data out of the current page when the no-code scrape steps don't fit the shape of the data.

## Scrape an HTML table
***

Pull header cells and row data from an HTML table, returning headers and rows as a single 2D array ready to write to a Google Sheet:

```js
const headers = Array.prototype.map.call(
    document.querySelectorAll('#org-insight__a11y-table tr'),
    function (tr) {
        return Array.prototype.map.call(tr.querySelectorAll('th'), function (th) {
            return th.textContent.trim();
        });
    }
);

const table = Array.prototype.map.call(
    document.querySelectorAll('#org-insight__a11y-table tr'),
    function (tr) {
        return Array.prototype.map.call(tr.querySelectorAll('td'), function (td) {
            return td.textContent.trim();
        });
    }
);

const data = headers.concat(table);

return data;
```

## Scrape element attributes
***

Pull a specific attribute from every element matching a selector. The example collects the `name` attribute from every `input` inside a div:

```js
let results = [];
let els = document.querySelectorAll('div:nth-child(1) > input');

for (const el of els) {
    results.push([el.getAttribute('name')]);
}

return results;
```

## Scrape the entire page body
***

Return the page's full HTML, useful for AI-driven extraction or downstream parsing:

```js
return [[document.querySelector('body').innerHTML]];
```

## Get meta tags from a page
***

Read meta tags (Open Graph and others) from the current page. Make sure the automation is on the page you want to scrape before this snippet runs.

Return a single meta attribute by name:

```js
let ogTitle = document.querySelector("meta[property='og:title']").getAttribute('content');
return ogTitle;
```

Return the name and content of every meta tag on the page:

```js
let metaTags = document.getElementsByTagName('meta');
let metaContent = [];

for (var i = 0; i < metaTags.length; i++) {
    metaContent.push([
        metaTags[i].getAttribute('name'),
        metaTags[i].getAttribute('content')
    ]);
}

return metaContent;
```

> **Note:** Some meta tags don't have a `name` attribute (Open Graph tags use `property` instead). The second snippet returns `null` for those, which is fine for most uses, but worth handling if your downstream step is strict about empty values.