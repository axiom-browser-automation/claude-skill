---
title: How to automate web forms
date:
description: Learn how to automate data entry into web forms by combining steps using the axiom.ai No-code tool.
video: "https://www.youtube.com/embed/t5YD7ahWDOc?rel=0&start=0&end=978"
---

To get started automating your web form, we have a choice of great starting points, including snippets, templates, or starting from blank.

::HeroMedia
::

## Start from Snippet
***

Snippets are step combinations useful for starting an automation. We have a snippet called "Fill in a form" that adds steps you can build on. To add this snippet:

::tutorial
  1. Click "New Automation".
  2. Then click "Add first step".
  3. Finally, select the "Fill in a form" snippet.

  ::YouTubeDialog{url="https://www.youtube.com/embed/t5YD7ahWDOc?rel=0&amp;start=24&end=978"}
  ::
::

## Start from Template
***

We have some pre-made templates with video guides to help get you started. These templates have a base set of steps you can add to complete your automation. You can add templates from the builder or our website:

::tutorial
  1. [How to automate data entry from a Google Sheet.](/guides/data-input-from-google-sheet)  
  2. [How to automate data entry without an API using Zapier.](/guides/zapier-forms)

  ::YouTubeDialog{url="https://www.youtube.com/embed/t5YD7ahWDOc?rel=0&amp;start=270&end=978"}
  ::
::

## How to start from blank
***

We recommend when automating forms to focus on the web form itself as a starting point. Ignore importing the data for now.

It may sound counterintuitive, but it’s better to set up the steps required to automate your form with dummy data. Test and prove you can automate the form in the browser. Then, when it’s working, invest your time in connecting your data source.

To get started, click "New Automation" then "Add first step". Make sure you have axiom.ai open on the web page with the form open.

### Add a "Go to page" step

The first step to add is the "Go to page" step. This loads the URL of the web form you wish to automate. To add this step:

::tutorial
  1. Open the step finder and search for "Go".
  2. Click and add the "Go to page" step.
  3. Insert the web form URL.

  ::YouTubeDialog{url="https://www.youtube.com/embed/t5YD7ahWDOc?rel=0&amp;start=497&end=978"}
  ::
::

### Now add the steps to automate the form

We have a range of steps you can select from, including steps to enter text, click buttons, and interact with select lists.

::tutorial
  1. Open the step finder, scroll down and click "Interact".
  2. Select the step you wish to use from the interact list.

  ::YouTubeDialog{url="https://www.youtube.com/embed/t5YD7ahWDOc?rel=0&amp;start=551&end=978"}
  ::
::

For example, you can add the "Enter text" step to input data into a text field.

### Testing

We recommend testing at regular intervals when adding steps as you set up the automation. It's best to test your automation running locally so you can observe the run and resolve any issues that may occur.

### Connecting your data

When ready to [connect your data](/docs/tutorials/data), choose from one of the steps below. Once added, you can easily pass data into the steps you have already added by going back through them and clicking "Insert Data".

::tutorial
  1. Pass data from a [Google Sheet.](/guides/data-input)  
  2. From a webhook or [Zapier.](/guides/zapier-forms)
::

## Advanced techniques for web forms
***

When automating large forms, there are some steps/techniques that will prove helpful.

### Try catch

The [try catch](/docs/no-code-tool/how-it-works/logic#try-catch) lets you attempt to execute a set of steps. If successful, the automation continues; if unsuccessful, it will execute a different set of steps. 

::YouTubeDialog{url="https://www.youtube.com/embed/t5YD7ahWDOc?rel=0&amp;start=847&end=978"}
::

### "Get data from bot's current page" and "Conditionally jump to another step" steps
***

If you need to check for a value and present a different set of steps, we recommend using a "Get data from bot's current page" to scrape for that value. Then use the "Conditionally jump to another step" to execute a specific set of steps if the value is found.

::YouTubeDialog{url="https://www.youtube.com/embed/t5YD7ahWDOc?rel=0&amp;start=882&end=978"}
::

### Grouping steps

If you are automating a form with multiple pages, we recommend using the "Loop data" step to nest steps and arrange your automation by the pages of the web form.

::YouTubeDialog{url="https://www.youtube.com/embed/t5YD7ahWDOc?rel=0&amp;start=780&end=978"}
::
