---
title: If Else condition step
description: Execute a set of steps depending on an If Else condition. Pass data into this step to use when constructing your argument. IF Conditions can use text, numbers, or custom JavaScript.
category: Control flow
icon: TemplateIfElse.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=736&end=811&rel=0"}
::

## Purpose of the **If Else condition** step
***

The **If Else Condition** step allows you to execute different sets of actions based on whether a specified condition evaluates to true or false. In the condition, you can 'Insert Data' to check values from Google Sheets or other steps like 'Get Data from Current Page'. You can compare strings, numeric values, or even create custom conditions using JavaScript.

You can use this step to compare values and execute different actions, such as:

- Checking if scraped data matches a specific value
- Verifying if the page URL contains 'login' and executing login steps
- Detecting if a button is present and clicking it

## How to Configure the **If Else condition** Step
***

### Data to Check

Select the data you want to evaluate.

### Condition to Check

You can check the data for words, a number or test if a JavaScript expression evaluates to true.

Enter a list of words or numbers separated by commas, or provide data containing a list of values, one per row. Leave the field blank to match any value.

You can apply the rule to match Any Word or All Words. Or any condition when Numbers selected.

Enable the option to **Match complete word only**. This ensures only alphanumeric characters (a-z, A-Z, 0-9, and _) are considered part of a word, while other characters are treated as word boundaries.

### Reverse Condition

Check this box to invert the condition and execute sub-steps if the condition is false.

### Add Sub-Steps

Insert the steps you want to execute when the condition is met.

### Else - Add Sub-Steps

Insert the steps you want to execute when the condition is not met.
