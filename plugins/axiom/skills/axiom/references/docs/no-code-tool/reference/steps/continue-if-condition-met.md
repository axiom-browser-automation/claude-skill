---
title: Continue only if a condition is met step
description: Control bot runs with logic. Decide to continue or end based on argument constructed. Use data passed by other steps. Build argument with strings, numbers, or JavaScript.
category: Control flow
icon: WidgetContinue.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=3085&end=3192?rel=0"}
::

## What to use the Continue only if a condition is met step for
***

This logic step checks a value and continues the bot run if true. For instance, it can verify if content is updated by searching for 'New.' Pair it with the ['scrape data'](/docs/no-code-tool/reference/steps/Get-data-from-website) step to fetch the value.

You can use this step to:

- Query if there's any data left in a Google Sheet, then stop bot run if empty
- Check against a value on a webpage by ['scraping'](/docs/no-code-tool/reference/steps/Get-data-from-website) it first
- Confirm a form or post has been submitted
- Control if a bot runs depending on a value found in a [Google Sheet](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step)
## How to configure the Continue only if a condition is met step
***

### Data to check

Select the variable containing the data you wish to check against. That variable could be from any step, for example, a webhook or scraper

### Condition to check

Check data for either a list of words, a number or if a javascript expression is true.

Enter either a list of any number of words to check for, separated by commas, or data containing a list of words, one in each row. Leave blank to match anything. Or select the condition to apply when Numbers is selected.

Check this to match only when the complete word appears in the data. Only the characters a-z A-Z 0-9 and _ are considered to be part of a word, all other characters are considered as being part of a word boundary.

### Fail if condition not met

Tick this box to end the run with the 'Failed' status if the condition is not met. If this is left unchecked, the run will end in 'Success' instead.

### Reverse condition

Continue if the condition is NOT met.
