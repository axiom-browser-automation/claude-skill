---
title: Use logic
metaTitle: Add logic to a browser automation
description: Branch an automation based on data, loop until a condition is met, or stop a run early using If, Try / Catch, and jump steps.
video: https://www.youtube.com/embed/myp-1LJAg1o?rel=0&amp;start=0&end=827
order: 5
---

Use logic steps to change what an automation does based on data. Every logic step takes a piece of data and checks it against a condition. The data can come from a scrape step, a Google Sheet, a previous user input, or anywhere else data flows through the automation.

::HeroMedia
::

## Branch on a condition with If condition

***

![The If condition step in the axiom.ai Builder](/docs/tutorials/if-condition-axiom.ai-step.jpg)

Use **If condition** to run a group of sub-steps only when a condition is met. Compare strings or numbers, run the sub-steps when the condition evaluates true (or when `Reverse condition` flips it false), and carry on with the rest of the automation either way.

1. Open the step finder and add **If condition**.
2. Set `Data to check`.
3. Set `Condition to check`.
4. Toggle `Reverse condition` if you want the sub-steps to run when the condition is false.
5. Add the sub-steps to run when the condition is met.

::YouTubeDialog{url="https://www.youtube.com/embed/myp-1LJAg1o?rel=0&amp;start=22&end=827"}
::

**Example**: On Instagram profile pages, scrape the message button. If the text `message` is found, the sub-steps click the button and send a message. If not, the automation skips those sub-steps and carries on with the rest of the run.

## Branch either way with If / Else

***

![The If / Else step in the axiom.ai Builder](/docs/tutorials/if-else-step-axiom-ai.jpg)

Use **If / Else** when you need to run one set of sub-steps if a condition is met and a _different_ set if it isn't.

1. Open the step finder and add **If / Else**.
2. Set `Data to check`.
3. Set `Condition to check`.
4. Toggle `Reverse condition` if needed.
5. Add sub-steps to the **If** branch.
6. Add sub-steps to the **Else** branch.

::YouTubeDialog{url="https://www.youtube.com/embed/myp-1LJAg1o?rel=0&amp;start=210&end=827"}
::

**Example**: Form filling where the form changes based on an earlier selection. The If branch fills the fields shown for option A; the Else branch fills the different fields shown for option B.

## Stop the run unless a condition is met

***

![The Continue only if a condition is met step in the axiom.ai Builder](/docs/tutorials/continue-condition-met-step-axiom-ai.jpg)

Use [**Continue only if a condition is met**](/docs/no-code-tool/reference/steps/continue-if-condition-met) to check a condition and either keep the run going or end it.

1. Open the step finder and add **Continue only if a condition is met**.
2. Set `Data to check`.
3. Set `Condition to check`.
4. Toggle `Fail if condition not met` to treat a failed condition as an error instead of a clean stop.
5. Toggle `Reverse condition` if needed.

::YouTubeDialog{url="https://www.youtube.com/embed/myp-1LJAg1o?rel=0&amp;start=303&end=827"}
::

**Example**: Check whether a Google Sheet contains data before continuing. If the sheet is empty, stop the run instead of wasting time on later steps that depend on that data.

## Jump to another step with Conditionally jump to another step

***

![The Conditionally jump to another step in the axiom.ai Builder](/docs/tutorials/conditionaly-jump-step-axiom-ai.jpg)

Use [**Conditionally jump to another step**](/docs/no-code-tool/reference/steps/conditionally-jump-to-another-step) to skip forward or loop back in the automation based on a condition. Setting `Maximum cycles` caps how many times the automation can loop back through the same jump.

1. Open the step finder and add **Conditionally jump to another step**.
2. Set `Data to check`.
3. Set `Condition to check`.
4. Set `Jump to step` to the step you want to jump to.
5. Set `Maximum cycles` to cap how many times the automation can loop back.
6. Toggle `Reverse condition` if needed.

::YouTubeDialog{url="https://www.youtube.com/embed/myp-1LJAg1o?rel=0&amp;start=574&end=827"}
::

**Example**: Click a **Next** button and jump back to the click step until a target value appears on the page, capped at some maximum so the automation doesn't loop forever.

## Catch errors with Try / Catch

***

![The Try / Catch step in the axiom.ai Builder](/docs/tutorials/try-catch-step-axiom-ai.jpg)

Use [**Try / Catch**](/docs/no-code-tool/reference/steps/try-catch) to run a set of sub-steps and, if any of them fail, run a different set instead of ending the run. Unlike the other logic steps, **Try / Catch** doesn't take a condition. The Catch branch triggers whenever the Try branch throws an error.

1. Open the step finder and add **Try / Catch**.
2. Add the sub-steps that might fail to the **Try** branch.
3. Add recovery sub-steps to the **Catch** branch.

::YouTubeDialog{url="https://www.youtube.com/embed/myp-1LJAg1o?rel=0&amp;start=475&end=827"}
::

**Example**: A site occasionally triggers a popup that blocks the automation. Put the main sub-steps in the Try branch and, in the Catch branch, add the click needed to dismiss the popup before retrying.

## Build custom logic with JavaScript

***

When the no-code logic steps don't fit, use the [**Write javascript**](/docs/no-code-tool/how-it-works/javascript) step to build your own. Any value your script returns (a 2D array or a string) is available to later steps and can drive an **If condition**, **If / Else**, or any other logic step that reads data.

::YouTubeDialog{url="https://www.youtube.com/embed/myp-1LJAg1o?rel=0&amp;start=769&end=827"}
::