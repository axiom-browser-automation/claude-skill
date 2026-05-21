---
title: Debug developer features
metaTitle: Debug the axiom.ai API and Write javascript step
description: Test the axiom.ai API with Postman or cURL, and debug custom code in Write javascript steps using console logs and conditional checks.
order: 1
---

Debugging the API and any custom code is essential when extending axiom.ai with the API or [**Write javascript**](/docs/no-code-tool/reference/steps/write-javascript) step. The pages here cover patterns specific to those tools. For general automation debugging that applies to every plan, see [Debug an automation](/docs/no-code-tool/troubleshooting/how-to-debug).

## Test the API
***

[Postman](/docs/developer-hub/api) and [cURL](/guides/curl) are both good tools for testing the API outside your automation or production system. Both are free.

For common errors when calling the API, see [API errors](/docs/developer-hub/troubleshooting/api).

## Debug custom code
***

Custom code in the **Write javascript** step extends axiom.ai with logic the no-code steps don't cover. Two patterns help when something goes wrong: console logging and returning values for conditional checks.

### Use console logs

`console.log()` works inside the **Write javascript** step and shows output in Chrome DevTools.

> **Note:** Console logs are only visible during desktop runs. Cloud runs close the browser when they finish, so the console is gone before you can read it. To inspect console output after a desktop run completes, add a [**Wait**](/docs/no-code-tool/reference/steps/wait) step at the end of the automation so the browser stays open long enough.

For background on opening DevTools and reading the console, see [use Chrome DevTools](/docs/no-code-tool/troubleshooting/how-to-debug#use-chrome-devtools).

### Return values for conditional checks

The **Write javascript** step can return a value, which you can then route on with a [**Continue only if a condition is met**](/docs/no-code-tool/reference/steps/continue-if-condition-met) step. This is useful when the script can succeed in different ways and the rest of the automation needs to react accordingly.

For example, a script might extract an email address from a page, returning the string `no email found` when nothing matches. Add a **Continue only if a condition is met** step after it that checks for `no email found` and stops or branches the automation when that string is returned.