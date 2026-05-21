---
title: Press keys(s) step
description: Record keyboard input. Include actions like pressing Return to submit a form or Tab to move between fields. Used to replay typed input as part of an automation.
category: Interact
icon: WidgetDriverKeyDown.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=101&end=166?rel=0"}
::


## What to use the Press key(s) step for
***

Press key(s) is one of the most useful steps in axiom.ai's stepbox. This feature lets you record keystrokes and replay them later, which is especially useful for web automation. To learn more about how useful the Press key(s) step is read our [docs.](/docs/docs/no-code-tool/how-it-works/browser-actions/key-strokes)
You can use this step to:

- Record Tabs to move between form elements
- Click a button with a Return
- Enter a date into a form input
- Up and down arrows can scroll pages
- Interact with pop-ups

This step works well in tandem with the [Enter text](/docs/no-code-tool/reference/steps/enter-text) step when automating data entry. Learn to observe where the cursor is loaded on a web page by default. If you're sending [DMs on Instagram](/guides/instagram-dm-like) the cursor is loaded into the message box so you can enter text and record a "Return" keypress to send the message.

## How to configure the Press key(s) step
***

### Key

Click record, then press the keys you want the bot to press. You can record a sequence of keys. Please note key combinations or special clicks can vary for Mac, Windows and Linux (The cloud runs on Linux).

### Data
Input keystrokes directly from data sources such as WebHooks and Google Sheets. However, each keystroke must be separated by a delimiter, or Axiom will interpret them as a single keystroke.

### Delimiter

Customise your delimiter, use this character to separate individual key presses. Make sure this is present between each desired key press in the given data, or this step will not work properly.

### Delay

Set a delay between each key press (in milliseconds).

If you want to learn more, here are some [web automation tips](/blog/automate-chrome-browser).