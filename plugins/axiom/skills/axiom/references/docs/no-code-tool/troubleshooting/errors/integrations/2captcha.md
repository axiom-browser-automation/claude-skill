---
title: 2Captcha errors
metaTitle: Fix 2Captcha integration errors in axiom.ai
description: Errors that can occur when using the Solve Captcha step with 2Captcha, mostly related to missing or invalid API keys.
order: 3
---

The errors on this page can occur when using the [**Solve Captcha**](/docs/no-code-tool/reference/steps/solve-captcha) step. For background on the integration, see the [2Captcha integration](/docs/no-code-tool/integrations/2captcha) page. For errors returned directly by the 2Captcha API, see the [2Captcha API documentation](https://2captcha.com/2captcha-api).

## Invalid API key
***

**Error:** `2captcha error: ERROR_WRONG_USER_KEY`.

**Problem:** The API key set on the **Solve Captcha** step doesn't match a valid 2Captcha account.

**Fix:** Find your API key on the [2Captcha settings page](https://2captcha.com/setting), copy it in full, and paste it into `API key` on the step.

## Missing API key
***

**Error:** `2Captcha API key: API key is required`.

**Problem:** The **Solve Captcha** step doesn't have an API key set.

**Fix:** Sign up for a [2Captcha account](https://2captcha.com/enterpage?from=23090729) if you don't already have one, then paste your API key into `API key` on the step.

> **Note:** 2Captcha charges a small fee per successfully solved captcha. See [2Captcha's pricing](https://2captcha.com) for current rates.