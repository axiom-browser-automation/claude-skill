---
title: Stop a running automation
date: 
description: Best practices for building automations that run reliably over long periods.
order: 2
---

When scheduling bots, or running bots via Webhook, Zapier or Integromat, you may find multiple bots start simultaneously and you need to stop these.

## Stop bots using the extension
***

We automatically track remote-running bots and allow you to stop them within the extension.

Any running bot will be indicated from the axiom.ai dashboard, and you can click the "Stop" button to stop it at any time.

## Stop bots via API
***

When you trigger axiom.ai via the API, you'll be sent a URL to visit, which will contain the following pattern:

```php
c-00$POD-v4-proxy.axiom.ai&port=443&password=$PASSWORD
```

Note down the `$POD` and the `$PASSWORD` in the URL you are sent. 

To stop a bot at the URL you've been given, visit the following URL:

```php
lar.axiom.ai/api/v3/stop?pid=$POD&pw=$PASSWORD
```
You should see:
```php
{"stopped":"$POD"}
```

If you are unable to use the methods above to stop your bots, please email support@axiom.ai and we'll handle it.