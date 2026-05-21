---
title: Switch and close browser tabs
metaTitle: Switch between and close browser tabs in an automation
description: Use the Switch browser tab and Close browser tab steps to interact with multiple tabs during a run.
order: 6
---

When pages open or close tabs during a run, use these no-code steps to manage them.

## Switch to a tab
***

To switch to a different tab during a run, open the step finder, search for **tab**, and add the [**Switch browser tab**](/docs/no-code-tool/reference/steps/switch-browser-tab) step.

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=1211&end=1238"}
::

1. Set `Tab position` to **Last opened tab**, or specify the tab number. `1` is the leftmost tab, `2` is the second from the left, and so on.

## Close a tab
***

To close a tab during a run, open the step finder, search for **tab**, and add the [**Close browser tab**](/docs/no-code-tool/reference/steps/close-browser-tab) step.

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=1839&end=1864"}
::

1. Set `Tab position` to **Last opened tab**, or specify the tab number. `1` is the leftmost tab, `2` is the second from the left, and so on.

## Manage tabs with JavaScript
***

The [**Write javascript**](/docs/tutorials/javascript) step can also open and close tabs.

To open a tab:

```js
window.open('https://www.example.com');
```

To close a tab:

```js
window.close();
```