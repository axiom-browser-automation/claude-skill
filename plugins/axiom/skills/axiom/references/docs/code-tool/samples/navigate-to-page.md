---
title: Navigate to a page
metaTitle: Sample Puppeteer script for navigating to a page
description: Sample Puppeteer script for the axiom.ai Code Tool that connects to the hosted browser, opens a page, waits, and closes the browser cleanly.
order: 1
---

This sample script connects to axiom.ai, opens the axiom.ai homepage, waits 5 seconds, and closes the browser.

What it does:

1. Connect to the axiom.ai hosted browser.
2. Open `https://axiom.ai`.
3. Wait 5 seconds.
4. Close the browser.

```js
console.log('start');

const browser = await puppeteer.connect({
    // Replace [HIDDEN_KEY] with your API key.
    browserWSEndpoint: "wss://cdp-lb.axiom.ai/?token=[HIDDEN_KEY]"
});
console.log('browser connected');

try {
    const page = await browser.newPage();
    await page.goto("https://axiom.ai");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await page.close();
    await browser.close();
    console.log('browser closed');
} catch (e) {
    console.error(e.message);
    await browser.close();
}
```

> **Tip:** This sample is also available in the [Playground](/docs/code-tool/playground). Open the Playground, paste in your API key, and click **Run**. To generate an API key, see [generate an API key](/docs/code-tool/token-generation).