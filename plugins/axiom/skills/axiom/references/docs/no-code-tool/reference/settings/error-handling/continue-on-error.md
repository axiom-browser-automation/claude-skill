---
title: Continue on error
metaTitle: Keep running an automation past errors with Continue on error
description: Toggle Continue on error to keep an automation running past failures instead of stopping, with errors shown as warnings in run reports.
order: 1
---

By default, axiom.ai stops an automation as soon as a step throws an error. This protects against unexpected side effects, like writing partial data to a Google Sheet. The continue on error option overrides that behaviour and lets the automation keep running through errors.

> **Note:** When `Continue on error` is enabled, every run reports as **successful** at the end, regardless of how many errors occurred. Errors appear as warnings in [run reports](/docs/dashboard#run-reports). Don't use this setting on automations where it matters whether a run actually succeeded.

![The Continue on error settings panel in the axiom.ai Builder](/docs/settings/continue-on-error-axiom.ai.jpg)

## Enable Continue on error
***

1. Open the automation and click the **Cog** icon in the toolbar on the left.
2. Open the **Continue on error** section under **Error handling**.
3. Toggle `Continue on error` on.