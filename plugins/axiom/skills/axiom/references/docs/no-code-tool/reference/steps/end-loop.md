---
title: End loop
category: Control flow
description: Learn how to use the End loop step in your Axiom
icon: TemplateLoopThroughData.svg
---

## What to use the End loop step for
***

The "End loop" step allows you to prematurely end a loop that has been initiated with the "Loop through data" step. This allows you to end the loop and continue onto the next step within your automation.

When combined with a [control flow](/docs/no-code-tool/reference/steps/#control-flow) step, you can use logic to determine when to finish your loop, this can be useful for:

- Ending the loop when a condition is met
- Ending a loop when an issue occurs, using the [Try/Catch](./try-catch) step.

Things to note:

- This step requires no configuration.
- This step can only be used inside of a "Loop through data" step - placing it outside of this step will cause the step to be ignored.
- Using this step and then jumping back into the "Loop through data" step will cause the loop to restart from the first iteration, not where the "End step" was called.