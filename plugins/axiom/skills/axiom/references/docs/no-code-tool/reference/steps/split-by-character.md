---
title: Split by character step
description: Extract data from large volumes of scraped text using the Split by character step. Use multiple steps if needed to remove text before the start and after the end.
category: Manipulate data
icon: WidgetSplitByCharacter.svg
---


::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=810&end=840?rel=0"}
::

## What to use the Split by character step for
***

Use this step to extract specific data from a larger data block like HTML. For example, you may be trying to scrape an image URL, but it's not a standard link. Using the  ['Get data from a URL'](/docs/no-code-tool/reference/steps/Get-data-from-website), scrape the HTML, then use this step to extract the URL. You can also extract text with this step. Finally, you may need to use multiple Split steps, one to strip the data before and one step to strip the data after.

You can use this step to:

- Extract links from scraped HTML
- Get Image URLs from scraped HTML
- Get specific text from scraped data

## How to configure the Split by character text step
***

### Character

Enter a character or word to split the data on.

### Data

Select the variable containing the data you wish to split.

## Using multiple split steps
***

If you wish to extract data that has data in front and after, you will need to use multiple Split steps. You can easily share data between these steps by clicking 'Insert Data' and selecting the correct token.