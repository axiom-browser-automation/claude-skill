---
title: Solve a captcha
metaTitle: Solve captchas inside an automation with 2Captcha or manually
description: Solve reCAPTCHA and similar challenges using the 2Captcha integration, manual interaction, or anti-bot blocking settings.
video: https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=842&end=870
order: 7
---

There are three ways to handle a captcha during an automation: solve it automatically through the [2Captcha integration](/docs/no-code-tool/integrations/2captcha), solve it manually using the desktop app, or avoid triggering it by enabling anti-bot blocking.

::HeroMedia
::

## Solve a captcha with 2Captcha
***

Use the [**Solve Captcha**](/docs/no-code-tool/integrations/2captcha) step to solve captchas automatically. You'll need a 2Captcha account, and there's a small per-captcha charge.

1. Sign up for a [2Captcha account](https://2captcha.com/enterpage?from=23090729).
2. Open the step finder, search for **solve**, and add the **Solve Captcha** step.
3. Enter your 2Captcha API key in the step.

The integration supports reCAPTCHA v2, reCAPTCHA v3, and invisible reCAPTCHA. For more, see the [2Captcha integration docs](/docs/no-code-tool/integrations/2captcha).

## Solve a captcha manually
***

When running on the [desktop app](/docs/install#installing-the-desktop-app-optional), you can interact with the browser during a run. This is called attended automation. Add a **Wait** step before the captcha so you have time to solve it manually before the automation continues.

## Avoid captchas with anti-bot blocking
***

The [bot blocking](/docs/no-code-tool/reference/settings/chrome/bypass-bot-detection) setting can stop captchas from appearing in the first place. If a captcha is triggered every run, try enabling anti-bot blocking before reaching for one of the methods above.