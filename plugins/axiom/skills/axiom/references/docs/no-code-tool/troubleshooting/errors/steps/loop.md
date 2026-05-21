---
title: Loop step errors
metaTitle: Fix errors with Loop through data and other axiom.ai loop steps
description: Errors that can occur with loop steps, including how to debug a loop where every iteration fails.
order: 4
---

The errors on this page relate to the [**Loop through data**](/docs/no-code-tool/reference/steps/loop) step. Most loop errors are caused by a step *inside* the loop failing on every iteration, not by the loop itself.

## Error in all rows of loop
***

**Error:** Error in all rows of loop. The error appears with the underlying message appended, for example **Error in all rows of loop, your chosen selectors have failed to find any content on page**.

**Problem:** A step inside the **Loop through data** step failed on every iteration. The text after the comma is the actual error from the failing inner step. The wrapping "Error in all rows of loop" prefix tells you the failure is consistent rather than intermittent.

**Fix:** Look up the underlying error in its specific section:

- [Could not find the requested element](/docs/no-code-tool/troubleshooting/errors/steps/interact#element-not-found-on-page)
- [Your chosen selectors have failed to find any content on page](/docs/no-code-tool/troubleshooting/errors/steps/interact#element-not-found-on-page)
- [Protocol error (Page.navigate)](/docs/no-code-tool/troubleshooting/errors/steps/navigate)
- [Evaluation failed](/docs/no-code-tool/troubleshooting/errors/general#evaluation-failed)