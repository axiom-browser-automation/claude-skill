---
title: Conditionally jump to another step
description: Jump to a different step based on logic set. Use strings, numbers, or JavaScript to define your argument.
category: Control flow
icon: WidgetJump.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=579&end=661?rel=0"}
::

## What to use the Conditionally Jump step for
***

This logic step enables a bot to either jump to a new step or continue with its run based on the evaluation of a specific condition. For instance, it can be effectively paired with a Scraper step. In this scenario, once the Scraper extracts certain data, the logic step then assesses this data for a particular value. If the value is found, the bot is programmed to jump to a new step. If the value is not found the bot will continue.

You can use this step to:

- Check for a value in Google sheet to bypass steps
- Check against a value on a webpage by [scraping](/docs/no-code-tool/reference/steps/Get-data-from-website) it first
- Confirm a form or post has been submitted
- Control the bot flow depending on a value found in a [Google Sheet](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step)

When combining the [Conditionally jump to another step](#) step and the [Loop through data](/docs/no-code-tool/reference/steps/loop) step, we recommend only using this step to jump to a later step in the loop, or to jump out of the loop to a later step in your automation. We do not recommend using this step to jump to an earlier step in the loop and this can not be used to jump to a previous iteration within the loop - doing so may cause issues with the data within the loop step.

## How to configure the Conditionally jump 
***

### Data to check

Enter the data to check for values.

### Condition to check

Check data for either a list of words, a number or if a javascript expression is true.

Enter either a list of any number of words to check for, separated by commas, or data containing a list of words, one in each row or a number.

Select if the condition should pass when either any of the supplied words are present in the data, or all of them are. Or select the condition to apply when Numbers is selected.

Check this to match only when the complete word appears in the data. Only the characters a-z A-Z 0-9 and _ are considered to be part of a word, all other characters are considered as being part of a word boundary.

### Jump to step

Enter the number of the step to jump to if the value is found.

### Maximum cycles

The number of times the step should jump.

### Reverse condition

Jump if the specified words or number NOT found.

### Addional information

Use the [loop step](/docs/no-code-tool/reference/steps/loop) to loop your steps.