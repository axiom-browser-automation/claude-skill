---
title: Structure automations for long runs
date: 
description: Best practices for building automations that run reliably over long periods.
order: 4
---

For large bots, processing large data sets, or scraping many pages, we recommend following these guidelines to produce robust automations. 

## Use Google Sheets for large runs 
***

We recommend using [Google Sheets](/docs/no-code-tool/integrations/google-sheets) as your primary data source in nearly all cases. 

This applies even if you have files like CSVs (they can be imported into Sheets), and even if you are sending data from [Zapier or Make](/docs/tutorials/long-bot-runs#send-data-from-zapier-make-other-platforms).

Please avoid reading and writing to a single sheet for your whole automation - this makes your automations harder to structure.     

Instead, we recommend using _separate_ "INPUT" and "OUTPUT" sheets, with the following  (example) structure. 

## Structure a bot for large runs
***

The advantage of this design pattern is that both "Write data to a Google Sheet" and "Delete rows from Google Sheet" operations are performed inside the loop. This means that for every iteration of the loop, new data is saved, and the processed row is deleted. If the bot stops, it can be restarted and will pick up from where it left off.

::guide
* **1.0** `Read data from a Google Sheet`  
  - `Spreadsheet`: Search for the Google Sheet you created. Once found, click to select.  
  - `Sheet name`: Choose the sheet tab that contains your input data.  

* **2.0** `Loop through data`  

  * **2.1** `Go to page`  
    - `Enter URL`: Click `Insert Data`, select your Google Sheet, and choose the column with the links.  

  * **2.2** `Insert steps here`  
    - Insert scraping, downloading, or extraction steps depending on your task.  

  * **2.3** `Write data to a Google Sheet`  
    - `Spreadsheet`: Search for and select your output Google Sheet.  
    - `Sheet name`: Choose the target tab.  
    - `DATA`: Select the variable holding your extracted or generated data (e.g. `chatgpt-data`).  
    - `Clear data before writing | Add to existing data`: Set to `"Add to existing data"`.  

  * **2.4** `Delete row from Google Sheet`  
    - `Spreadsheet`: Select the same Google Sheet you used for input.  
    - `Sheet name`: Choose the same tab used in Step 1.0.  
    - `First row`: Set to `1`.  
    - `Last row`: Set to `1`.  
::


## Set a maximum runtime
***

axiom.ai contains a setting for [maximum runtime](/docs/no-code-tool/reference/settings/run-options/max-runtime). This is useful if you have a large bot and don't want it to accidentally use up all of the runtime for your plan. 

You can alter this setting from the configuration page for your individual axiom.

For the cloud, the maximum runtime cannot exceed the single run limit for your plan. 

## Send data from Zapier, Make & other platforms
***

When sending data from [Zapier](/docs/no-code-tool/integrations/zapier) or [Make](/docs/no-code-tool/integrations/make), it's possible to either send data directly, or to write data to Google Sheets first. 

Sending data directly works fine for small quantities of data. 

However, if your data-set contains many columns, or more than 1 row, we recommend using Google Sheets to transfer data:

::tutorial
  1. First, structure your bot to read from a Google Sheet.
  2. Secondly, write data to Google Sheets from Zapier / Make.
  3. Finally, [trigger bots from Zapier / Make.](/docs/no-code-tool/integrations/zapier#trigger-zapier-from-axiom) Sending data is not required, as your bot will use the Google Sheet instead.
::