---
title: Enter text into an input field
metaTitle: Type text into a form field with the Enter text step
description: Use the Enter text step to type into form fields, with optional support for line breaks and dynamic data.
video: https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=2001&end=2113
order: 4
---

To type text into a form field, use the [**Enter text**](/docs/no-code-tool/reference/steps/enter-text) step. You can type a static string, or pass data in from an earlier step.

::HeroMedia
::

## Use the Enter text step
***

Open the step finder, search for **enter**, and add the **Enter text** step.

1. Click **Select** and choose the input field.
2. Type the text into `Text`, or click **Insert data** to pass data in from an earlier step.

## Insert line breaks
***

Some fields accept a regular **Return** key as a line break, others need a different key combination (for example **Shift + Enter**). Use the `Custom line break` setting to map your line breaks to whatever the site expects. For a worked example, see [How to insert line breaks when entering text](/guides/line-breaks).

1. In the **Enter text** step, click **Custom line break**.
2. Record the key sequence the site uses for line breaks.
3. Use regular line breaks in the `Text` field. axiom.ai converts them to the recorded sequence at runtime.

## Enter text with JavaScript
***

For cases where the **Enter text** step doesn't fit, the [**Write javascript**](/docs/tutorials/javascript) step can set field values directly. Use this as a last resort.