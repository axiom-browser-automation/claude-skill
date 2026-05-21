---
title: Set executable path
metaTitle: Run automations in your local Chrome instead of Chromium
description: Point axiom.ai at your local Chrome installation so automations run in Chrome instead of the built-in Chromium browser.
order: 2
---

By default, axiom.ai runs automations in a built-in Chromium window. Set an executable path to use your local Chrome installation instead. This can help with sites that detect or behave differently in Chromium.

![The set executable path settings panel in the axiom.ai Builder](/docs/settings/path-axiom.ai.jpg)

## Set the executable path
***

1. Open a new tab in Chrome.
2. Navigate to `chrome://version`.
3. Copy the **Executable path** value.
4. In the automation, click the **Cog** icon, open the **Set executable path** section, and paste the path into `Executable path`.

The path looks similar to these examples:

- **Windows**: `C:\Program Files\Google\Chrome\Application\chrome.exe`
- **macOS**: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- **Linux**: `/usr/bin/google-chrome`