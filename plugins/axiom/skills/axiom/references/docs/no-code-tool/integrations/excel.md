---
title: Microsoft Excel
metaTitle: Read and write Microsoft Excel sheets in axiom.ai
description: Connect a Microsoft work or school account to axiom.ai to read data from and write data to Excel sheets in your automations.
order: 8
---

Connect Microsoft Excel to axiom.ai to read data into your automations and write results back. The integration uses Microsoft's Graph API and currently requires a work or school Microsoft account.

## Connect a Microsoft account
***

> **Important:** A work or school Microsoft account is required. Microsoft's API restricts file availability for personal Microsoft accounts.

![The Credentials and API key screen in axiom.ai with the Connect Microsoft button highlighted](/docs/tutorials/credentials-and-api-key-screen.png)

1. Open axiom.ai.
2. Navigate to **Credentials and API key**.
3. In the **Microsoft** section, click **Connect Microsoft**.
4. Follow the on-screen instructions to sign in.

## Disconnect a Microsoft account
***

![The Credentials and API key screen with the Disconnect Microsoft button highlighted](/docs/tutorials/disconnect-microsoft.png)

1. Open axiom.ai.
2. Navigate to **Credentials and API key**.
3. In the **Microsoft** section, click **Disconnect Microsoft**.
4. Follow the on-screen instructions.

## Excel steps
***

Two steps are available once Microsoft is connected:

- [**Read data from Excel**](/docs/no-code-tool/reference/steps/read-data-from-excel)
- [**Write data to an Excel sheet**](/docs/no-code-tool/reference/steps/write-data-to-an-excel-sheet)

## Microsoft token expiry
***

When you connect Microsoft to axiom.ai, axiom.ai stores a token from Microsoft instead of your password. Microsoft sometimes expires these tokens with no notice.

This is controlled entirely by Microsoft. The most common pattern we've seen is high-frequency reads and writes triggering the expiry. If your token expires often, consider running the automation less frequently.