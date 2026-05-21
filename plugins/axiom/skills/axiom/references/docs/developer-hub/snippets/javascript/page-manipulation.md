---
title: Page manipulation snippets
metaTitle: JavaScript snippets for hiding and modifying page elements
description: JavaScript snippets for manipulating the current page during an axiom.ai automation, including hiding elements that block other interactions.
order: 5
---

Page manipulation snippets modify the current page directly, useful when something on the page (a popup, an overlay, an autoplaying video) is getting in the automation's way.

## Hide page elements
***

Hide the first element matching a selector. Useful for popups or overlays that block elements you need to click:

```js
document.querySelector('<SELECTOR>').style.display = 'none';
```

Hide every element matching a selector:

```js
var els = document.querySelectorAll('<SELECTOR>');
for (var i = 0; i < els.length; i++) {
    els[i].style.display = 'none';
}
```