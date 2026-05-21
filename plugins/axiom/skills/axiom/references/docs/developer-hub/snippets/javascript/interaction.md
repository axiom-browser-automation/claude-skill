---
title: Interaction snippets
metaTitle: JavaScript snippets for clicking, typing, and Shadow DOM
description: JavaScript snippets for interacting with page elements in axiom.ai automations, including clicks, dropdowns, text entry, Shadow DOM access, and event listeners.
order: 2
---

Interaction snippets drive elements on the current page. Most of these are covered by the [Interact step category](/docs/no-code-tool/reference/steps/#interact), but JavaScript is useful when the no-code steps can't reach what you need.

## Click a button by text
***

Find a button by its visible text, click it, wait 5 seconds, and repeat until the button is no longer on the page. Useful for "Load more" buttons that pull in more results each click:

```js
const delay = ms => new Promise(res => setTimeout(res, ms));

let element = document.evaluate(
    "//button[contains(., 'Load more')]",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE
).singleNodeValue;

while (element) {
    element.click();
    await delay(5000);
    element = document.evaluate(
        "//button[contains(., 'Load more')]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE
    ).singleNodeValue;
}
```

## Interact with a dropdown using arrow keys
***

For dropdowns the **Select option** step can't drive directly, simulate arrow-key presses instead. Open the dropdown first (with a click or by tabbing into it), then arrow down the right number of times:

```js
// First either 1) click to open the difficult select-list,
// or 2) use the Tab key to focus the element.
let marital = 'Single';

async function arrowDownTimes(times) {
    for (var i = 0; i < times; i++) {
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(250);
    }
}

switch (marital) {
    case 'Married':
        break;
    case 'Single':
        arrowDownTimes(1);
        break;
    case 'Divorced':
        arrowDownTimes(2);
        break;
}
```

> **Note:** This snippet uses the [Puppeteer API](/docs/no-code-tool/integrations/puppeteer), which means it only runs when `Run in app` is enabled on the **Write javascript** step.

## Enter text from a data token
***

Set the value of an input directly from a data token:

```js
document.querySelector('input[placeholder="Search the BBC"]').value = '[custom-data]';
```

> **Note:** Setting `.value` directly bypasses any input event listeners on the field. If the page relies on `input` or `change` events firing (most modern frameworks do), use the [**Enter text**](/docs/no-code-tool/reference/steps/enter-text) step or dispatch the events manually after setting the value.

## Reach into the Shadow DOM
***

Some pages attach a Shadow DOM tree to an element, hiding the internals from regular JavaScript and CSS. The selector tool can't reach inside Shadow DOM, but you can drill in manually:

```js
const shadowHost = document.querySelector('<SELECTOR>');

if (shadowHost) {
    const shadowRoot = shadowHost.shadowRoot;

    // Locate the element inside the shadow root that you want to interact with.
    const innerElm = shadowRoot.querySelector('<SELECTOR>');

    if (innerElm) {
        // Example: innerElm.click();
    }
}
```

## Add an event listener
***

Run code in response to events on the page. The example logs to the console every time an element is clicked:

```js
document.getElementById('custom-element').addEventListener('click', (e) => {
    console.log('Custom element clicked');
});
```

You can also dispatch your own custom events:

```js
document.addEventListener('my-custom-listener', (e) => {
    console.log('Custom event triggered:', e.detail);
});

// Trigger the listener manually.
document.dispatchEvent(new CustomEvent('my-custom-listener', { detail: { data: 'Test data' } }));

// Or trigger it from another listener.
document.getElementById('custom-element').addEventListener('click', (e) => {
    document.dispatchEvent(new CustomEvent('my-custom-listener', { detail: { data: 'Test data' } }));
});
```

> **Note:** Event listeners don't survive page navigations. If the automation moves to a new page, you'll need to set the listeners up again.