---
title: Click a radio button
metaTitle: Click radio buttons in a form with the Click element step
description: Click radio buttons in a web form using the Click element step, with fallback methods for tricky cases.
order: 11
---

To click a radio button, use the [**Click element**](/docs/no-code-tool/reference/steps/click-element) step.

## Use the Click element step
***

Open the step finder, search for **click**, and add the **Click element** step.

1. Click **Select** and choose the radio button.

## Fallback methods
***

If the **Click element** step doesn't work for your radio button, try these alternatives.

### Press key(s) step

The [**Press key(s)**](/docs/no-code-tool/reference/steps/press-keys) step records keystrokes. For example, press **Tab** to move focus to the radio button and **Space** to select it.

### CSS selector loop

Use the attribute selector or another [custom CSS selector](/docs/no-code-tool/the-builder/selector-tool/custom-css-selectors) to match the right radio button when the visual picker can't.

### JavaScript

The [**Write javascript**](/docs/tutorials/javascript) step can click radio buttons directly.