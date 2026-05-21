---
title: Structured scraping with chatgpt, new schedule view, filters, and fixes
version: 3.18
date: 2023-04-25
video: https://www.youtube.com/embed/plpKWigqhxs?rel=0&amp
---

::HeroMedia
::

## Extract data with ChatGPT
***

A new step has been added that allows you to use ChatGPT to get structured data from raw text. Think extracting prices, email addresses, phone, numbers, names etc. from any kind of unstructured data - a blog post, product page, document etc.

This is something that is very hard to do with traditional browser automation technology. We're excited to have a path to overcoming this limitation!

<img src="/releases/chatgpt-axiom-step.jpg" alt="axiom.ai and chatGPT integration for scraping data">

All you need is a ChatGPT API key, which can be grabbed for free from OpenAI. This is a beta feature, so it currently has some limitations (for example, it will not work when using the cloud scheduler, only the local scheduler). If you have any feedback, please let us know!

This is the first step in a wider roadmap for ChatGPT integration in Axiom; a potential game-changer for browser automation. For more info, check out this blog post:  [AI Automation - building bots with ChatGPT](/blog/chatgpt-bot-ai-automation). More to come in upcoming releases, stay tuned...

## New Schedule page
***

<img src="/releases/schedule.jpg" alt="new schedule bot page in axiom.ai">

For subscribers at the pro tier or above who can schedule axiom runs, there's now a new Schedules page. Here you can see a timeline of your upcoming schedules and when they last ran, with a link to edit the axiom to which the schedule is attached.

In addition, if you are running local schedules, you can now turn these off on the current computer. This is very useful when you are signed into Axiom on multiple PCs and have local schedules; switching local schedules off on all except 1 PC will allow only that PC to run your axioms, preventing duplication.

## Report filtering
***

The "Reporting" section has been overhauled to include new filters. Now you can search for axiom runs by name, by status, and also select a data to filter by.

<img src="/releases/filter.jpg" alt="new report filtering in axiom.ai">

The main goal here is to help those of you who do a lot of remote triggering or scheduling find and debug failed runs. This is part of our roadmap on making debugging easier and more convient - more to come.

## "Continue if empty" on Google Sheets
***

With automations that read from Google Sheets, we often need to check if the sheet is empty before continuing.

As this is a common operation, a checkbox has been added to the "Read Google Sheet" step. If the sheet contains no data and this box is ticked, the automation will end immediately.

<img src="/releases/continue-sheet.jpg" alt="new report filtering in axiom.ai">

## Go back when automating
***

Sometimes it's useful to go back to the previous page during an automation run. This was handled with a javascript snippet before, but we've now added a step to make this more convenient.

<img src="/releases/go-back.jpg" alt="new go back step in axiom.ai">

## Minor fixes
***

- Updated the icon design across the extension
- Fixed a rare hanging issue when a data variable contained double quotation marks
- Better file name validation
- You can no longer save an automation with no name
- Import template link is now directly accessible from the start screen on the builder
- People who used a different email to subscribe than they did to sign up can now see both emails on the account page. It is also auto-filled when accessing the customer portal.
- Only one run viewer can now be open at a time when running cloud automations; this should fix a number of issues with run viewer connections being interrupted
- The "multiple click" step now has a "Maximum clicks" setting
- Optional click will now ignore the error thrown when the selector happens to find an unclickable element
- Fix for hanging issue on empty code steps
- Fix to result grouping in scraping that would sometimes cause results to be associated with irrelevant data
- New Helium10 template [See here](/guides/helium10)