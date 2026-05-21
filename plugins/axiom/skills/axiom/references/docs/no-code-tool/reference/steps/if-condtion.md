---
title: If a condition is true, run steps
description: Execute a set of steps depending on an If condition. Pass data into this step to use when constructing your argument. IF Conditions can use text, numbers, or custom JavaScript.
category: Control flow
icon: TemplateIfElse.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=736&end=811&rel=0"}
::

## What to use the If condition step for
***

This logic step can execute a set of sub-steps depending on whether the condition returns true or false. For instance, you could use this step with the scraper step. If the scraper extracts some data, this step can check that data for a particular value. If the value is not found, the bot will skip the sub-steps contained within the condition.

You can use this step to:

- Execute steps based on a value found on a webpage by [scraping](/docs/no-code-tool/reference/steps/Get-data-from-website) it first
- Entering data into a [form](/blog/how-to-automate-data-entry) depending on a condition
- Triggering another Axiom run, depending on a value found in a [Google Sheet](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step)

## How to configure If condition step
***

### Data to check

Select the data to check for values.

### Condition to check

Check data for either a list of words, a number or if a javascript expression is true.

Enter either a list of any number of words to check for, separated by commas, or data containing a list of words, one in each row. Leave blank to match anything. Or select the condition to apply when Numbers is selected.

Apply rule when match, Any word or All words or any condition when Numbers selected.

Check - Match only the complete word if it appears in the data. Only the characters a-z A-Z 0-9 and _ are considered to be part of a word, all other characters are considered as being part of a word boundary.

### Reverse condition

Tick the box, to invert the condition to execute and execute the sub-steps if the condition fails.

### Add step

Add the sub-steps you wish to excute as part of the condition.

### Addional information

You can nest this step in [loops](/docs/no-code-tool/reference/steps/loop) or other IF conditions.