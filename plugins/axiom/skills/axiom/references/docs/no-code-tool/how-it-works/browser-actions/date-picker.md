---
title: Use a date picker
metaTitle: Automate date picker fields in web forms
description: Pick dates from a calendar widget or text input using the Date picker step or the Enter text step.
video: https://www.youtube.com/embed/tOJci-fiIB8?rel=0
order: 14
---

Date pickers vary widely. Some accept typed input, others are calendar widgets that need clicking through. axiom.ai handles both. For more on the topic, see the blog post on [automating date pickers](/blog/how-to-auotmate-a-date-picker).

::HeroMedia
::

## Type the date into an input field
***

If the date picker is a regular input field that accepts typed dates, use the [**Enter text**](/docs/no-code-tool/reference/steps/enter-text) step.

1. Open the step finder, search for **enter**, and add the **Enter text** step.
2. Click **Select** and choose the date input field.
3. Type the date into `Text`, or click **Insert data** to pass a date in from earlier steps.

## Click through a calendar widget
***

When the date picker is a calendar widget, use the [**Date picker**](/docs/no-code-tool/reference/steps/date-picker) step.

1. Open the step finder, search for **date**, and add the **Date picker** step.
2. Click **Select** and choose the text element showing the current month on the picker.
3. Click **Select** and choose the **Previous month** or **Next month** button (depending on whether you're going back or forward in time).
4. Type the name of the target month in `Month`.
5. Type the target day in `Day`.

For a step-by-step walkthrough, see the [date picker blog post](/blog/how-to-auotmate-a-date-picker).

If you find a date picker that none of these methods can handle, email it to [support@axiom.ai](mailto:support@axiom.ai). We enjoy a challenge.