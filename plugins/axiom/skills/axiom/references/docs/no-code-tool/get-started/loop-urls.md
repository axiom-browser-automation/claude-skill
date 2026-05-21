---
title: Loop through a list of URLs
metaTitle: Loop through URLs with browser automation | axiom.ai
description: Start with a list of URLs, visit each one, and do something on every page.
order: 3
---

When the thing you're automating needs to happen on lots of pages, not one. You'll pass in a list of URLs, visit each one, and run the same actions on every page. Useful for product-page scraping, bulk screenshots, and any "do this thing 200 times" task.

## What you'll build

***

A bot with three or four steps:

- A data source - a **Google Sheet**, a **CSV**, or a **Get a list of links from a URL** scrape.
- **Loop through data** - repeats the next steps once per URL.
- Inside the loop: **Go to page** - opens each URL.
- Inside the loop: whatever you want the bot to do on each page.

## Build the bot

***

1. Get your URLs into a step. The three usual sources:
    - A **Read data from a Google Sheet** step pointing at a column of URLs.
    - An **Import CSV file** step if the URLs live in a CSV.
    - A **Get a list of links from a URL** step if you want to scrape the URLs off a listing page first.
2. Add a **Loop through data** step. Reference the URL data with **Insert Data**.
3. Inside the loop, add a **Go to page** step. Insert the current loop value as the URL - this is what makes the bot visit a different page each iteration.
4. Add whatever steps should run on each page - scrape, click, fill, screenshot - below the **Go to page** step, still inside the loop.
5. Run the bot and watch it work through the list.

The shape: get URLs → loop once per URL → go to that URL → do the work.

## Things worth knowing

***

- The whole job of the **Go to page** step inside a loop is to use the _current_ URL, not the first or last one. Always use **Insert Data** to reference the loop row, never paste a hard-coded URL.
- Lots of sites rate-limit or detect bots when hit in quick succession. A **Wait** step inside the loop is usually a good idea.
- If any single URL fails, the whole loop stops. Wrap the page work in a **Try / Catch** if you'd rather skip bad URLs and keep going.

## Next

***

- [Loop through data](/docs/no-code-tool/how-it-works/loop-through-data) reference covers the loop mechanics.
- [Try / Catch](/docs/no-code-tool/reference/steps/try-catch) for handling failures mid-loop.
- Full walkthroughs with templates: [browser automation guides](/guides).