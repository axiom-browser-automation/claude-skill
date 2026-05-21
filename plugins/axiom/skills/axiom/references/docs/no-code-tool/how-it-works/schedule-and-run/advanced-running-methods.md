---
title: Advanced running methods
date: 
description: Run multiple automations concurrently, trigger from Zapier, or run Axiom across multiple computers.
order: 5
---

Learn advanced methods for running your automation, such as running across multiple computers or using an API. If you are a beginner getting started and unsure how to run an automation, [click here.](/docs/run)
## Run multiple bots at once locally
***

To run multiple bots simultaneously, you can set up multiple installs of the desktop application. The standard way to do this is to use multiple computers or virtual machines, install axiom.ai on each of them, and run the desired bots from there.

If you are using local scheduling to run multiple bots, you will additionally need to set up multiple accounts. Only if the bots are being run manually will you be able to run multiple bots at the same time with a single account.

### How to run multiple instances of the same automation

Each individual bot can only have one instance of itself running. This means you can run multiple different bots at the same time, but you cannot run multiple instances of the same bot at the same time.

If you need this functionality, then you should duplicate the bot you wish to run concurrently. You can do this using the "Save as duplicate" feature, which you can find in the menu at the top of the builder.

Create as many duplicates as you need concurrency. Each duplicate will be a separate item and so will be able to run concurrently along with the other duplicates.

## Run multiple bots at once on cloud (concurrency)
***

Subscribers at the Pro Max tier and higher are allowed to run multiple bots at once on our cloud infrastructure. This applies to manual runs, Zapier and Make connections, API calls and cloud scheduling runs.

## Use Incognito mode, or use axiom.ai on local file URLs
***

By default, axiom.ai does not have permission to run in Incognito Mode, or access local HTML files.

To let axiom.ai run Incognito, or on local files:

::tutorial
    1. Type in `chrome://extensions` in your browser. 
    2. Click on `Details`.
        <img src="/releases/chrome-extensions.png"/>
    3. Toggle to `Allow in Incognito`, or `Allow access to file URLs`:
        <img src="/releases/chrome-permissions.png"/>
::    
    
## Run a headless automation
***

To run an automation in headless mode, in the builder, click the kebab menu at the top right, then click "Settings". Then, under "Run options", click "Run Headless" and toggle the setting to 'on'. Read more about headless mode here.
    
## Run an automation from Zapier
***

Trigger an automation from Zapier, please see [Working with Zapier and Webhooks](/docs/no-code-tool/integrations/zapier)
## Run an automation via API
***

To learn how to run an automation via API, please see [Webhook &  API Documentation](/docs/developer-hub/api)
## Run an automation using Make
***

To learn how to run an automation via Make, please see [Working with Make and webhooks](/docs/no-code-tool/integrations/make)