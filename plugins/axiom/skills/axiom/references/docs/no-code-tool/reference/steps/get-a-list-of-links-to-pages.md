---
title: Get a list of links from a page step
description: Scrape links from a webpage. Return results via a token for use in your automation.
category: Scrape
icon: WidgetDriverScrapeLinks.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?start=3671&rel=0"}
::


## What to use the Get a list of links to pages step for
***

Use this step to scrape links from the page the bot is currently on. Then pass the links into a ['Get data from a webpage'](/docs/no-code-tool/reference/steps/Get-data-from-website) step to scrape data. Alternatively, write the links to a  ['Google sheet'](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step) and create a batch scraper for large-scale scraping. We call this design pattern 'Batch scraping' Learn more about ['batching here'](/docs/tutorials/long-bot-runs) or try this [template](/guides/batching). You can also find a ['Link scraper template here.'](/guides/scrape-links-from-a-website)

You can use this step to scrape:

- [Amazon](/guides/scrape-amazon) product page links, like [Amazon Book pages](/blog/how-to-scrape-product-details-from-amazon-books)
- Social media links
- LinkedIn profile links from [Sales Navigator](/guides/sales-navigator-connect)- [Links](/guides/scrape-links-from-a-website) from any website

## How to configure the Get a list of links to pages step
***

### Select

Click 'Select' to choose the links you wish to scrape. The display will transform into the selector tool, and it will guide you by showing you how to select links from the webpage.

The Multi-selector tool comes with several valuable features accessed by clicking custom:
- Ability to use custom CSS selectors
- 'Use element text' allows you to click buttons based on the button text i.e. 'Submit'
- Pass CSS selectors in from data sources

[Watch these guides to learn more about the selector tool.](/docs/no-code-tool/the-builder/selector-tool)

### Find pager (optional)
Select the 'Next' button for the pager, if there is one. If the button features text such as 'Next,' why not try the 'Use element text' method? Click 'Custom' on the selector toolbar, then click 'Use element text'.

### Max results

We set the max results to 20 to speed up the testing of your bots as you make them. It's best to do short runs while testing your bot.

### Wait time between scrolls (ms)

Adjust the wait time between scrolls to increase or decrease the loading time of content. This feature is particularly useful when scrolling down listing pages with slow-loading content. However, insufficient waiting time could mean that content is not loaded. Therefore, experiment with caution.

### No. of retry attempts when results not found

To speed up your runs, reduce the retry runs. But keep in mind content could be missed. Make sure to do some test runs.

### Minimum wait before scraping (ms)

To speed up your runs, reduce your wait time. However, keep in mind that some content may not have finished loading yet, which is why we wait.

### Page number to start scraping on

For paginated pages, you can specify a starting page. However, not all pages support this.

### Specify exact number of pixels to scroll

Instead of auto-scrolling set a pixel height to scroll.

### Force a re-scrape after each page change

Use if you are only getting the first page of results.

### Output
A preview of the scraped data.