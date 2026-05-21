---
title: Navigation snippets
metaTitle: JavaScript snippets for browser history navigation
description: JavaScript snippets for moving through browser history in axiom.ai automations, including going back one or several pages.
order: 3
---

Navigation snippets move the current tab through its history.

## Move through browser history
***

Go back one page, equivalent to the [**Back**](/docs/no-code-tool/reference/steps/back) step but available in JavaScript:

```js
window.history.back();
```

Go back a specific number of pages. The argument is a negative number for backward navigation, positive for forward:

```js
window.history.go(-2);
```