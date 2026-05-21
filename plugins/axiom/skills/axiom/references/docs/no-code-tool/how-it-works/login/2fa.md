---
title: Log in with 2FA
metaTitle: Run automations on sites that require two-factor authentication
description: Run an automation on a site that requires two-factor authentication using the desktop app or a private VPS.
order: 5
---

When two-factor authentication (2FA) is required, the automation has to be supervised at the start of the run so a human can enter the 2FA code. This is known as attended automation, and it requires running on the desktop app or on the axiom.ai VPS.

For other login methods, see [Google Sheet steps](/docs/no-code-tool/how-it-works/login/steps), [sessions](/docs/no-code-tool/how-it-works/login/sessions), [VPS](/docs/no-code-tool/how-it-works/login/vps), [password managers](/docs/no-code-tool/how-it-works/login/password-manager), or [secure login](/docs/no-code-tool/how-it-works/login/secure).

## Run an automation with 2FA
***

A 2FA login can only be completed by a person, since for security reasons you can't interact with the cloud browser. Run the automation in the desktop app or on the VPS (available on Ultimate plans), then add a **Wait** step before the 2FA prompt to give yourself time to enter the code manually.

## 2FA in the cloud or via webhook
***

You can't currently use 2FA when running automations in the cloud or triggering them via a webhook (for example from Zapier). The only workaround is to disable 2FA on the account.

> **Warning:** If you disable 2FA, use a dedicated account with restricted permissions, set up specifically for axiom.ai. Don't disable 2FA on your main account.