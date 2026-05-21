---
title: Handle errors in an automation
metaTitle: Catch and handle errors during axiom.ai automation runs
description: Catch errors with Try / Catch, ignore them with Continue on error, handle empty loops gracefully, and get notified when runs fail.
order: 2
---

axiom.ai gives you a few ways to deal with errors that come up during a run. Use [**Try / Catch**](/docs/no-code-tool/reference/steps/try-catch) to recover and continue along a different path, or [continue on error](/docs/no-code-tool/reference/settings/error-handling/continue-on-error) to ignore failures entirely.

## Catch errors with Try / Catch
***

Wrap risky steps in a **Try / Catch** step to handle errors without stopping the whole automation. The steps inside the **Try** branch run as normal. If any of them throw an error, the automation jumps to the **Catch** branch and runs those steps instead.

![The Try / Catch step shown in the axiom.ai Builder with steps in both branches](/docs/tutorials/try-catch-error-handling.jpg)

For example, put a **Get data from current page** step in the **Try** branch and recovery actions in the **Catch** branch. If the data isn't found on the page, the automation runs the recovery actions instead of failing the whole run. Without **Try / Catch**, the automation would stop at the failing step.

## Ignore errors with Continue on error
***

By default, axiom.ai stops on the first error to prevent unexpected side effects. Toggle [continue on error](/docs/no-code-tool/reference/settings/error-handling/continue-on-error) on to override that behaviour and let the automation push through errors.

![The Continue on error setting in the axiom.ai Builder](/docs/settings/continue-on-error-axiom.ai.jpg)

> **Note:** With `Continue on error` enabled, every run reports as **successful** at the end regardless of how many errors occurred. Errors appear as warnings in run reports.

## First-iteration loop errors
***

If a [loop](/docs/no-code-tool/how-it-works/loop) hits an error on its first row, axiom.ai treats it as a warning instead of an error. This means an empty data source or an unexpectedly bad first row doesn't stop the whole automation; subsequent iterations still run.

## Get notified on run status
***

Set up [notifications](/docs/no-code-tool/reference/settings/run-options/notifications) so you find out as soon as a run fails or finishes with warnings, instead of having to check the dashboard. Notifications can be sent by email or [webhook](/docs/no-code-tool/how-it-works/webhooks) and can fire on any combination of these events:

- A run fails.
- A run succeeds.
- A run succeeds with warnings.

![The notifications settings panel in the axiom.ai Builder](/docs/settings/notifications-axiom.ai.jpg)