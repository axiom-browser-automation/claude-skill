---
title: Close browser tab step
description: Close tabs during runtime. Use to manage open pages and keep the automation focused on active tasks.
category: Navigate
icon: WidgetDriverCloseTab.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=1839&end=1864?rel=0"}
::

## What to use the Close browser tab step for
***

This step closes a tab, necessary when new pages open during bot runs to return to the previous tab. The bot operates in only one tab at a time and cannot switch tabs automatically. Errors like 'click not found' occur if the bot is active in the wrong tab. Combine this step with the ['Switch tab'](/docs/no-code-tool/reference/steps/switch-browser-tab) step for multi-tab automation.

You can use this step to:

- Close new tabs that open in pop up windows
- Return to previous tab

## How to configure the Close browser tab step
***

### Select Tab

Set the position of the tab to switch to. 1 chooses the tab on the farthest left, 2 the second left etc.
