---
title: Better notifications, custom errors, iframe tools, and more
version: 3.17
date: 2023-03-15
video: https://www.youtube.com/embed/XISpGffrmTU?rel=0&amp
---

::HeroMedia
::

## Iframe support is back
***

Those with good memories may recall that this feature was added a while ago, but then had to be rolled back as it caused unintended problems. Now it has returned!

This time, you will need to turn on iframe support from the settings section of your axiom.ai; each axiom.ai can have iframe support on or off as required. The default is for iframe support to be turned off.

Once iframe support is turned on, axiom.ai will be able to interact with most elements within iframes, and scrape data in them too.

As a nice bonus, automation performance on sites that make heavy use of iframes (usually for things like ads or tracking) will now be much better out of the box.

<img src="/releases/iframe.jpg" alt="iframe support - axiom.ai">

## Improved notifications
***

We have enanced the notification system to be more flexible and useful, particularly for those who are using axiom.ai as part of a larger automation stack.

Now you can:

- Turn on notifications for success, failure or both.
- Specify an email address to send notifications to (previously, these always went to the email associated with your account).
- Send a webhook as a success or failure notification.

<img src="/releases/notifications.jpg" alt="better notifications - axiom.ai">

## Custom error logging
***

A new step has been added, "Add error metadata", which lets you augment error messages with custom data. This should be help bots that run on schedules or remotely to more accurately debug issues, or to simply give better information on what failed and why.

This feature works well in conjunction with the notification enhancements.

<img src="/releases/metadata.jpg" alt="custom error message logging - axiom.ai">

## Customised line breaks in the Enter Text step
***

Many modern messaging apps, such as Instagram, use the "Enter" key as a way of sending a message rather than entering a line break. This means it is quite awkward to construct a single message with many paragraphs using axiom.ai.

Now we've added a custom line break feature to help with this. When turned on, it will let you record a custom keypress value to use instead of the enter key when a new line is encountered in your input.

## Better tab handling
***

Two features related to handling tabs have been introduced in 3.17.

Firstly, the goto step now has a checkbox that allows you to specify that the page should be opened in a new tab. The change means axiom.ai will automatically switch the context to the new tab when you do this.

<img src="/releases/newtab.jpg" alt="open page in new window - axiom.ai">

Secondly, a new step has been added that allows tabs to be closed. Context in that case switches to the last open tab.

<img src="/releases/close-tab.jpg" alt="close tab - axiom.ai">

## Download page HTML step
***

A new step has been added which allows you to download the entire HTML of a page and save it locally.

The page is downloaded after rendering is complete, which means that all javascript has run.

<img src="/releases/htm-page.jpg" alt="automate donwloading html pages with axiom.ai">

## Minor fixes
***

- Enter text steps now do not click into the box if a passed token value is empty.
- UI tweaked on conditional logic steps to clarify what the default state does.
- Fixes to cases where automations would get stuck "In Progress" when stopped.
- After a certain number of steps have passed, axiom.ai will now restart chrome, to try and stop websites that have memory leaks from breaking long automations.
- Custom selectors containing double quotation marks no longer fail.
- New video guides added for steps.
- New retry logic added for external requests to reduce the chance that temporary network problems or outages will stop your automation from completing.
