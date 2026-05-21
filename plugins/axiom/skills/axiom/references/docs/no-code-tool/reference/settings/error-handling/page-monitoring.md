---
title: Disable page monitoring
metaTitle: Disable page-load monitoring to speed up an automation
description: Disable page monitoring so axiom.ai stops waiting for page changes between steps, useful when monitoring slows automations significantly.
order: 3
---

By default, axiom.ai watches the page for changes and only continues to the next step once the page has finished loading. This makes automations more reliable, but in rare cases it can slow them down significantly. Disable page monitoring when you've confirmed the wait is unnecessary and the automation is being held back by it.

> **Warning:** Disabling page monitoring can make an automation less reliable. Test thoroughly after changing this setting; if a page is still loading when the next step runs, that step may fail or pick up incomplete data.

![The Disable page monitoring settings panel in the axiom.ai Builder](/docs/settings/monitoring-axiom.ai.jpg)

## Disable page monitoring
***

1. Open the automation and click the **Cog** icon in the toolbar on the left.
2. Open the **Disable page monitoring** section under **Error handling**.
3. Toggle `Disable page monitoring` on.