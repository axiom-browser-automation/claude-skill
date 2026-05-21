---
title: Code snippets
metaTitle: JavaScript and Puppeteer code snippets for axiom.ai
description: Tried-and-tested JavaScript and Puppeteer snippets for the Write javascript step, plus guidance on when to use the Run in app option.
order: 2
---

The [**Write javascript**](/docs/no-code-tool/reference/steps/write-javascript) step lets you extend axiom.ai with custom code. The snippets in this section have been tried and tested in real automations, and many came from user requests. They're split into two categories: standard JavaScript that runs against the page, and Puppeteer snippets that drive the browser through Puppeteer's API.

## Snippet categories
***

::DocsCards
::

## Run in app
***

The `Run in app` toggle on the **Write javascript** step runs your code inside the desktop application instead of inside the page. This is required for any snippet that uses the [Puppeteer API](/docs/no-code-tool/integrations/puppeteer). It's also useful when:

- You don't want your code to interact with the page's own scripts. Running in the page can trigger the page's event listeners or clash with its function and variable names.
- You need access to Node.js APIs (the `fs` module, for example) that aren't available in a browser context.

There are trade-offs:

- You can't access elements, functions, or variables from the page being automated.
- Console output isn't visible during the run when `Run in app` is enabled.

> **Note:** `Run in app` only works on desktop runs. Cloud runs always execute scripts in the page context.

Need help? Contact [support](/customer-support) or ask a question in our [Reddit community](https://www.reddit.com/r/axiom_ai).