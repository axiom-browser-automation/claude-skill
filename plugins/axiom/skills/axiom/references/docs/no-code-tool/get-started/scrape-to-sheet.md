---
title: Scrape a page into a Google Sheet
metaTitle: Scrape a webpage into a Google Sheet | axiom.ai
description: Pull structured data off any webpage and write it straight to a Google Sheet in five steps.
order: 1
---

A good first bot. You'll scrape a table or list off a page and write every row into a Google Sheet. By the end you'll understand how data flows from one step to another in axiom.ai - the mental model that underpins every bot you build after this.

## What you'll build

***

A bot with three steps:

- **Get data from a URL** - scrapes the page.
- **Write data to a Google Sheet** - saves each scraped row.
- Optionally, a scheduler so the bot runs every hour, day, or week.

## Build the bot

***

1. Add a **Get data from a URL** step. Enter the URL of the page you want to scrape, then use the selector tool to click on the data. Axiom auto-detects repeating rows.
2. Connect your Google account and add a **Write data to a Google Sheet** step. Point it at a sheet.
3. In the sheet step, use the **Insert Data** button to reference the scraped data from step 1. Pick which columns you want written.
4. Click **Run** to test. Check the sheet.
5. If it works, schedule the bot to run automatically.

That's the whole shape. Scrape data → reference it in the next step → write it out.

## Things worth knowing

***

- Scraped data is returned as a **2D array** (rows and columns). Every step that reads data from another step reads it in this shape.
- The selector tool looks for repeating patterns. Click one item and the bot finds the rest. Click a second example if the first click doesn't capture everything.
- If the page loads slowly, the **Configure scraper** settings on the scrape step let you add wait time. Worth knowing if you see missing rows.

## Next

***

- Read the full [Scrape data](/docs/no-code-tool/how-it-works/scrape-data) reference for every scraper option.
- Follow the full guide with a downloadable template: [How to scrape links to a Google Sheet](/guides) on the Guides site.