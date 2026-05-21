---
title: Speed up your automations
date: 
description: Techniques to make your automations run faster and get results more quickly.
order: 3
---

No two websites load in the same amount of time, and not all web pages load all their content before the site is rendered. Some websites load content on scroll. To manage these complexities, we have developed algorithms that calculate wait times to allow content to load before the bots execute your actions. Through extensive testing, it became obvious there is a correlation between time and accuracy: the longer you wait, the more accurate the bots are. By default, we value accuracy over speed. However, for users wishing to increase the speed of bot runs, there are settings you can experiment with. We strongly recommend that each time you change a setting, you test your bot to ensure accuracy has not been affected.

## Disable page change monitoring
***

By default Axiom waits for a page to finish making changes. This is to make sure that page contents which load in dynamically have fully loaded. Sometimes, this can slow down an automation. This is most common when there are animated elements, and axiom.ai must take a while to determine whether the animation is related to page loads or not.

<img src="/docs/settings/monitoring-axiom.ai.jpg" alt="monitor page load axiom.ai">

In these cases, you can turn off the [page monitoring](/docs/no-code-tool/reference/settings/error-handling/page-monitoring) to skip it. Note you may need to add back manual waits in these cases, in case axiom.ai starts jumping ahead.

::tutorial
1. Open the automation.
2. Navigate to the settings in the top right menu.
3. Click "Disable change monitoring".
4. Toggle the option to on.
::

##  Reduce the wait time on Get data steps
***

<img src="/docs/tutorials/configure-get-data-step-axiom-ai.jpg" alt="configure your get data steps axiom.ai">

If your bot seems to be taking a long time over scraping, there are several things you can do to try and speed it up. Please note that the axiom.ai scraper is configured by default to maximise accuracy across a wide range of sites, so by changing these options you might introduce some inaccuracies - the scraper can be configured to go too fast for the website!

To configure these options, open the "Configure scraper" optional parameter on the scrape step. There are two options to choose from which can help speed up your bot:

::tutorial
1. Wait time between scrolls (ms): This controls the default amount of time the scraper wait between each scroll. Lower this to increase speed.
2. Number of attempts when results not found: When no results are found, the scraper will try again to make doubly sure that the scrape has finished. You can set the number of times this happens; 0 will never re-check.
::

## When scraping, set a maximum number of results
***

If you know you need to scrape 1 result per page (or 5, or 10 etc.) set "Max results" to the number of results you need to scrape. This means axiom.ai will stop once it has scraped 1 result, then move to the next iteration of the loop.

## Use the Keyboard
***

Using Keyboard shortcuts and "Tabbing" between inputs can be faster than selecting "Enter text" to enter data.

Please see our tips on using the [keyboard.](/docs/guides/general/web-actions/keyboard-short-cuts)
##  Jump ahead with conditional logic
***

This may only apply to some scenarios.

Let's look at the example of entering data into multi-step form with 5 steps.

If at step 2, it is evident steps 3 and 4 are not required, you can jump ahead to step 5 using conditional logic.
