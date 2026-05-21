---
title: Log in using a password manager
metaTitle: Use a password manager to store logins for automations
description: Store passwords in a dedicated password manager or vault and retrieve them at runtime using the axiom.ai webhook or JavaScript step.
order: 3
---

For tighter security than a Google Sheet, store passwords in a dedicated password manager or vault that exposes an API. At runtime, retrieve each password using a webhook or the **Write javascript** step inside the automation, so the password is only ever held in memory for the length of the run.

For other login methods, see [Google Sheet steps](/docs/no-code-tool/how-it-works/login/steps), [sessions](/docs/no-code-tool/how-it-works/login/sessions), [VPS](/docs/no-code-tool/how-it-works/login/vps), [2FA](/docs/no-code-tool/how-it-works/login/2fa), or [secure login](/docs/no-code-tool/how-it-works/login/secure).

## Recommended password managers
***

Any vault that offers an HTTP API works. One example is [HashiCorp Vault](https://www.vaultproject.io).