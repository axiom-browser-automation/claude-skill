---
title: Run scripts
metaTitle: Run Code Tool scripts locally or in the Playground
description: Run Code Tool scripts from your own development environment using Node.js, or test them in the axiom.ai Playground without any local setup.
order: 4
---

There are two ways to run a Code Tool script: from your own local environment, or from the axiom.ai Playground.

## Run a script locally
***

Once your script is connected to axiom.ai (see [create scripts](/docs/code-tool/create-scripts)), run it from your local environment with Node.js.

1. Install Puppeteer in your project:

   ```bash
   npm install puppeteer-core
   ```

2. Save your script. For example, `scrape.js`:

   ```javascript
   const puppeteer = require('puppeteer-core');

   (async () => {
     const browser = await puppeteer.connect({
       browserWSEndpoint: 'wss://cdp-lb.axiom.ai/?token=YOUR_API_KEY'
     });
     const page = await browser.newPage();
     await page.goto('https://axiom.ai');
     console.log(await page.title());
     await browser.close();
   })();
   ```

3. Run it with Node:

   ```bash
   node scrape.js
   ```

The script connects to axiom.ai's hosted browser and runs against it. Sprinkle `console.log()` calls through your script while you're developing so you can monitor progress and catch issues from the terminal.

> **Tip:** To watch the script in action, open [run reports](/docs/code-tool/run-reports) in the dashboard. Each in-progress run has a **Watch** link that opens a live view of the hosted browser.

## Run a script in the Playground
***

The [Playground](/docs/code-tool/playground) lets you run scripts without any local setup, so it's useful for quick experiments and for sharing a script with someone who doesn't have Node.js installed.

1. Open the Playground from the dashboard.
2. Paste the script into the code editor.
3. Click **Run**.
4. Open the browser panel to watch the run.