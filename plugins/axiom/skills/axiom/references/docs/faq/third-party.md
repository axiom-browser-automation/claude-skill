---
title: Third-party tools FAQ
metaTitle: Common questions about axiom.ai with third-party tools
description: Answers to common questions about using axiom.ai with third-party services, including Slack, that have specific browser or platform restrictions.
order: 5
---

## Can I use axiom.ai to automate Slack?
***

Yes, but only on the desktop. Slack blocks Chromium, which is the browser axiom.ai uses by default both locally and in the cloud. To automate Slack, run the automation on the desktop pointed at your local Chrome installation. See [set executable path](/docs/no-code-tool/reference/settings/chrome/executable-path) for the setup.

> **Note:** This isn't currently possible in the cloud. The cloud runner uses Chromium and the browser can't be swapped.