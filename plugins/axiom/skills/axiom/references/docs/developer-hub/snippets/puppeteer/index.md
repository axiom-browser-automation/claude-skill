---
title: Puppeteer snippets
metaTitle: Puppeteer snippets for axiom.ai automations
description: Ready-to-use Puppeteer snippets for the Write javascript step in axiom.ai, organised into interaction and network categories.
order: 2
---

[Puppeteer](https://pptr.dev) is a Node.js library that provides a high-level API for controlling Chrome and Chromium. axiom.ai exposes Puppeteer's `Page` class inside the [**Write javascript**](/docs/no-code-tool/reference/steps/write-javascript) step, so you can use it to extend the no-code [Interact steps](/docs/no-code-tool/reference/steps/#interact) when you need behaviour those steps don't cover. For background on what Puppeteer can do with a page, see the [Page interactions reference](https://pptr.dev/guides/page-interactions).

> **Note:** Puppeteer snippets only work when `Run in app` is enabled on the **Write javascript** step, and only on desktop runs. Cloud runs can't use Puppeteer.

## Snippet categories
***

- [Interaction](/docs/developer-hub/snippets/puppeteer/interaction) for scrolling, locating, and filtering elements with Puppeteer's locator API.
- [Network](/docs/developer-hub/snippets/puppeteer/network) for intercepting and blocking network requests during a run.

> **Tip:** For event-driven workflows, the [EventEmitter](https://pptr.dev/api/puppeteer.eventemitter) class is also accessible from the **Write javascript** step. For a worked example, see Nitay Neeman's [Puppeteer event handling examples](https://nitayneeman.com/blog/getting-to-know-puppeteer-using-practical-examples/#handling-events).

Need help? Contact [support](/customer-support) or ask a question in our [Reddit community](https://www.reddit.com/r/axiom_ai).