---
title: Get current bot URL step
description: Fetch URL from the active tab during a bot run. Return it for use in your automation.
category: Interact
icon: WidgetDriverCurrentUrl.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=1864&end=1885?rel=0"}
::

## What to use the Get current bot URL step for
***

Use this step to Grab the URL that bot is currently on and store it as data for later use. This step is helpful because not all links can be scraped from the source. Using this step in combination with others like ['Click element'](/docs/no-code-tool/reference/steps/click-element), you can make a bot to click links and open pages, so you can grab the URL and write it to a ['Google Sheet.'](/docs/no-code-tool/reference/steps/write-data-to-a-google-sheet-step)
You can use this step to:

- Get the URL from current page
- When a link cannot be scraped use a 'Click element' step then 'Get current bot URL' step

## How to configure the Get current bot URL step
***

### Get current bot URL

No configuration is required. This Step will return a token containing the URL of the current page.
