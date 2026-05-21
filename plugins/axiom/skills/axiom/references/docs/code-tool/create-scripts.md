---
title: Create scripts
metaTitle: Write Puppeteer scripts and connect them to axiom.ai
description: Write Puppeteer scripts in your local environment and connect them to axiom.ai's hosted browser using your API key.
order: 3
---

Write Puppeteer scripts in your own local environment, then connect them to axiom.ai's hosted browser through a single WebSocket endpoint. This lets you develop and version scripts however you like (your editor, your linters, your AI tooling) and run them on infrastructure that doesn't need any local browser setup.

## Set up Puppeteer locally
***

Write your script the same way you would with Puppeteer anywhere else. If you're running locally, install Puppeteer in your project:

```bash
npm i puppeteer
```

> **Note:** If you're testing in the [Playground](/docs/code-tool/playground), you don't need to install Puppeteer. The Playground includes it by default.

## Connect to axiom.ai
***

Use `puppeteer.connect` with axiom.ai's WebSocket endpoint. Generate your API key first; see [generate an API key](/docs/code-tool/token-generation).

```js
const browser = await puppeteer.connect({
    browserWSEndpoint: "wss://cdp-lb.axiom.ai/?token=API_TOKEN"
});
```

Replace `API_TOKEN` with your API key.

## Worked example
***

Connect to axiom.ai before any other Puppeteer browser interactions. The script below opens `https://axiom.ai`, waits 5 seconds, and closes the browser:

```js
console.log("start");

const browser = await puppeteer.connect({
    // Replace API_TOKEN with your API key.
    browserWSEndpoint: "wss://cdp-lb.axiom.ai/?token=API_TOKEN"
});
console.log("browser connected");

try {
    const page = await browser.newPage();
    await page.goto("https://axiom.ai");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await page.close();
    await browser.close();
    console.log("browser closed");
} catch (e) {
    console.error(e.message);
    await browser.close();
}
```

> **Tip:** Wrap browser interactions in a `try...catch` block (as shown above) and call `browser.close()` from the catch path. Without this, a failed run can leave the hosted browser open and counting against your runtime allowance until it times out.