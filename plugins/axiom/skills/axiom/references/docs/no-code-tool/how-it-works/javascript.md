---
title: Run custom JavaScript
metaTitle: Run custom JavaScript inside a browser automation
description: Use the Write javascript step to run your own code inside an automation, transform data, call APIs, and reach parts of a page the no-code steps can't.
order: 9
---

Mix no-code and code in the same automation. The **Write javascript** step lets you drop into a JavaScript editor to manipulate data, call APIs, or reach parts of a page the visual steps can't. For the best experience, run automations that use this step in the axiom.ai desktop app.

For more ready-to-use code, see the [JavaScript snippets](/docs/developer-hub/snippets/javascript) reference.

## Add the step
***

Open the step finder and add **Write javascript**. The step provides a basic code editor where you write a standard JavaScript script.

```javascript
const greeting = "Hello, World!";

if (greeting === "Hello, World!") {
  return greeting;
}
```

You can also paste code in from your usual IDE.

## Define functions
***

Use functions to keep complex scripts readable.

```javascript
const data = [scrape-data];

function evaluate(item1, item2) {
  return item1 === item2;
}

const duplicate = evaluate(data[0][0], data[1][0]);
if (duplicate) {
  console.log(`${data[0][0]} is a duplicate of ${data[1][0]}`);
}
```

## Use data tokens
***

Reference data from earlier steps in your script using data tokens. Click **Insert data** and select a token, or type the token in manually. axiom.ai replaces each token with the data from the referenced step at run time, just like in any other step.

```js
const data = [scrape-data];
return data[0];
```

### Arrays

When a token references multiple rows, axiom.ai replaces it with a 2D array:

```js
const data = [scrape-data];
console.log(data);

// Output: [["A", "B", "C"], ["D", "E", "F"]]
```

### Strings

When a token references a single value, axiom.ai replaces it with a string. Wrap the token in quotes so the replacement is syntactically valid JavaScript:

```js
const data = '[scrape-data]';
console.log(data);

// Output: "A"
```

## Manipulate data
***

Once a token has been replaced with a variable, manipulate the data however you need to.

```js
let data = [scrape-data];
data[0][1] = "X";
console.log(data);

// Original: [["A", "B", "C"], ["D", "E", "F"]]
// Output:   [["A", "X", "C"], ["D", "E", "F"]]
```

## Return data
***

Return any variable you want to pass to later steps. axiom.ai accepts two output shapes: a 2D array or a string. Any other type is coerced to a string when later steps read it. A returned boolean arrives downstream as the string `"true"` or `"false"`, a number arrives as its string form, and so on.

Return a 2D array when the data is tabular:

```javascript
let data = [scrape-data];
data[0][1] = "X";
return data;

// Returned: [["A", "X", "C"], ["D", "E", "F"]]
```

Return a string when the data is a single value:

```javascript
let data = [scrape-data];
return data[0][0];

// Returned: "A"
```

## Run in the app
***

Toggle `Run in app` on to run the code inside the axiom.ai desktop app instead of the browser. Running in the app unlocks:

- The [Node.js filesystem API](#use-the-nodejs-filesystem-api) (`fs`) for reading and writing local files.
- The [Puppeteer API](#use-the-puppeteer-api) for browser control beyond the no-code steps.

`Run in app` is off by default. With it off, `console.log()` writes to the browser console, which is useful when debugging. With it on, `console.log()` is disabled because the code no longer runs in the browser.

## Use cases
***

A few things developers commonly reach for **Write javascript** to do.

### Send data to an API

Use JavaScript when you need more control than the **Trigger webhook** step offers. This snippet sends scraped data to an endpoint and returns the response as the `code-data` token for later steps:

```js
const data = [scrape-data];

async function postData() {
  try {
    let response = await fetch('<API_ENDPOINT>', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      return [[JSON.stringify(result)]];
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error(error);
    return error;
  }
}

return postData();
```

### Use the Puppeteer API

Requires `Run in app` to be on. See the [Puppeteer integration](/docs/no-code-tool/integrations/puppeteer) page for setup and examples.

### Use the Node.js filesystem API

Requires `Run in app` to be on. The `fs` module lets an automation read and write files on the local machine.

axiom.ai's JavaScript step uses promises, while `fs` uses callbacks. Wrap `fs` calls in a promise so `await` works:

```js
let result = await new Promise(resolve => {
  fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
    if (err) {
      resolve([[err.message]]);
    } else {
      resolve([[data]]);
    }
  });
});
return result;
```

For a full reference, see the [Node.js `fs` documentation](https://nodejs.org/api/fs.html).

### Call ChatGPT directly

Requires `Run in app` to be on. When the **Extract data with ChatGPT** and **Generate text with ChatGPT** steps don't fit, call ChatGPT from JavaScript instead.

```js
const key = '<API_KEY>';
const prompt = 'Write a short introduction to browser automation.';

let result = await chatGPT(key, prompt);
return [[result]];
```

Get an API key from your [OpenAI account](https://platform.openai.com/account).

## Use the output
***

The step returns whatever your script returns, coerced to one of the two shapes axiom.ai supports:

- **2D array.** A table of rows and columns. Reference it with the **Insert data** button in any later step and pick one or multiple columns.
- **String.** A single value. Reference it directly in any later step.

Anything else the script returns (booleans, numbers, objects) is converted to its string form before later steps see it. A returned `true` becomes the string `"true"`, a returned `42` becomes `"42"`. If the script returns nothing, the step produces no output for later steps to reference.