---
title: Wait step
description: Pause your automation to manually interact or wait for an event to conclude before continuing.
category: Interact
icon: WidgetDriverWait.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=1096&end=1131?rel=0"}
::

## What to use the wait step for
***

This step allows you to add a wait to pause your bot run. You can do this to interact with the page and manually enter a password. But the most common use is to slow the bot by a fraction of a second to allow HTML elements, such as a button, to load.

A top tip when testing your Axiom: if you notice actions out of sync or misfiring clicks, try adding a wait. It's most likely the click fired before the button loaded.

You can use this step to:

- Pause your bot and interact with the page only on Desktop or VPS
- Wait to allow data to load
- Slow the bot to allow buttons and new elements to load
- Allow long file uploads

## How to configure the Wait step
***

### Set a time in milliseconds

One second it 1000 milliseconds, for waits between click elements try 500.

If you want to learn more, here are some [web automation tips](/blog/automate-chrome-browser).
