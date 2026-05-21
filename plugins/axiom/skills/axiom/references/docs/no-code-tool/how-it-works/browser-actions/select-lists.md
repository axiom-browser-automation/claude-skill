---
title: Use a select list
metaTitle: Choose an option from a dropdown menu with the Select list step
description: Pick an option from a dropdown using the Select list step, or fall back to combinations of Click element with Enter text or Press key(s).
video: https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=922&end=1096
order: 9
---

The primary way to interact with a dropdown menu is the [**Select list**](/docs/no-code-tool/reference/steps/select-list) step. When that doesn't work (for example, on custom dropdowns that don't use a real `<select>` element), there are two fallback patterns.

::HeroMedia
::

## Use the Select list step
***

Open the step finder, search for **select**, and add the **Select list** step.

1. Click **Select** and choose the dropdown.
2. Set `Option` to the value you want to select, or click **Insert data** to pass a value in from earlier steps.

## Type the value with Click element and Enter text
***

If the dropdown is searchable (it filters as you type), click into it and type the option you want.

1. Add a **Go to page** step (or another step that loads the page).
2. Add a [**Click element**](/docs/no-code-tool/reference/steps/click-element) step and select the dropdown.
3. Add an [**Enter text**](/docs/no-code-tool/reference/steps/enter-text) step.
4. In `Text`, enter the option you want.

## Navigate with Click element and Press key(s)
***

If the dropdown isn't searchable, open it with a click and use arrow keys to pick an option.

1. Add a **Go to page** step (or another step that loads the page).
2. Add a **Click element** step and select the dropdown to open it.
3. Add a [**Press key(s)**](/docs/no-code-tool/reference/steps/press-keys) step.
4. Record the keys needed to reach the right option. For example, **Arrow down**, **Arrow down**, **Enter** to select the second option.

## Use a select list with JavaScript
***

For cases where none of the steps above fit, the [**Write javascript**](/docs/tutorials/javascript) step can set the value directly.