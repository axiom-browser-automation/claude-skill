---
title: Data snippets
metaTitle: JavaScript snippets for working with data in automations
description: JavaScript snippets for manipulating data in axiom.ai automations, including dates, timestamps, constants, CSV exports, and regex transformations.
order: 1
---

Data snippets help you manipulate data in your automations so it matches the format the next step (or downstream system) expects.

## Get the date and time
***

Get the date a number of days in the past:

```js
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1); // Change '1' to your desired number of days
return [[yesterday.toLocaleDateString('en-US')]];
```

Get the date a number of days in the future:

```js
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 14); // Change '14' to your desired number of days
return [[targetDate.toLocaleDateString('en-US')]];
```

Append a timestamp to scraped data:

```js
let data = [all-interaction-data]; // Token from a previous scrape step
let dt = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });

for (var i = 0; i < data.length; i++) {
    data[i].push([dt]);
}

return data;
```

For locale options, see [Mozilla's Intl reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).

## Get the current day of the week
***

Return the day of the week in the locale you pass in:

```js
const locale = 'en-US';
const options = { weekday: 'long' };
const now = new Date();
return new Intl.DateTimeFormat(locale, options).format(now);
```

For locale options, see [Mozilla's Intl reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).

## Add a placeholder for blank cells
***

Blank cells in scraped data are silently dropped by the Google Sheets API, which can shift columns left when the data is written. For example, the array `[["1", "2"], ["", "4"]]` writes to a sheet like this:

| A | B |
| --- | --- |
| 1 | 2 |
| 4 | |

To prevent the shift, replace blank cells with a placeholder before writing:

```js
var data = [scrape-data];
const placeholder = '-';

for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
        if (data[i][j] === '') {
            data[i][j] = placeholder;
        }
    }
}

return data;
```

Change the `placeholder` value to suit your needs. The output goes into the `code-data` token, ready to write into a Google Sheet:

| A | B |
| --- | --- |
| 1 | 2 |
| - | 4 |

## Add a constant value to the last column
***

Append a fixed value to every row of an array, useful for tagging exports with a category, source, or run timestamp:

```js
var scrapeData = [scrape-data];
var data = 'example';

scrapeData.forEach((item) => item.push(data));

return scrapeData;
```

Replace `[scrape-data]` with the token from the previous step, and `data` with the constant value to append.

## Create and download a CSV file
***

Build a CSV from automation data and write it to a local path. Read [export to CSV](/docs/tutorials/data/export#export-using-export-csv-file) before using this; the built-in step is simpler for most use cases.

```js
// Replace [google-sheet-data] with the data token containing the rows to export.
const data = [google-sheet-data];

function arrayToCSV(array) {
    return array.map(row =>
        row.map(value => {
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }).join(',')
    ).join('\n');
}

function writeCSVFile(directory, filename, csvData) {
    const fullPath = `${directory}/${filename}`;
    fs.writeFile(fullPath, csvData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing CSV file:', err);
        } else {
            console.log(`CSV file saved as ${fullPath}`);
        }
    });
}

const csvData = arrayToCSV(data);

// Change to the desired download path. Use forward slashes.
const downloadDirectory = 'C:/Users/Axiom/Documents/Axiom';

// Optional: the name of the output file.
const filename = 'output.csv';

writeCSVFile(downloadDirectory, filename, csvData);
```

## Manipulate data with regex
***

Regular expressions match, search, and transform text. Each example below assumes the snippet is inside a [**Loop through data**](/docs/no-code-tool/reference/steps/loop) step so the script runs once per row, but you can also build the loop into the snippet itself.

### Extract data

Use `match` to pull out the bit you want. The example pulls a number out of a string like `115 Records`:

```js
// Data scraped from a page, e.g. "115 Records".
const data = '[scrape-data?all&0]';

// Extract the digits.
const records = data.match(/\d+/)[0];

// Return for the 'code-data' token.
return records;
```

### Replace data

Use `replace` to swap one substring for another. The example replaces an email domain:

```js
// Data scraped from a page, e.g. "axiom@example.com".
const data = '[scrape-data?all&0]';

// Replace the domain.
const newEmail = data.replace(/@[\w.-]+$/, '@newdomain.com');

// Return for the 'code-data' token.
return newEmail;
```

### Validate data

Use `test` to check whether a value matches a pattern. The example checks for a valid email:

```js
// Data scraped from a page, e.g. "example@example.com".
const data = '[scrape-data?all&0]';

// Check if the email is valid.
const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data);

// Return for the 'code-data' token.
return isValid;
```

### Reformat data

Use `replace` with capture groups to restructure a value. The example reformats a date:

```js
// Data scraped from a page, e.g. "01-02-2025".
const data = '[scrape-data?all&0]';

// Reformat to "01/02/2025".
const formatted = data.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1/$2/$3');

// Return for the 'code-data' token.
return formatted;
```