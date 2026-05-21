---
title: Click element step
category: Interact
description: Replicate page clicks on links or buttons with the Click element step. Point and click to select the action you want to automate.
icon: WidgetDriverClick.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&start=1749&end=1838?rel=0"}
::

## What to use the click element step for
***

The "Click element" step automates clicks in web automation, essential for actions like liking content or submitting forms. Learn about optional clicks and using element text for button selection.

You can use this step to:

- Click submit on a [form](/blog/how-to-automate-data-entry) 
- Close a pop-up window by clicking 'X'
- Like an [Instagram post](/blog/automate-instagram-post ) - Click on a [select list](/docs/no-code-tool/reference/steps/select-list) - Tick a box
- [Send an email](/blog/how-to-send-email-blast) - Click to generate [reports](/blog/how-to-automate-reporting)
- Click to discover even more uses for the [Click element](/dcs/docs/no-code-tool/how-it-works/browser-actions/clicks) step.

## Configuration
***

### Select

Click 'Select' to choose the button click you wish to automate. The display will transform into the single selector tool, then point and click.

The single selector tool comes with several valuable features accessed by clicking custom:
- Ability to use custom CSS selectors
- 'Use element text' allows you to click buttons based on the button text i.e. 'Submit'
- Pass CSS selectors in from data sources like a Google Sheet

[Watch these guides to learn more about the selector tool.](/docs/no-code-tool/the-builder/selector-tool)

### Left click | Right click

Toggle off to perform a left click; toggle on to perform a right click.

### Optional click (Can be very handy)

By default, if the selected element is missing, Axiom will throw an error and stop the run. However, in some cases, you may want to click on an element that is not always present. If you check this box, the error will be ignored and the run will complete.