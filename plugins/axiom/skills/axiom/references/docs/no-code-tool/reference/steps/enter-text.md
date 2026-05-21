---
title: Enter text step
description: Use this step to enter text into text fields found in web forms. Pass data from other steps into the Enter text step to automate data entry.
category: Interact
icon: WidgetDriverEnterText.svg
---


::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?start=2001&end=2113&rel=0"}
::


## What to use the Enter text step for
***

The 'Enter text' step enables the user to select an input element and [pass data](/blog/how-to-automate-data-entry) from another step, without writing any code. This step is useful for web automation tasks such as data entry and UI testing.

You can use this step to:

- Enter data into any CRM
- Input date ranges to download reports
- Login to applications
- Send a DM on Instagram or any social media app
- Create a mass mailer in Gmail or Outlook
- Uploading posts to web apps

To learn about data and looping, [read this page](/docs/no-code-tool/the-builder/pass). You may also want to look at this [data entry template.](/guides/data-input-from-google-sheet)
## Configure the Enter text step
***

### Select text field

Click 'Select' to choose the text field that the Axiom should enter text into. The display will transform into the single selector tool, then point and click.

The single selector tool comes with several valuable features accessed by clicking custom:
- Ability to use custom CSS selectors
- 'Use element text' allows you to click buttons based on the button text i.e. 'Submit'
- Pass CSS selectors in from data sources like a Google Sheet

[Watch these guides to learn more about the selector tool.](/docs/no-code-tool/the-builder/selector-tool)

If you do not select a field, the bot will type into whatever is selected by default, this works well in tandem with the [Press key(s) step.](/docs/no-code-tool/reference/steps/press-key)
### Text
Input the text to enter. Use 'Insert Data' to pass data from sources such as a Google Sheet or WebHook.

### Delay

Adds a delay between each key press in milliseconds.

### Append to existing

Toggle on to skip clearing the text before entering. The value will be appended to whatever is already in the box.

### Custom line break

Record a sequence of characters to use instead of enter for line breaks. For example, record shift and enter for Instagram DMs.

### Optional text

If checked & the selected field is not present on the page the automation will continue without an error.

Learn more about automating data entry by [clicking here.](/blog/how-to-automate-data-entry)
