---
title: Scrape faster, set keys once, skip steps, end runs early, and more
version: "4.5"
date: 2024-12-02
canonicalUrl: /release-notes/
featuredimg: 
video: https://www.youtube.com/embed/-blOwL8bALE?rel=0&amp;
---

<div class="responsive-video docs">
<iframe src="https://www.youtube.com/embed/-blOwL8bALE?rel=0&amp;" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>


## Quick select options added to the scraper

***

You can now use a shortcut button to select either all page HTML, or all page text with a single click. This is helpful when combined with ChatGPT data extraction, and also lets multiple different layouts of pages be scraped more easily.

<img src="/releases/quick-select.webp" alt="Scrape all HTML or text from the webpage with axiom.ai's new quick select settings in the get data step.">

## New API key management interface

***

For [OpenAI](/docs/no-code-tool/integrations/chatgpt) and [2Captcha](/docs/no-code-tool/integrations/2captcha) keys, there is now a dedicated place these keys are stored globally so that you do not have to re-enter the same key in multiple automations. You can still override the default key with a different value, if you'd like.

<img src="/releases/chat-gpt-api-key.webp" alt="store chatgpt api key globabbly">

## Update status now displayed on desktop application

***

Previously, the desktop application would automatically update in the background with limited messaging. Now, the desktop splash screen will display a message about what state it's in and what it's doing.

## Improved "Receive data from another app" step

***

With new [API guides](/docs/developer-hub/api), improved documentation and a much cleaner design, we hope this step now should be a lot easier to understand and use for those triggering an automation from other systems.

<img src="/releases/recieve-data-step-redesign.webp" alt="New design for Recieve data from another app step">

## Optional enter text step

***

Just as with clicks, you can now set [enter text](/docs/no-code-tool/reference/steps/enter-text) steps to be optional. Useful if you have fields that don't always appear in a form, and you don't want them to raise an error.

<img src="/releases/enter-text.webp" alt="Enter text step, set to optional.">


## Open axiom.ai with the keyboard

***

As part of the ongoing push to incorporate more keyboard shortcuts, the axiom.ai [builder](/docs/no-code-tool/the-builder/builder can now be opened using a Chrome shortcut. By default, this is set to Alt + Shift + X on Windows and Linux, and Option + Shift + X on OSX. This is a default, and can be configured as you please.


## New "End Run" step

***

Adding this step will end the run immediately - use it inside an [if statement](/docs/no-code-tool/how-it-works/logic#run-a-set-of-steps-depending-on-an-if-condition) to save on runtime!

<img src="/releases/end-run-step.webp" alt="New end bot run step">

## Minor fixes

***

- Messaging for Google Docs / Sheets auth flow improved when authentication fails
- Error message made more obvious when axiom.ai login failed
- Fixed issues where hanging automation would ignore the user's runtime limit setting
- Improved [error message](/docs/no-code-tool/troubleshooting/errors/) when trying to run in cloud with bot blocking on
- Removed dependency on Google Drive API in the spreadsheet picker interface
- Improved authentication handling between Google Drive and Google Sheets
- Fixed an issue where the CSV download and Display Message steps did not trigger during locally scheduled runs
- New write CSV step that works much more like the Download File step. The old step is deprecated but will still work on existing automations.
- Fixed the selector tool vanishing on some pages
- Improved reliability of run state tracking in the extension
- [Proxies](/docs/no-code-tool/reference/settings/run-options/proxy) can now be used when bot detection bypassing is switched on
- Made it more clear that local schedules can run every minute, on all tiers
- Fixed some inconsistencies in the naming of [Google Sheet](/docs/no-code-tool/integrations/google-sheets) steps