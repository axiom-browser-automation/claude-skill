---
title: Transforming data during the run
metaTitle: Transform data during a run with append, filter, and replace steps
description: Learn how to use a range of steps to help you transform your data, including appending, filtering, replacing, removing, and deduplication.
order: 3
---

We offer a range of steps to help you transform your data, including appending, filtering, replacing, removing, and deduplication. Data can be passed into all of these steps simply by clicking "Insert Data" when configuring the step. This group of steps also output their transformed data in a variable.

## How to append or merge two or more data variables
***

Merge two pieces of data together by appending one to the other. You can append either horizontally, which merges rows, or vertically, which adds all the columns in the second set to the end of the first. To do this add the [**"Append or merge data"**](/docs/no-code-tool/reference/steps/append-or-merge-data) step, use the Step Finder to search for **"Append"** and add the step.

1. `Append or merge data` step  
  - `Data A`: Click "Insert data" and select the data to append to.  
  - `Data B`: Click "Insert data" and select the data to append.

::YouTubeDialog{url="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=1634&end=1690?rel=0"}
::

The variable output of this step will be the joined data in a list or table. To append more data use additional steps.

### Example of using the **"Append or merge data"** step

We often use this step to combine data from two different sources. For example, we have created an automation that reads URLs from a Google Sheet, then scrapes data from those pages. We use an **"Append"** step to merge the URLs with the scraped data before writing it to a Google Sheet.

## How to join different data sources based on matching columns
***

Join data gathered from different sources together using a shared column. For example, you can use this to join product information from different e-commerce sites. To do this add the [**"Join different data sources based on matching columns"**](/docs/no-code-tool/reference/steps/join-different-data-sources) step, use the Step Finder to search for **"Join"** and add the step.

1. `Join different data sources based on matching columns` step  
  - `Base data`: Enter the base data to join with another.  
  - `Base data column`: Set column of data to use as the basis of the join.  
  - `Join data`: Enter the data you want to join with the base data.      
  - `Column`: Specify a particular column of the base data to always match against.

::YouTubeDialog{url="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=661&end=706&rel=0"}
::      

The variable output of this step will be the merged data.

### Example

We often see users utilizing this step to **merge CSV files** together before entering data into a webform.

## How to remove duplicates from your data
***

Remove duplicates from the specified data. This can be limited to particular columns. To do this add the [**"Remove duplicates"**](/docs/no-code-tool/reference/steps/remove-duplicates) step, use the Step Finder to search for **"Remove"** and add the step.

1. `Remove duplicates` step  
  - `Data`: Select the data to deduplicate.

::YouTubeDialog{url="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=366&end=395?rel=0"}
::    

The variable output of this step will be the deduplicated data.

### Example

This step can be useful for deduplicating data sets before you run your browser automations.

## How to remove results that contain certain words
***

Filter out rows from your data that contain particular words. To do this, add the [**"Remove results that contain certain words"**](/docs/no-code-tool/reference/steps/remove-results-that-contain-certain-words) step using the Step Finder to search for **"Remove"** and add the step.

1. `Remove results that contain certain words` step  
  - `Data`: Select the data you wish to remove rows from.  
  - `Words (comma separated)`: Enter either a list of any number of words to check for, separated by commas, or data containing a list of words, one in each row. 
  - `Word matching mode`: Set to **"All"** or **"Any"**.      
  - `Match on word boundary`: Check this to match only when the complete word appears in the data.

::YouTubeDialog{url="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=2195&end=2255?rel=0"}
::            

The variable output of this step will be the data minus the rows matching the words.

### Example

When doing large scale scrapes of sites, whilst searching for particular data this step can be used to filter out data that you do not want written to the Google Sheet.

## How to remove results which do not contain certain words
***

Filter out rows from your data that do not contain particular words. To do this, add the [**"Remove results which do not contain certain words"**](/docs/no-code-tool/reference/steps/remove-results-which-do-not-contain-certain-words) step using the Step Finder to search for **"Do not"** and add the step.

1. `Remove results that do not contain certain words` step  
  - `Data`: Select the data you wish to remove rows from.  
  - `Words (comma separated)`: Enter either a list of any number of words to check for, separated by commas, or data containing a list of words, one in each row. 
  - `Word matching mode`: Set to **"All"** or **"Any"**.      
  - `Match on word boundary`: Check this to match only when the complete word appears in the data.

::YouTubeDialog{url="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=2255&end=2315?rel=0"}
::             

The variable output of this step will be the data with the matching words.

### Example

This is often used when extracting product data from e-commerce sites, to isolate products with SKUs from the scraped data.

## How to select data randomly
***

Select random rows from a given data set and create a new data set containing them. To do this, add the [**"Select random rows"**](/docs/no-code-tool/reference/steps/select-random-rows) step using the Step Finder to search for **"andom"** and add the step.

1. `Select random rows` step  
  - `Rows`: Enter the number of rows to select.  
  - `DATA`: Select the data to get rows from. 

::YouTubeDialog{url="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=3222&end=3247?rel=0"}
::     

The variable output of this step will be the specified number of rows, randomly picked from the data source.

### Example

This step can be used to randomly enter a number value into an input field.

## How to extract data from a string
***

Split data into parts using a delimiter that you specify. To do this, add the [**"Split by character"**](/docs/no-code-tool/reference/steps/split-by-character) step using the Step Finder to search for "Split" and add the step.

1. `Split by character` step  
  - `Character`: Enter a character or word to split on.   
  - `DATA`: Select the data that should be split.  

::YouTubeDialog{url="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=810&end=840?rel=0"}
::   

The variable output of this step will be the characters before or after the split.

### Example

This step is useful when you need to extract specific data from within a string. For instance, if you are scraping data that is embedded within a larger string, you can use two **"Split by character"** steps. The first step removes the unwanted characters before your desired data, and the second step removes the unwanted characters after your desired data, effectively isolating the information you need.

## How to replace text
***

Replace one piece of text with another within a dataset. To do this, add the [**"Replace text"**](/docs/no-code-tool/reference/steps/replace-text-step) step using the Step Finder to search for **"Replace"** and add the step.

1. `Replace text` step  
  - `Data to replace words`: Select the data within which you want to replace text.    
  - `Text to replace`: Enter the text you want to replace.  
  - `Replace with`: Enter what you want to replace the text with, or leave blank to whipe clean.

::YouTubeDialog{url="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=427&end=484?rel=0"}
::       

The variable output of this step will be the data with the specified text replaced.

### Example

Often, when extracting data for reporting, the data needs to be relabeled before being placed in the report. This step can be used to relabel the data.

## How to split names for use in text
***

Split any full name into its parts: title, first name, last name, and additional names. To do this, add the [**"Split a name into columns"**](/docs/no-code-tool/reference/steps/split-a-name-into-columns) step using the Step Finder to search for "Name" and add the step.

1. `Split a name into columns` step  
  - `DATA`: Select data to expand.  
  - `Column`: Enter the column in the data where the names can be found. You can enter either a number (starting from 1) or a capital letter (starting from A).  
  - `Fields`: Select the fields to split the name into.

::YouTubeDialog{url="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=1146&end=1211?rel=0"}
::    

The variable output of this step will be the data split into columns. This can be used for data other than names.

### Example of using the **"Split a name into columns"** step 

This step is useful when sending DMs in LinkedIn Sales Navigator. We scrape the whole name to record the data, then split the name and use the first name to personalize the message.

## How to remove HTML code
***

Strip all the HTML from a set of data. To do this, add the [**"Remove HTML code"**](/docs/no-code-tool/reference/steps/remove-html-code) step using the Step Finder to search for **"HTML"** and add the step.

1. `Remove HTML code` step  
  - `DATA`: Select the data to remove HTML from.

::YouTubeDialog{url="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=395&end=427?rel=0"}
::   

The variable output of this step will be the data minus any HTML.

### Example of using the **"Remove HTML code"** step 

If you are scraping hidden data often it will be tangled in HTML this step can be used to remove the code.

## Using Javascript to transform data
***

If you wish, you can use all of JavaScript's functions to transform and manipulate your data in axiom.ai. To do this, add the **"Write javascript"** step using the Step Finder to search for "Javascript" and add the step. Data can be passed into this step by clicking "Insert Data". To learn more about using JavaScript in your automation, [click here](/docs/tutorials/javascript).

If you need help or want to suggest an alternative way of transforming data in axiom.ai, please [let support know](/customer-support).

## Concatenate strings without code
***

Concatenate strings using the "Custom data" step - to add dynamic data, use the "Insert data" option to insert data tokens containing the information you wish to concatenate. For example, dynamically creating file names.