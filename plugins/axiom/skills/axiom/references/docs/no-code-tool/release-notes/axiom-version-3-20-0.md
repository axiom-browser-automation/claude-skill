---
title: Affiliates, smarter queues, overwrite files, and a 4.0 teaser
version: "3.20"
date: 2023-06-21
featuredimg: /releases/axiom-v3-20.png
---

## Introducing axiom.ai affiliates
***

We are pleased to announce our new affiliate system! Now you can sign up as an axiom affiliate at [axiom.ai/affiliates](/affiliate-program) and get a 15% referral fee for anyone you get to sign up to Axiom. Make templates, share them with your friends, and make some money while doing so!

## Queueing system added
***

For those of you who use Axiom as part of wider workflows with Zapier, Make or via API, we've now introduced a queueing system to reduce errors. Whenever the Axiom server is busy or you run over your concurrency limit, the system will now automatically queue up and retry the runs that could not start.

## Run Axiom in Incognito Mode
***

You can now run Axiom in incognito mode. By default, incognito mode does not copy any session data, so it's useful for testing automations that are intended to run as scheduled or via API on our cloud servers.

<img src="/releases/incog-mode-axiom.jpg" alt="axiom.ai Run Axiom in Incognito Mode">

## Use ChatGPT directly from within the "Write Javascript" step
***

You can now utilise our ChatGPT helper function to quickly access OpenAI's ChatGPT API and automatically ouput the response in an Axiom-compatible data format. Find out more [here](/docs/write-javascript#use-chatgpt)
## Docs integrated with phind AI search
***

Thanks to our friends at [phind](https://www.phind.com), we have integrated a search using ChatGPT into our documentation that will provide text-based answers to your questions. The option is always available at the bottom of any search query you make on our docs site.

<img src="/releases/phind.jpg" alt="Docs integrated with phind AI searc">

## Overwrite files instead of renaming
***

When downloading files, the default behaviour of axiom is to rename files that are duplicated. In some cases this is great, but in others it eats up your disk space and makes determining which file you want to use more difficult.

To solve those problems, we've introduced a new option to overwrite files instead of renaming them. This will reduce the number of files on your system and make it very easy to use that file in automations, as the filename will remain static.

<img src="/releases/overwrite-files.jpg" alt="axiom.ai Overwrite files instead of renaming">

## Coming soon - Axiom 4.0
***

We've been hard at work on our next generation of the builder interface, which overhauls the UI and brings new abilities for nesting and combining steps that should streamline the logic of more complex axioms. More info coming soon....

## Minor fixes
***

- Increased maximum size for uploading files to Google Drive (now 250MB)
- Fixing issues where the click confirmation would show even though it didn't work
- Fixing an issue caused by undoing all the way back to 0 steps
- Stopping an axiom should now always work, even if the connection to the server has been lost
- Update to the Google Sheet writing logic to prevent rare errors when accessing the Sheets API
- Line breaks now work in emails
- Auto-update will no longer restart the axiom desktop app if an automation is running, and will wait until it can proceed safely
