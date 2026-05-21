---
title: Puppeteer
metaTitle: Use the Puppeteer API in axiom.ai automations
description: Call Puppeteer's page interaction methods from a Write javascript step to control the browser in ways the no-code steps can't.
order: 5
---

The axiom.ai desktop app is built on top of [Puppeteer](https://pptr.dev), Google's library for controlling Chrome over the DevTools Protocol. From the [**Write javascript**](/docs/no-code-tool/reference/steps/write-javascript) step, you can call a subset of Puppeteer's methods to do things the no-code steps can't.

## Enable Puppeteer in a script
***

Puppeteer methods only work when the script runs in the desktop app, not in the browser:

1. Add a **Write javascript** step.
2. Toggle `Run in app` on.
3. Tick the **Run in app** confirmation checkbox.

## Supported methods
***

axiom.ai supports the [Page Interactions](https://pptr.dev/guides/page-interactions) methods from Puppeteer. Other methods aren't available inside the **Write javascript** step.

## Examples
***

To use Puppeteer, you'll need a CSS selector for the element you want to interact with. Open Chrome DevTools (right-click the element and choose **Inspect**) to find one. Replace the selectors in the snippets below with your own.

### Click a button

```js
await page.click('#button');
```

### Fill a text input

```js
await page.locator('input.name').fill('Hello, world!');
```

### Find an element by its text

For more on text selectors, see the [Puppeteer text selector docs](https://pptr.dev/guides/page-interactions#text-selectors--p-text).

```js
const element = await page.waitForSelector('div ::-p-text(Submit)');
```

### Use a custom selector

```js
const mySelector = 'input';
const element = await page.waitForSelector(`form.${mySelector}`);
```