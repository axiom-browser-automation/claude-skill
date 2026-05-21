---
title: Axiom.ai v4.8
version: "4.8"
date: 2025-10-20
video: https://www.youtube.com/embed/Qy7KfvCqjR4?rel=0&amp;
---

::HeroMedia
::

## Unlimited Desktop concurrency

***

The desktop application now supports unlimited concurrency, allowing for any number of automations to run simultaneously on your local machine, limited only by your computer's resources. Furthermore, users can now individually enable or disable concurrency for specific axioms, for both desktop and cloud runs, giving finer control over resource usage and task execution logic.

<img src="/releases/concurrency-desktop.webp" alt="run unlimited bots on the desktop using axiom.ai">

## Airtable integration

***

We have now integrated axiom with Airtable, providing dedicated steps for both reading and writing data to Airtable bases. This simplifies data exchange with one of the leading no-code database platforms. Users can now seamlessly pull data from Airtable into an axiom or push collected data directly into an Airtable base.

<img src="/releases/run-menu.webp" alt="New run menu dropdown in axiom.ai">


## File read capabilities

***

Axiom.ai can now read a local file (on Desktop) or from Google Drive (on Cloud or Desktop). This new step allows users to read the contents of a specified file (such as a CSV, TXT, or JSON file) directly within an automation. The data read from the file can then be passed to subsequent steps in the bot, such as filters, AI, javascript or anything else you can think of!

<img src="/releases/read-files.webp" alt="Import data from files and pass to subsequent steps in axiom.ai">


## Runtime usage email warnings

***

To help users manage their resources proactively, Axiom will now automatically send email warnings when your runtime usage reaches certain thresholds. You'll receive alerts at 80%, 90%, and 100% of your allocated runtime. These notifications are designed to prevent unexpected interruptions to your automation runs. Users have the flexibility to disable these warnings in the application's options settings if they prefer.

<img src="/releases/runtime-warnings.webp" alt="Get email notifications when your runtime is almost out in axiom.ai">

## New step: Metadata scraping

***

A dedicated step has been added for scraping metadata from any web page. This feature provides a targeted way to extract valuable information typically found in the `<head>` section of a webpage's HTML, such as the page title, description, keywords, or Open Graph tags. The step is configurable, allowing you to specify which metadata attributes you want to collect.

<img src="/releases/scrape-meta.webp" alt="extract meta data from web pages in axiom.ai">


## Cloud Bot Bypass enabled

***

Cloud bots are now able to bypass certain bot detection mechanisms, as on Desktop. This new feature provides an option to run automations in the cloud with configurations that are more resilient to anti-bot measures, potentially allowing for more reliable and successful runs on websites with sophisticated bot protection.

<img src="/releases/cloudflare-bypass-cloud.webp" alt="bypass cloudflare on the desktop and in the cloud using axiom.ai">


## Minor Fixes

* Tasks now no longer incorrectly remain stuck "In Progress" if they have failed but could not update the server with the failure state
* Prevented axiom application from crashing if internet disconnects during a run
* Fixed rare cases of filename collisions when two axioms are running concurrently in the same environment
* Fixed issue where switching filters on run reports while loading caused incorrect results
* Fixed occasional issue where previous selector entries would be incorrectly cleared when opening the selector tool
* Fixed issue where changing folders during task loading on the dashboard resulted in incorrect data
* Added Gemini as an AI provider
* Fixed issues where screenshots would occasionally fire before the canvas had completed rendering
* Fixed an issue where when removing a step, the preview was not entirely deleted
* Fixed clicking '+Filter' in the output preview occasionally failed to open the Step Finder
* Fixed issue with HTML passed to the Integrate AI step causing the axiom to stop
* Fixed rare issue where a duplicate schedule could be created, resulting in double axiom runs
* Wildcards improved when blocking resources
* Fixed issue where current date and time widget was ignoring the "use local timezone" setting
* MIME type can be optionally forced for file downloads to work around issues where the correct file extension is not present in a download URL
* Improved API key display