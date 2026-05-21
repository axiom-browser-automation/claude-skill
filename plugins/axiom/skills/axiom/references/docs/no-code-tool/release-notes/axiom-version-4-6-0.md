---
title: Excel steps, folder sorting, GPT-4o smarts, end loop control, quick filters, and more
version: "4.6"
date: 2025-03-24
video: https://www.youtube.com/embed/v_FLqUB7yI4?rel=0&amp;
---



::HeroMedia
::

## Excel read and write steps

***

We've expanded our integrations by introducing Excel read and write steps. Similar to our existing Google Sheets steps, these new Excel steps allow you to automate data extraction and input within Excel spreadsheets. This feature brings greater flexibility for those of you who prefer to work with Microsoft Excel files instead of Google Sheets.  

<img src="/releases/ms-excel.webp" alt="New to axiom.ai read and write to Excel by Microsoft">


## Axiom listings - sort with folders

***

Axiom listings now support sorting your automations by adding them to a folder, allowing you to better organize and manage your automation workflows. This enhancement should make it easier to find and access the automations you need.  

<img src="/releases/folders.webp" alt="New to axiom.ai sort your automations into folders">


## End Loop step

***

A new "End Loop" step has been added, providing better control over loop execution. This step allows you to explicitly terminate a loop under specific conditions, preventing unnecessary iterations and improving automation performance.  

<img src="/releases/end-run.webp" alt="New to axiom.ai end loop step">


## Integration of GPT-4o and GPT-4o mini models

***

We've upgraded our AI capabilities by integrating OpenAI's latest GPT-4o and GPT-4o Mini models. These models provide faster and more accurate text processing for AI-driven automation steps, enhancing data extraction, content generation, and decision-making workflows.  

<img src="/releases/chatgpt-models.webp" alt="Latest models for ChatGPT">


## New "+ Filter" button for data preview

***

To enhance data management, we've added a "+ Filter" button to the data preview interface. This acts as a quick shortcut to add data filtering steps to your automations, hopefully speeding up the building process.

<img src="/releases/filters-preview.webp" alt="New to axiom.ai open filters from data preview">


## Predicted runtime usage warning

***

We've introduced a new feature that predicts runtime usage for automations and warns you if you will run out of runtime in the next week, before your runtime is topped up. This should help you avoid situations where your runtime expires and your automations start failing!

## Minor fixes

***

- Improved in-app messaging and support for Google Sheets token expiry
- Added a link to a dedicated troubleshooting page for the "failed to start" error 
- Added the ability to close in-extension documentation
- Improved text clarity for Google Sheets grant permission and required step
- More than 10 URLs can now be displayed on the stored cookies tab  
- Fixed an issue where the add new step shortcut interrupted the javascript input box
- Ensured new scrape page data buttons only appear on scrapers and not on unrelated UI elements  
- Reworked instructions for the "Solve Captcha" step for better clarity 
- Fixed an issue where the "Extract data with ChatGPT" input box was too small
- Corrected an incorrect link in bot detection bypass settings
- Changing the column type in the selector tool now also switches column 
- Fixed an issue where clearing token text boxes occasionally left behind a `<br>` tag  
- Fixed an error that prevented automation imports when they contained a "Remove Duplicates" step  
- Resolved display issues with step titles and token displays when nested inside loops

## Known issues

***

When updating the desktop application, there may be instances where you receive an error. If you experience an error while the application is updating, quit the application and reopen it and the update should complete as expected - we have already fixed this issue for later releases.

