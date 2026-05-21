---
title: Solve captcha
metaTitle: Solve a captcha in an axiom.ai cloud browser session
description: Send the current page's captcha to a third-party solver and submit the result using axiom.solveCaptcha().
order: 18
---

`axiom.solveCaptcha(apiKey)` sends the captcha on the current page to a third-party solver (2Captcha by default), waits for the result, and submits it into the captcha field. The same step type as the No-Code Tool's [**Solve Captcha**](/docs/no-code-tool/reference/steps/solve-captcha).

## Signature
***

```javascript
await axiom.solveCaptcha(apiKey);
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `apiKey` | string | No | API key for the captcha solver. If omitted or empty, the step uses the 2Captcha key stored on your axiom.ai account (set under [API integrations](/docs/no-code-tool/integrations)). |

## Example
***

```javascript
await axiom.goto("https://example.com/login");
await axiom.enterText("#email", "user@example.com");
await axiom.solveCaptcha();                  // uses the stored 2Captcha key
await axiom.click("button[type=submit]");
```

## Notes
***

- Captcha solving is billed by the third-party solver, not by axiom.ai. Your axiom.ai runtime quota covers only the time the session spends waiting for the result.
- The step detects the captcha type on the page (reCAPTCHA v2, hCaptcha, image captchas) and routes it appropriately. If the page's captcha widget loads slowly, insert an [`axiom.wait()`](/docs/developer-hub/api/step-functions/wait) before this step.
- Solver response times vary from a few seconds to a couple of minutes. The library's transparent polling fallback handles requests that exceed the default HTTP timeout — you don't need to do anything special on the client.

## Related
***

- [Click](/docs/developer-hub/api/step-functions/click)
- [Wait](/docs/developer-hub/api/step-functions/wait)
