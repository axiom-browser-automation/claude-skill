---
title: Automate a button click
metaTitle: Automate clicking a button on a webpage
description: Click buttons in a web app using the Click element step, the Press key(s) step, or custom JavaScript.
video: https://www.youtube.com/embed/PCYHijmR0jY?rel=0&start=1749&end=1838
order: 2
---

There are several ways to automate clicking a button in a web app. The primary method is the [**Click element**](/docs/no-code-tool/reference/steps/click-element) step, but you can also record key presses or fall back to JavaScript.

::HeroMedia
::

## Click with the Click element step
***

Open the step finder, search for **click**, and add the **Click element** step. Then choose the button using one of the methods below.

### Choose the button with the selector tool

Point and click on the page to select the button.

1. Click **Select** to open the [single selector tool](/docs/no-code-tool/the-builder/selector-tool/single).
2. Hover over the button and click to select it.
3. Click **Complete**.

### Select by text

If a button has unique text on the page (for example **Submit** or **Message**), select it by its text. This is the most reliable method when it's available.

1. Click **Select** to open the single selector tool.
2. Click **Custom**.
3. Tick **Use element text instead of HTML**.
4. Click **Complete**.

### Use a custom CSS selector

If you're comfortable with CSS, use a [custom selector](/docs/no-code-tool/the-builder/selector-tool/custom-css-selectors).

1. Click **Select** to open the single selector tool.
2. Click **Custom**.
3. Enter your CSS selector in the text box.
4. Click **Complete**.

## Click only if the button is present (optional click)
***

If a button doesn't always appear on the page, the **Click element** step throws an error and stops the run. To make the click optional, tick `Optional click`. The run continues regardless, and the button is clicked only when present.

## Click with the Press key(s) step
***

The [**Press key(s)**](/docs/no-code-tool/reference/steps/press-keys) step records and replays keystrokes. For example, record **Tab** to move focus to a button and **Return** to click it. See the [keyboard shortcut examples](/guides/keyboard-short-cuts#examples-of-keyboard-workarounds).

## Click with JavaScript
***

If you're comfortable with JavaScript, the [**Write javascript**](/docs/tutorials/javascript) step can click elements that the no-code steps can't. Use this as a last resort.

### Click every element containing some text

Useful when you want to click items in a list that share a common pattern.

```js
document.querySelectorAll("INPUT SELECTOR HERE").forEach(function(el) {
    if (el.outerHTML.includes("TEXT")) {
        el.click();
    }
});
```

Replace `INPUT SELECTOR HERE` with the selector for the elements you want to scan, and `TEXT` with the text you want to match. You can also pass data into this step from earlier steps to replace the hardcoded value.

### Click a link or button inside a row containing text

```js
document.querySelectorAll("CUSTOM SELECTOR HERE").forEach(function(el) {
    if (el.outerHTML.includes('TEXT')) {
        el.getElementsByTagName('a')[0].click();
    }
});
```

This clicks the first `a` tag inside each matching row. To click a different one, change the index:

```js
el.getElementsByTagName('a')[1].click();
```

To click a different element type, change the tag name:

```js
el.getElementsByTagName('button')[0].click();
```

To select by class name:

```js
el.getElementsByClassName('red')[0].click();
```

