---
title: Fill a form from a spreadsheet
metaTitle: Fill a web form from a Google Sheet | axiom.ai
description: Read rows from a spreadsheet and, for each row, fill a form on a website.
order: 2
---

A good second bot, once you're comfortable with scraping. You'll read rows from a Google Sheet and, for each row, fill in a form on a website. This is where you meet **Loop** for the first time - the step that repeats work across every row of data.

## What you'll build

***

A bot with four steps:

- **Read data from a Google Sheet** - pulls in the rows.
- **Loop through data** - repeats the next steps once per row.
- Inside the loop: **Go to page**, **Enter text**, **Click element** - the steps that fill the form.
- Optionally, a final **Send an email** or log step to confirm each submission.

## Build the bot

***

1. Add a **Read data from a Google Sheet** step. Point it at the sheet that contains your form data - one row per form submission.
2. Add a **Loop through data** step. Reference the sheet data from step 1 with **Insert Data**. Every step you place inside this loop runs once per row.
3. Inside the loop, add a **Go to page** step pointing at the form.
4. Add an **Enter text** step for each form field. Use **Insert Data** to pull the value from the current loop row.
5. Add a **Click element** step for the submit button.
6. Run the bot. Check the form submissions.

The shape: read data → loop once per row → do the work → repeat.

## Things worth knowing

***

- Loops run steps **once per row** in the data you passed in. Inside the loop, `[sheet-data]` refers to the current row, not all rows.
- Between iterations you may need a **Wait** step - some forms rate-limit fast submissions.
- If a form uses CAPTCHAs, dropdowns that load dynamically, or multi-step wizards, you'll need extra steps. See [Browser actions](/docs/no-code-tool/how-it-works/browser-actions).

## Next

***

- Read the [Loop through data](/docs/no-code-tool/how-it-works/loop-through-data) reference for the loop mechanics.
- Follow a full walkthrough with a template: see the [form-filling guides](/guides) on the Guides site.