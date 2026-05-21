---
title: Pause an automation
metaTitle: Add a pause to an automation with the Wait step
description: Pause an automation to interact with the page, give content time to load, or mimic human-like timing.
video: https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=1096&end=1131
order: 5
---

There are several reasons to pause an automation: to interact with the page (for example to enter a password), to give a slow-loading page time to render, or to vary timing to look more human. Note that you can only interact with the browser when running on the desktop, not in the cloud.

::HeroMedia
::

## Use the Wait step
***

To pause an automation, open the step finder, search for **wait**, and add the [**Wait**](/docs/no-code-tool/reference/steps/wait) step.

1. Set `Wait type` to **Fixed length** for a specific duration, or **Random length** to vary it.

The automation pauses when it reaches the **Wait** step, not before.