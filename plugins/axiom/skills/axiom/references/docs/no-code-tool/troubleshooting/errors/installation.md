---
title: Installation and uninstallation errors
metaTitle: Fix installation and uninstallation errors in axiom.ai
description: Errors that can appear when installing or uninstalling the axiom.ai Chrome extension or desktop application, and how to resolve them.
order: 1
---

The errors on this page are related to installing or uninstalling the axiom.ai Chrome extension and desktop application.

## A JavaScript error occurred in the main process
***

**Error:** A JavaScript error occurred in the main process.

**Problem:** A long-standing Windows issue when uninstalling Electron applications: the uninstaller occasionally leaves files behind on disk.

**Fix:** Remove the leftover files manually. axiom.ai stores few files on your machine, so this is a quick clean-up. Delete both of these folders, where `<USER>` is your Windows username:

- `C:\Users\<USER>\AppData\Roaming\axiom-desktop`
- `C:\Users\<USER>\AppData\Local\Programs\axiom-desktop`

A search for `axiom-desktop` from File Explorer also shows both folders. If axiom.ai was installed on a drive other than `C:`, adjust the path accordingly.

> **Note:** This issue is specific to Windows. If you see it on macOS or Linux, [contact support](/customer-support).