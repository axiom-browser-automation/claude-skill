---
title: Loop through data
metaTitle: Loop through rows of data with the Loop through data step
description: Repeat a set of steps for every row of data using Loop through data, or build conditional loops with Jump and Conditionally jump steps.
video: https://www.youtube.com/embed/86ZWhuOa7OU?rel=0&amp;start=0&end=827
order: 4
---

Looping is one of the most useful patterns in axiom.ai. A loop repeats a group of steps, usually once per row of data. For example, loop through a list of URLs to scrape data from each page, or loop through rows of a Google Sheet to fill in a web form.

::HeroMedia
::

There are three steps you can use to build a loop. The primary one is [**Loop through data**](/docs/no-code-tool/reference/steps/loop). The [**Jump to another step**](/docs/no-code-tool/reference/steps/jump-step) and [**Conditionally jump to another step**](/docs/no-code-tool/reference/steps/Conditionall-jump-step) steps can also create loops, and you can use [logic](/docs/no-code-tool/how-it-works/logic) inside any of them.

## Loop using the Loop through data step
***

The **Loop through data** step repeats its sub-steps once for each row of data passed into it. To use it, add the step and select the data you want to loop through.

### Add a Loop through data step

![Adding the Loop through data step in the axiom.ai Builder](/docs/tutorials/add-loop-step-axiom-ai.jpg)

There are two ways to create a loop: use the step finder, or use the Move toolbar to wrap existing steps.

To add a loop with the step finder:

1. Open the step finder, search for **loop**, and add **Loop through data**.
2. Add the steps you want to repeat as sub-steps of the loop.

::YouTubeDialog{url="https://www.youtube.com/embed/86ZWhuOa7OU?rel=0&amp;start=23&end=827"}
::

To turn existing steps into a loop with the Move toolbar:

1. Tick the checkboxes next to the steps you want to loop.
2. In the Move toolbar, click **Loop**.
3. Select **Loop through data** to wrap the highlighted steps in a loop.

::YouTubeDialog{url="https://www.youtube.com/embed/86ZWhuOa7OU?rel=0&amp;start=139&end=827"}
::

### Select data to loop through

A loop won't iterate until you give it data. There are two ways to set the loop data.

![Selecting data to loop through in the axiom.ai Builder](/docs/tutorials/select-data-loop-step-axiom-ai.jpg)

1. **From the loop step.** Set `Data to loop through` by clicking **Insert data** and choosing the data variable.
2. **From a sub-step.** Edit a sub-step inside the loop and click **Insert data**. The variable you pick is automatically set as the loop's `Data to loop through`.

::YouTubeDialog{url="https://www.youtube.com/embed/86ZWhuOa7OU?rel=0&amp;start=168&end=827"}
::

> **Note:** A loop returns an error if its data source is empty.

### Insert sub-steps


![A Loop through data step with sub-steps in the axiom.ai Builder](/docs/loop/inserting-substeps.png)


Add the steps you want to repeat inside the loop using **Add sub-step**. Steps outside the loop are not repeated.

::YouTubeDialog{url="https://www.youtube.com/embed/86ZWhuOa7OU?rel=0&amp;start=240&end=827"}
::

### Nest loops

![Nested Loop through data steps in the axiom.ai Builder](/docs/loop/nested-loops.png)

You can nest loops up to five levels deep. Three levels is usually enough, even for complex automations.

::YouTubeDialog{url="https://www.youtube.com/embed/86ZWhuOa7OU?rel=0&amp;start=139&end=267"}
::

### Output data from a loop

![A Loop through data step exporting data via its output token](/docs/loop/loop-output.png)

Every **Loop through data** step outputs a token that other steps can read. The token contains the data output by every sub-step in every iteration, assembled into a 2D array (a table).

::YouTubeDialog{url="https://www.youtube.com/embed/86ZWhuOa7OU?rel=0&amp;start=298&end=400"}
::

### Group data with a loop

You can use a loop to group the output of several steps into a single token, even if the loop only iterates once. Wrap the steps in a loop to combine their outputs.

::YouTubeDialog{url="https://www.youtube.com/embed/86ZWhuOa7OU?rel=0&amp;start=383&end=500"}
::

## End a loop early
***

Use the [**End loop**](/docs/no-code-tool/reference/steps/end-loop) step to stop a loop before it finishes its iterations. Combined with a [control flow](/docs/no-code-tool/reference/steps/#control-flow) step, this lets you exit a loop when a condition is met (or not met).

## Loop design patterns
***

These are common loop patterns. Each one starts by reading data from a Google Sheet and ends by deleting the processed row, so a re-run picks up where the last run left off.

### Loop through links and scrape each one

1. **Read data from a Google Sheet**
2. **Loop through data**
   1. **Go to page**
   2. **Get data from current page**
   3. **Write data to a Google Sheet**
   4. **Delete row from Google Sheet**

### Enter data into a web form

1. **Read data from a Google Sheet**
2. **Loop through data**
   1. **Go to page**
   2. **Enter text**
   3. **Press keys**
   4. **Click element**
   5. **Delete row from Google Sheet**

### AI web scraper

1. **Read data from a Google Sheet**
2. **Loop through data**
   1. **Go to page**
   2. **Get data from current page**
   3. **Extract data with ChatGPT**
   4. **Write data to a Google Sheet**
   5. **Delete row from Google Sheet**

For full walkthroughs of each pattern, see:

- [Loop through links and scrape data](/guides/loop-through-links-and-scrape-data)
- [Enter text into a search field](/guides/entering-text-into-search-field)
- [Scrape HTML and extract data with AI](/guides/scrape-html-extract-data-with-ai)

## Loop using the Jump to another step
***

The [**Jump to another step**](/docs/no-code-tool/reference/steps/jump-step) step creates a simple loop with two parameters: the step to jump to, and the number of cycles to run.

### Use Jump to another step

The most common pattern is to add the jump step at the end of a series of steps you want to repeat.

![Using the Jump to another step in axiom.ai for a simple loop](/docs/tutorials/jump-step-example.jpg)

1. Open the step finder and add **Jump to another step**.
2. Set `Jump to step` to the step number you want to return to.
3. Set `Maximum cycles` to the number of times the loop should run.

::YouTubeDialog{url="https://www.youtube.com/embed/86ZWhuOa7OU?rel=0&amp;start=464&end=600"}
::

> **Note:** If you reorder the steps in your automation, check the `Jump to step` value still points at the right step.

## Loop using the Conditionally jump to another step
***

The [**Conditionally jump to another step**](/docs/no-code-tool/reference/steps/Conditionall-jump-step) step works like **Jump to another step** but only jumps when a condition is met. Use it to behave differently based on data, for example pairing it with a scrape step to keep clicking **Next** until a target value appears on the page.

![Using the Conditionally jump to another step in axiom.ai](/docs/tutorials/conditionaly-jump-step.png)

### Use Conditionally jump to another step

1. Set `Data to check` to the data you want to evaluate (for example scraped data or a Google Sheet value).
2. Set `Condition to check` to the value to compare against. Strings and numbers are accepted; advanced users can use JavaScript.
3. Set the matching rules: match any word, all words, or an exact match.
4. Set `Jump to step` to the step number you want to return to.
5. Set `Maximum cycles` to cap how many times the loop can run.
6. Toggle `Reverse condition` to jump when the condition is false instead of true.

::YouTubeDialog{url="https://www.youtube.com/embed/86ZWhuOa7OU?rel=0&amp;start=572&end=700"}
::