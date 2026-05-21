---
title: Integrate AI
metaTitle: Integrate AI into a browser automation
description: Pass data to Claude, ChatGPT, or another LLM inside an automation to extract structured fields or generate new content.
order: 7
---

Use the **Integrate AI** step to plug a large language model into your automation. Pass in data from an earlier step and either extract structured fields from it or generate new content. The result is returned as data that any later step can use.

## Add the step
***

Open the step finder and add **Integrate AI**.

## Pick a function
***

Use the `Function` toggle at the top of the step to choose what the model does with your data: **Extract data** or **Generate data**. Your choice changes what the prompt area below looks like.

## Choose a model
***

Pick an LLM provider from the `LLM` dropdown. Supported providers include Claude and ChatGPT. You'll need an API key for the provider you choose.

## Write the prompt
***

Reference data from an earlier step with the **Insert data** button, or pick a built-in template from the template dropdown. What you enter depends on the function you picked.

### Extract data

Give the model a comma-separated list of items to extract. The step returns each item as its own column.

**Example**: You scrape a page of job listings as a single block of text. Pass it into **Integrate AI** and ask for `job title, company, salary, location`. The step returns a row with those four columns, ready to write to a Google Sheet.

### Generate data

Write a free-form prompt describing what you want the model to produce. Use the **Insert data** button to drop in tokens that reference data from previous steps. The tokens are replaced with real values when the automation runs. The step returns the generated text.

**Example**: A previous **Scrape data** step pulls a list of new customer sign-ups, with columns for name and product. Inside a loop over that data, you pass those columns into **Integrate AI** with a prompt like:

`Write a short welcome email to [scrape-data?all&0] who just signed up for [scrape-data?all&1]`

The tokens `[scrape-data?all&0]` and `[scrape-data?all&1]` are inserted via the **Insert data** button and reference the first and second columns of the scraped data. The step returns the drafted email, which the next step sends via **Send an email**.

## Use the output
***

The step's output is available to every step that runs after it. Reference it with the **Insert data** button. The shape depends on the function you picked.

### Extract data

The output is a 2D array with one column per item in your extraction list. Asking for `job title, company, salary, location` gives you a four-column dataset where each row is one item extracted from the source text. Each column is referenceable on its own in later steps.

### Generate data

The output is a string containing whatever the model produced from your prompt.