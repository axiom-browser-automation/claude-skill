---
title: Interaction snippets
metaTitle: Puppeteer snippets for scrolling and filtering elements
description: Puppeteer snippets for interacting with page elements in axiom.ai automations, including scrolling and filtering elements with the locator API.
order: 1
---

Interaction snippets drive elements on the current page using Puppeteer's locator API. Use these when the no-code [Interact steps](/docs/no-code-tool/reference/steps/#interact) don't cover the pattern you need.

## Scroll a container
***

Scroll a specific element by its CSS class. Useful for elements that scroll independently of the page itself, such as modal contents or chat panels:

```js
await page.locator('container').scroll({
    scrollLeft: 30,
    scrollTop: 10
});
```

## Filter elements by text
***

When several elements share the same selector, filter them by their content before interacting. The example clicks only the button whose inner text is `Add to basket`:

```js
await page.locator('button').filter(button => button.innerText === 'Add to basket').click();
```

This pattern is useful for e-commerce pages, search results, and any UI where multiple elements share a class but have different text.