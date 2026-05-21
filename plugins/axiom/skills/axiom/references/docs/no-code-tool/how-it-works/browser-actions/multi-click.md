---
title: Click multiple buttons
metaTitle: Click multiple elements on a page in one automation
description: Click many buttons at once with Click multiple elements, loop through CSS selectors, or use jump steps to repeat a click.
video: https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=3192&end=3222
order: 3
---

axiom.ai gives you several ways to click more than one button in a single automation, depending on whether the buttons share a pattern or you need to repeat the same click many times.

::HeroMedia
::

## Use the Click multiple elements step
***

The [**Click multiple elements**](/docs/no-code-tool/reference/steps/click-multiple-elements) step clicks every element matching a selector. Useful for clicking each item in a list.

1. Open the step finder and add **Click multiple elements**.
2. Click **Select** and use the selector tool to choose the elements.
3. Set the click action to **Left click** or **Right click**.
4. Set `Maximum clicks` to cap the number of clicks.

This step doesn't support clicking a button, doing some other actions, then clicking the next button. For that pattern, loop through CSS selectors instead.

## Loop through CSS selectors
***

When you need to click a button, perform actions, then move on to the next button, store the buttons' CSS selectors in a Google Sheet and loop through them.

1. Create a Google Sheet with one CSS selector per row.
2. Add a [**Read data from a Google Sheet**](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step) step pointing at the sheet.
3. Add a [**Loop through data**](/docs/no-code-tool/how-it-works/loop) step using the `[google-sheet-data]` token.
4. Inside the loop, add a [**Click element**](/docs/no-code-tool/reference/steps/click-element) step.
5. In the **Click element** step, click **Select**, choose **Custom**, tick **Set selector from data**, and pick the `[google-sheet-data]` token.
6. Click **Complete**.

For more on this pattern, see [custom CSS selectors](/docs/no-code-tool/the-builder/selector-tool/custom-css-selectors).

## Repeat a single click with a jump step
***

To click the same button several times in a row, pair **Click element** with a [**Jump to another step**](/docs/no-code-tool/reference/steps/jump-step) or [**Conditionally jump to another step**](/docs/no-code-tool/reference/steps/Conditionall-jump-step) step.

1. Add a **Click element** step and configure it with the selector tool.
2. Add a **Jump to another step** or **Conditionally jump to another step** step. Set `Jump to step` to the **Click element** step.
3. Set `Maximum cycles` (or, for the conditional version, configure the condition).

## Click with JavaScript
***

The [**Write javascript**](/docs/tutorials/javascript) step gives you full control when the no-code steps don't fit. Two common approaches:

- The native [`HTMLElement.click()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click) method.
- The [Puppeteer integration](/docs/no-code-tool/integrations/puppeteer) for more complex interactions.

For starting points, see the [JavaScript snippets reference](/docs/no-code-tool/reference/javascript-snippets).