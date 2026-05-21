---
title: Replace text step
description: Replace text from any of your data sources by inserting their token in this step. Leave blank to delete, or add text to replace with.
category: Manipulate data
icon: WidgetFilterReplace.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=427&end=484?rel=0"}
::

## What to use the Replace text step for
***

Use this step to replace a text in your data. For example, when generating reports, let's say you have scraped data that reads 'Red Shoes' and the value 40. You could change the text to 'Stock level of Red Shoes is.' 

Here's a helpful tip, if you just want to remove text, simply leave the 'Replace field' blank.

You can use this step to:

- Overwrite [scraped data](/docs/no-code-tool/reference/steps/Get-data-from-website)- Manipulate data from a Google Sheet
- Change data in a [CSV](/docs/no-code-tool/reference/steps/import-csv-file)
## How to configure the Replace text step
***

### Data to replace words

Select the data you want to replace the text. It can be from any step in Axiom. For example, you can pass the output from 'Read from a Google Sheet' or 'Webhook' as a variable into this step.

### Text to replace

Enter the text you wish to change. It has to be found in the variable passed via 'Data to replace words'.

### Replace with

Enter what you want to replace the text with

### Output
No action required it is a preivew of the data output by this step. So you will see your change here.