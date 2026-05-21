---
title: Restart browser
category: Interact
description: Learn how to use the Restart browser step in your Axiom
icon: WidgetRestartBrowser.svg
---

## What to use the Restart browser step for

---

Use this step to restart your browser on long or resource heavy automations to prevent the browser from running into memory issues. This behaves similar to pressing F5 to refresh the page during your run.

We recommend only using this if you are encountering memory issues within the browser as improper use can lead to your automation taking longer, or causing additional errors in your run. 

There may be instances where page state, such as the page you are currently viewing in a list, may be stored in JavaScript - in these instances, this state will not be maintained. Page start stored as a URL component will be maintained, for example: "example.com/list?page=2".

## How to configure this step

---

This step does not have any configuration options.