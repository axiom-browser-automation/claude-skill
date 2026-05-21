---
title: Control flow step errors
metaTitle: Fix errors with Jump and Continue if condition met steps
description: Errors that can occur with control flow steps including Jump to another step and Continue only if a condition is met.
order: 6
---

The errors on this page can occur with control flow steps such as **Jump to another step** and **Continue only if a condition is met**.

## Jump target step does not exist
***

**Error:** `Jump to another step`: Step number given does not exist in this axiom. The error can also appear as **Step number given does not exist in this axiom**.

**Problem:** The step number set in `Jump to step` on a [**Jump to another step**](/docs/no-code-tool/reference/steps/jump-step) step doesn't match an actual step in the automation. This often happens after deleting or reordering steps.

**Fix:** Open the **Jump to another step** step and update `Jump to step` to a step that exists. After moving steps around in an automation, check every jump step still points where you intended.

## Continue condition did not pass
***

**Error:** Continue condition check did not pass.

**Problem:** A [**Continue only if a condition is met**](/docs/no-code-tool/reference/steps/continue-if-condition-met) step's condition evaluated to false (or to true if `Reverse condition` was on), so the automation stopped at that point.

**Fix:** Watch the run to see what value `Data to check` actually contained when the step fired, then adjust `Condition to check` to match the data you're seeing. If the failed condition should be a clean stop rather than an error, leave `Fail if condition not met` off; the automation will end without an error.