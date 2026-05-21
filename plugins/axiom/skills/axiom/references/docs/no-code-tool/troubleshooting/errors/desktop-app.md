---
title: Desktop app errors
metaTitle: Fix errors with the axiom.ai desktop application
description: Errors that can occur with the axiom.ai desktop application, including port conflicts that prevent the app from starting.
order: 4
---

The errors on this page can occur when running or debugging automations through the axiom.ai desktop application.

## Port 3333 in use
***

**Error:** Port 3333 in use.

**Problem:** The desktop app uses port 3333 to communicate with the Chrome extension. If another application is already bound to that port, or if a second instance of the desktop app is running, the app can't start.

Common causes:

- Another desktop application is using port 3333.
- A second instance of the axiom.ai desktop app is already running.
- A previous axiom.ai process didn't shut down cleanly and is still holding the port.
- A firewall, antivirus, or system-level process is blocking the port.

**Fix:** Work through these in order:

1. Quit and reopen the axiom.ai desktop app.
2. Check whether a second instance of the desktop app is running and quit it.
3. If the issue persists, restart your computer to release any hung processes.

If the error continues after a restart, [contact support](/customer-support) with details of any other applications you suspect may be using port 3333.

## Browser could not be started
***

**Error:** Browser could not be started. This may be an incompatibility between the axiom.ai desktop application and your operating system. Please contact `support@axiom.ai` and let us know about the issue. This error can also occur on Mac if you have tried to load a missing or broken extension.

**Problem:** This error has several possible causes:

- An incompatibility between the desktop app and your operating system.
- A `Set executable path` setting pointing at the wrong Chrome executable.
- A `Load another extension` setting pointing at a missing or broken extension.
- A hanging axiom.ai process on your machine.

**Fix:** Work through these in order:

1. Make sure your operating system is up to date. Older OS versions may not be compatible.
2. Verify the Chrome path. See [set executable path](/docs/no-code-tool/reference/settings/chrome/executable-path).
3. Verify any loaded extension is installed and the path is correct. See [load another extension](/docs/no-code-tool/reference/settings/chrome/load-extension).
4. Restart your computer to clear any hanging processes.

