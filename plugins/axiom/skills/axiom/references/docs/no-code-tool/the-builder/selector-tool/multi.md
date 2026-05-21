---
title: Use the Multi Selector tool
metaTitle: Scrape data from a webpage with the axiom.ai Multi Selector
description: Point and click to select text, images, links, and HTML for extraction, group repeating content into rows, and apply custom CSS selectors.
video: https://www.youtube.com/embed/8QvfRWUSOuI?rel=0
order: 2
---

The Multi Selector tool is built into the web scraping steps, such as **Get data from current page**. It lets you point and click to choose what to extract from a webpage, set the data type for each column (text, image, link, or HTML), and group repeating content into rows. Advanced users can switch to custom CSS selectors when the visual picker isn't enough.

::HeroMedia
::

## Use the Multi Selector tool
***

To start, use the step finder to search for `scraper` and add the scrape step you want.

1. Click **Select** to start choosing the data to extract.

::YouTubeDialog{url="https://www.youtube.com/embed/8QvfRWUSOuI?rel=0&amp;start=80&end=543"}
::

The features below cover everything from a simple point-and-click selection to the grouping algorithm that powers row-by-row scraping.

### Select content

The simplest way to choose data is to point and click. After you click **Select**, an orange highlight shows the selected element. Click an element again to unselect it. Set the data type (text, image, link, or HTML) to match what you want to extract.

### Use columns

Columns arrange the data you extract into a table. Each column has its own selector, data type, and optional custom CSS selector. To add a column, click **Add column** or press **Shift + N**.

### Set the data type

axiom.ai supports four data types: text, image, link, and HTML. Set the type per column based on what you want to extract.

1. Click the dropdown menu at the top right of the column.
2. Choose the data type.

::YouTubeDialog{url="https://www.youtube.com/embed/8QvfRWUSOuI?rel=0&amp;start=128&end=543"}
::

### Group repeating content into rows

axiom.ai detects patterns when you select two similar elements, then groups every matching element on the page into rows. This is how you scrape lists like profiles, search results, or product cards.

For example, to scrape a list of profiles with names, job titles, and profile links:

1. Select the first name at the top of the list.
2. Scroll down and select another name further down. axiom.ai detects the pattern and selects every name in the list.
3. Add a new column, change the data type to **link**, and select the same name again to capture its link.

::YouTubeDialog{url="https://www.youtube.com/embed/8QvfRWUSOuI?rel=0&amp;start=134&end=543"}
::

axiom.ai aligns the columns into rows automatically, so each profile's name, title, and link end up on the same row.

## Advanced features
***

### Custom CSS selectors

For sites where the visual picker can't get a clean match, switch to a custom CSS selector. Any valid CSS selector works. For background and examples, see [custom CSS selectors](/docs/no-code-tool/the-builder/selector-tool/custom-css-selectors).

To use a custom selector:

1. Click the dropdown menu at the top right of the column.
2. Choose **Custom selector** and enter your CSS selector.

::YouTubeDialog{url="https://www.youtube.com/embed/8QvfRWUSOuI?rel=0&amp;start=164&end=543"}
::

### Pass a selector from a data source

You can [pass selectors](/docs/no-code-tool/the-builder/selector-tool/custom-css-selectors) into the Multi Selector from another data source, for example a Google Sheet. This lets you change which elements to scrape at runtime without editing the automation.

1. Click the dropdown menu at the top right of the column.
2. Choose **Custom selector** and tick **Set selector from data**.
3. Click **Insert data** and choose your data source.