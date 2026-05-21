---
title: Code Tool
metaTitle: Code Tool — run your scripts on axiom.ai infrastructure
meta:
  - name: description
    content: Run your own Puppeteer scripts on axiom.ai cloud infrastructure. Manage scripts from the Dashboard, run them from your stack, and monitor every execution.
order: 2
---

The Code Tool runs your own Puppeteer scripts on axiom.ai's cloud infrastructure. Use the [Dashboard](/docs/code-tool/dashboard) to create and manage scripts, [run them from your own stack](/docs/code-tool/running-scripts), and [monitor every execution](/docs/code-tool/run-reports).

## Quick start

To get a script running, create an account, then connect to axiom.ai using your API key. New accounts get 3 hours of free runtime.

1. Create an account, log in, and copy your API key from the **Dashboard**.
2. Add the code below to your script and paste in your API key.
3. Open the endpoint URL in your browser to watch the run.

```javascript
const browser = await puppeteer.connect({
  // Insert your API key in place of [HIDDEN_KEY]
  browserWSEndpoint: "wss://cdp-lb.axiom.ai/?token=[HIDDEN_KEY]"
});
const page = await browser.newPage();
await page.setViewport({ width: 1960, height: 1080 });

// Your script here

await page.close();
await browser.close();
```

:::DocsCardGrid{cols=3 gap=6}

  ::DocsImageCard
  ---
  title: "Dashboard"
  text: "Navigate the Code Tool, access Playground and Monitoring runs, and check your remaining runtime."
  link: "/docs/code-tool/dashboard"
  shape: "pyramid"
  mode: "code"
  ---
  ::
  ::DocsImageCard
  ---
  title: "Playground"
  text: "Test and experiment with scripts in the web app and watch them run in real time."
  link: "/docs/code-tool/playground"
  shape: "cube"
  mode: "code"
  ---
  ::

  ::DocsImageCard
  ---
  title: "Create scripts"
  text: "Write Puppeteer scripts locally and connect them to the axiom.ai hosted browser."
  link: "/docs/code-tool/create-scripts"
  shape: "pyramid"
  mode: "code"
  ---
  ::
  ::DocsImageCard
  ---
  title: "Run from code"
  text: "Run scripts from your own development environment or test them in the Playground."
  link: "/docs/code-tool/running-scripts"
  shape: "cube"
  mode: "code"
  ---
  ::

  ::DocsImageCard
  ---
  title: "Monitoring runs"
  text: "See in-progress and completed runs, durations, and results in Run Reports."
  link: "/docs/code-tool/run-reports"
  shape: "pyramid"
  mode: "code"
  ---
  ::
  ::DocsImageCard
  ---
  title: "Keys and API"
  text: "Fetch your API key from the Dashboard and store it securely."
  link: "/docs/developer-hub/api/keys"
  shape: "cube"
  mode: "code"
  ---
  ::
:::