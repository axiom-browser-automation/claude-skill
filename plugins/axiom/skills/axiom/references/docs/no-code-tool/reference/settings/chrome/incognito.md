---
title: Run in incognito mode
metaTitle: Run an automation in Chrome incognito mode
description: Force axiom.ai to run an automation in a fresh incognito window with no stored cookies, useful when sessions need to start clean.
order: 5
---

Run an automation in incognito mode to start every run in a fresh window with no stored cookies. Useful when sessions need to be clean each time, for example when sign-in cookies from a previous run would interfere.

![The run in incognito mode settings panel in the axiom.ai Builder](/docs/settings/incognito-axiom.ai.jpg)

## Allow incognito mode for the extension
***

The Chrome extension needs explicit permission to run in incognito mode. This is a one-time setup per machine.

1. In Chrome, navigate to `chrome://extensions`.
2. Find the axiom.ai extension and click **Details**.
3. Toggle **Allow in incognito** on.

Without this permission, axiom.ai can't start in an incognito window.

## Enable incognito mode on the automation
***

1. Open the automation and click the **Cog** icon in the toolbar on the left.
2. Open the **Run in incognito mode** section.
3. Toggle `Run in incognito mode` on.