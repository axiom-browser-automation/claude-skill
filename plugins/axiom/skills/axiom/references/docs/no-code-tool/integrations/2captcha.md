---
title: 2Captcha
metaTitle: Solve captchas in an automation with the 2Captcha integration
description: Use the Solve Captcha step to outsource reCAPTCHA challenges to 2Captcha, with optional support for other captcha types via JavaScript.
order: 4
---

axiom.ai integrates with [2Captcha](https://2captcha.com/enterpage?from=23090729), a captcha-solving service. Use the [**Solve Captcha**](/docs/no-code-tool/reference/steps/solve-captcha) step in your automation, and 2Captcha handles the challenge in the background.

## Sign up for 2Captcha
***

Register for a 2Captcha account at [2captcha.com](https://2captcha.com/enterpage?from=23090729). 2Captcha only charges for successfully solved captchas, and each captcha typically takes 30–60 seconds to solve since the work is done by humans.

> **Note:** The service can fail on custom captcha implementations or when 2Captcha returns an incorrect answer. Plan your automation so it can recover from a failed solve.

## Use the Solve Captcha step
***

Add the **Solve Captcha** step in your automation. It supports these captcha types:

- reCAPTCHA v2
- reCAPTCHA v3

If a captcha doesn't appear when the step runs, the step takes no action and the automation continues. This makes it safe to use for captchas that only appear sometimes.

1. Open the step finder, search for **solve**, and add the **Solve Captcha** step.
2. Enter your 2Captcha API key, available on the [2Captcha settings page](https://2captcha.com/setting).

## Solve other captcha types with JavaScript
***

For captcha types not supported by the **Solve Captcha** step (for example, image-to-text captchas), call the [2Captcha API](https://2captcha.com/api-docs) directly from a [**Write javascript**](/docs/no-code-tool/reference/steps/write-javascript) step.

The example below uses the [Puppeteer API](/docs/no-code-tool/integrations/puppeteer) to screenshot the captcha image, sends the screenshot to 2Captcha as base64, then polls until the solution is ready. The script returns the solved text, which you can pass to an [**Enter text**](/docs/no-code-tool/reference/steps/enter-text) step to fill the field.

```js
const apiKey = 'XXX'; // Your 2Captcha API key
const ele = await page.$('#captcha_image'); // Selector for the captcha image

const base64 = await ele.screenshot({ encoding: 'base64' });
const delay = ms => new Promise(res => setTimeout(res, ms));

let options = {
  clientKey: apiKey,
  task: {
    type: 'ImageToTextTask',
    body: base64,
    case: true,
  },
  languagePool: 'en',
};

let postData = { method: 'POST', body: JSON.stringify(options) };
let response = await fetch('https://api.2captcha.com/createTask', postData);
let json = await response.json();
const taskId = json.taskId;

// Poll for the result every 20 seconds.
do {
  await delay(20000);
  postData = { method: 'POST', body: JSON.stringify({ clientKey: apiKey, taskId }) };
  response = await fetch('https://api.2captcha.com/getTaskResult', postData);
  json = await response.json();
} while (json.status && json.status === 'processing');

return [[json.solution.text]];
```

[Sign up for 2Captcha](https://2captcha.com/enterpage?from=23090729) to get started.