---
title: Network snippets
metaTitle: Puppeteer snippets for intercepting and blocking network requests
description: Puppeteer snippets for axiom.ai automations to intercept, log, or block network requests by URL, file extension, or resource type.
order: 2
---

Network snippets intercept network requests during a run. Use them to block specific resources for speed, or to log and test requests during development.

## Block resources
***

Blocking unnecessary resources (images, fonts, ad libraries) speeds up runs by skipping content the automation doesn't need. Add this snippet at the start of a [**Write javascript**](/docs/no-code-tool/reference/steps/write-javascript) step that runs *before* the [**Go to page**](/docs/no-code-tool/reference/steps/go-to-page) step:

> **Warning:** Blocking resources can break pages, particularly if scripts are blocked. Test thoroughly after changing what's blocked.

```js
await page.setRequestInterception(true);

page.on('request', request => {
    // Skip if another listener already handled the request.
    if (request.isInterceptResolutionHandled()) return;

    // Block any request ending in '.png' or '.jpg'.
    if (request.url().endsWith('.png') || request.url().endsWith('.jpg')) {
        request.abort('failed', 0);
    } else {
        request.continue();
    }
});
```

The example above blocks images by file extension. The same pattern works for blocking by URL prefix:

```js
if (request.url().startsWith('https://google.com')) {
    request.abort('failed', 0);
}
```

Or by resource type:

```js
if (request.resourceType() === 'font') {
    request.abort('failed', 0);
}
```

Common resource types you might want to block:

- `font` blocks fonts.
- `image` blocks images.
- `media` blocks audio and video.
- `script` blocks JavaScript files. Not recommended on most pages, since it usually breaks them.

For the full list of resource types, see Mozilla's [ResourceType reference](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/ResourceType).

> **Tip:** For non-Puppeteer alternatives, see the [block resources](/docs/no-code-tool/reference/settings/run-options/block-resources) setting, which gives you a no-code way to block resources by domain or URL pattern.