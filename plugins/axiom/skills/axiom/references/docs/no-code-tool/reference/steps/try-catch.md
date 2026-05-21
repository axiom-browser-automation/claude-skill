---
title: Try catch
description: Execute a different set of steps if an error is encountered during runtime. Use to handle errors.
category: Debug
icon: TemplateTryCatch.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=2445&end=2485?rel=0"}
::

## What to use the Try catch step for
***

The Try catch step executes sub-steps within the 'Try' block. If these steps trigger an error, it is intercepted by the 'Catch' block. This block not only catches the error but also returns it as a token for debugging purposes. Additionally, it can execute a separate set of sub-steps tailored for error handling.

## You can use this step to:
***
- Debug Axiom runs

## How to configure the Try catch step
***

### Try

Add the sub-steps you wish to execute as part of the 'Try' condition.

### Catch

Add the sub-steps you wish to execute as part of the 'Catch' condition.

### Addional information

You can nest this step in [loops](/docs/no-code-tool/reference/steps/loop) or the [IF condition](/docs/no-code-tool/reference/steps/if-condtion) step.