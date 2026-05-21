---
title: Click likes and follows
metaTitle: Click social media like and follow buttons in an automation
description: Use the Click social media buttons step to like and follow posts, with detection so already-liked content isn't clicked twice.
video: https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=3247&end=3312
order: 8
---

To automate likes and follows on social media, use the [**Click social media buttons**](/docs/no-code-tool/reference/steps/click-social-media-buttons) step. It detects whether the content is already liked or followed, so it won't click twice.

::HeroMedia
::

## Use the Click social media buttons step
***

Open the step finder, search for **social**, and add the **Click social media buttons** step.

1. Click **Select** and choose the like or follow button.
2. Set `Value to check` so the step can detect the already-clicked state.

## Use the Click element step
***

If the targeted button doesn't have a clear "already-clicked" state, the standard [**Click element**](/docs/no-code-tool/reference/steps/click-element) step works just as well.

## Click likes and follows with JavaScript
***

For cases where neither step fits, fall back to the [**Write javascript**](/docs/tutorials/javascript) step.