---
title: Write javascript step
description: Use JavaScript and Puppeteer in your no-code automation to extend functionality. Puppeteer library is already loaded, no need to include it.
category: Other
icon: WidgetDriverCode.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=706&end=734?rel=0"}
::

## What to use the Write javascript step for
***

Are you a coder? Write custom javascript for any operation inside your Axiom, from posting to an API to formatting data from steps. You can also use data from other steps as variables in your custom JS. Please note Axiom data model is a 2D array, so when returning data as a token, remember to return an array (or it will not work). You can return values as an array of arrays from this step - they will be appended to the current row. To learn more about what you can do, [click here](/docs/tutorials/javascript).

Are you using this step to create a [required feature?](/customer-support) Please do let us know we may create a new step for you.

You can use this step to:

- Create custom logic
- Format data from other steps
- Use Puppeteer's API
- Use the node filesystem API
- Click buttons
- Scrape content
- Run JS in the browser or the App

Some usefull [JS snippets](/docs/developer-hub/snippets/javascript).

## How to configure the Write javascript step
***

### Script

Write your JS into our JS editor field. If tokens are available from other steps, you will see an 'Insert Data' button. Data is only available for steps added before your Javascript step.

### Run in app

Toggle on, then Check to run the javascript in the context of the Axiom app, rather than in the browser window. 

This allows you to javascript APIs available in the axiom desktop app - such as Puppeteer, FS, and Chat GPT - which are not available in the browser. 

It is also a better method of sending API requests manually, because sending such requests from the browser often cause CORS errors.
