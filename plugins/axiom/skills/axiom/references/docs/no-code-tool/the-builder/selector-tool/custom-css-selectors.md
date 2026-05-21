---
title: Use custom CSS selectors
metaTitle: Use custom CSS selectors in the axiom.ai selector tools
description: Set custom CSS selectors in the Single Selector and Multi Selector tools to target elements that the default picker can't reach.
order: 3
---

The [Single Selector](/docs/no-code-tool/the-builder/selector-tool/single) and [Multi Selector](/docs/no-code-tool/the-builder/selector-tool/multi) tools pick elements on a webpage for your automation to interact with. When the default picker doesn't get a unique match, you can supply your own CSS selector instead.

For background on CSS selectors, see [Additional resources](#additional-resources).

## Add a custom CSS selector
***

You can use custom CSS selectors in both the Single Selector and Multi Selector tools.

### Single Selector

1. Open the Selector Tool by clicking **Select** in an interact step.
2. Click **Custom** and enter your selector in the text box.

![The Single Selector tool with the Custom CSS selector field](/docs/tutorials/single-selector-tool-custom-css.jpg)

### Multi Selector

1. Open the Selector Tool by clicking **Select** in an interact step.
2. In the data column you want to target, click the arrow and choose **Custom selector**.
3. Enter your selector in the text box.

![The Multi Selector tool showing the Custom selector option in a column dropdown](/docs/tutorials/multi-selector-tool-custom.jpg)

![A custom CSS selector entered into the Multi Selector text field](/docs/tutorials/using-custom-selector.jpg)

To set the custom selector dynamically from a data variable, click **Set selector from data** and pick the token that contains the selector. This is useful when you want to loop through several different selectors at runtime.

![Passing a data variable into the custom selector field](/docs/tutorials/pass-data-into-selector-tool.jpg)

## Loop through custom selectors
***

Use the [Loop through data](/docs/no-code-tool/how-it-works/loop) step to run an interaction against multiple custom selectors in turn. Common use cases:

- Click through multiple buttons on a page.
- Tick a series of checkboxes.
- Walk a list of items, perform actions on each, then move to the next.
- Scrape data from inconsistent layouts where each row needs a different selector.

To set this up:

1. **Read.** Add a [Read data from a Google Sheet](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step) step to load your list of CSS selectors.
2. **Loop.** Add a [Loop through data](/docs/no-code-tool/reference/steps/loop) step using the output of the Read data step.
3. **Interact.** Inside the loop, add your interact step (for example [Click element](/docs/no-code-tool/reference/steps/click-element)) and configure it using a custom CSS selector. Follow the instructions in [Add a custom CSS selector](#add-a-custom-css-selector).
4. **Run.** Run the automation and check that each selector matches the right element.

![A Google Sheet containing a column of CSS selectors used to drive the loop](/docs/tutorials/custom-selector-gsheets-example.png)

> **Tip:** Use the [Edit a row in a Google Sheet](/docs/no-code-tool/reference/steps/edit-row) step to write scraped data back to the same row as the selector that produced it.

## Choose a good selector
***

A good selector is unique to the element you want, and stable enough to keep working when the page changes. Some sites make this deliberately hard to deter automation.

The examples below introduce the main selector types in the context of axiom.ai. For deeper tutorials, see [Additional resources](#additional-resources).

To inspect the underlying HTML, right-click anywhere on the page and choose **Inspect**.

### Class-based selectors

HTML:

```html
<h1 class="main-heading">Interest rates cut for first time in over four years</h1>
```

axiom.ai selector:

```css
.main-heading
```

### ID-based selectors

HTML:

```html
<h1 id="main-heading">Interest rates cut for first time in over four years</h1>
```

axiom.ai selector:

```css
#main-heading
```

### Attribute-based selectors

HTML:

```html
<input aria-activedescendant="" aria-controls="suggestions" aria-expanded="false" aria-haspopup="listbox" id="searchInput" placeholder="Search the BBC" role="combobox">
```

axiom.ai selectors (either works):

```css
[aria-controls="suggestions"]
[placeholder="Search the BBC"]
```

### Grouped selectors

When a single selector isn't unique, combine two or more to narrow the match. Try different combinations until the selector picks only the element you want.

Group by class and element:

```css
header .consent-banner-text a
```

Group by attribute and element:

```css
input[aria-controls="suggestions"]
```

Group by ID and element:

```css
#main-heading a
```

### Advanced selectors

For more specific cases, CSS pseudo-classes give you finer control:

- `:not()` excludes elements that match a sub-selector. See [`:not()` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:not).
- `:has()` matches elements that contain a descendant matching a sub-selector. See [`:has()` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:has).

For example, to select list items that don't also have the `link` class:

```css
p.list-item:not(.list-item.link)
```

To target an anchor whose `href` contains `checkout-`:

```css
a:has([href*="checkout-"])
```

## Use nth-child() to target elements by position
***

`nth-child()` selects an element by its position within a parent. This is useful for picking out one specific item from a list, or for looping through every item in a series.

To loop through a series of elements, list each `nth-child()` selector as a row in a Google Sheet:

| Selector |
| --- |
| `button.download:nth-child(1)` |
| `button.download:nth-child(2)` |
| `button.download:nth-child(3)` |

Then use a Loop through data step to set the custom selector on your interact step to each row in turn.

## Additional resources
***

- [Selectors on MDN](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors)
- [Type, class, and ID selectors on MDN](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Type_Class_and_ID_Selectors)
- [Chrome DevTools CSS reference](https://developer.chrome.com/docs/devtools/css)