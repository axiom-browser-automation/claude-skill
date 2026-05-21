---
title: Jump to another step
description: Automations run steps in sequence. Use this step to break that sequence and jump to a step outside the order.
category: Control flow
icon: WidgetAlwaysJump.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=225&end=266&rel=0"}
::

## What to use the Jump to another step step for
***

The jump step is used to create simple loops or to skip steps that you do not want to execute. It works well in conjunction with the [Conditional jump step.](/docs/no-code-tool/reference/steps/Conditionall-jump-step)
We use the jump step as part of a technique called batching. This involves looping through steps using a jump step. For example, we start by reading a single row from a Google Sheet; we execute automation using that row's data. Then, we delete the row before moving on to read a new row.

When combining the [Jump to another step](#) step and the [Loop through data](/docs/no-code-tool/reference/steps/loop) step, we recommend only using this step to jump to a later step in the loop, or to jump out of the loop to a later step in your automation. We do not recommend using this step to jump to an earlier step in the loop and this can not be used to jump to a previous iteration within the loop - doing so may cause issues with the data within the loop step.

## How to configure the Jump to another step
***

### Jump to step

Enter the number of the step to jump to if the value is found. You can jump up or jump down.

### Maximum cycles

The number of times the step should jump.
