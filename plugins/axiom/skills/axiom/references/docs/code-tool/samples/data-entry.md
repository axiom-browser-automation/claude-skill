---
title: Enter data into a page
metaTitle: Sample Puppeteer script for entering data into a page
description: Sample Puppeteer script for the axiom.ai Code Tool that connects to the hosted browser, fills a search field on Google, waits, and closes cleanly.
order: 2
---

This sample script connects to axiom.ai, opens Google, fills the search bar with a query, waits 5 seconds, and closes the browser.

What it does:

1. Connect to the axiom.ai hosted browser.
2. Open `https://google.com`.
3. Enter a search query into the search bar.
4. Wait 5 seconds.
5. Close the browser.

```js
const start = async () => {
    console.log('start');

    const browser = await puppeteer.connect({
        // Replace [HIDDEN_KEY] with your API key.
        browserWSEndpoint: "wss://cdp-lb.axiom.ai/?token=[HIDDEN_KEY]"
    });
    console.log('browser connected');

    try {
        const page = await browser.newPage();
        await page.goto("https://google.com/");

        // Locate the search bar and fill it.
        await page.locator('aria/Search').fill('Testing axiom.ai');

        await new Promise((resolve) => setTimeout(resolve, 5000));

        await page.close();
        await browser.close();
        console.log('browser closed');
    } catch (e) {
        console.error(e.message);
        await browser.close();
    }
};

start();
```

> **Note:** The search bar selector uses Puppeteer's [ARIA selectors](https://pptr.dev/guides/page-interactions#aria-selectors) (`aria/Search`), which match elements by their accessible name. This is more resilient than CSS selectors when a site changes its markup but keeps its accessibility labels.

> **Tip:** This sample is also available in the [Playground](/docs/code-tool/playground). Open the Playground, paste in your API key, and click **Run**. To generate an API key, see [generate an API key](/docs/code-tool/token-generation).