---
title: Generate an API key
metaTitle: Generate and manage your axiom.ai Code Tool API key
description: Generate the API key used to authenticate Code Tool scripts to axiom.ai's hosted browser, with guidance on storing it securely.
order: 6
---

Every Code Tool script needs an API key to authenticate to axiom.ai's hosted browser. Generate the key once and reuse it across your scripts.

## Generate an API key
***

1. In the Code Tool dashboard, navigate to **Settings** > **API key**.
2. Click **Create API key**.
3. Wait a few seconds while the key is generated.
4. Copy the key and store it securely.

> **Warning:** The key is shown once and can't be retrieved again. If you lose it, you'll need to generate a new one. We recommend storing it in a password manager or environment variable file before closing the dialog.

For an example of using the API key in a Puppeteer script, see [create scripts](/docs/code-tool/create-scripts#connect-to-axiom-ai).