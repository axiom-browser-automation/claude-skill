---
title: Click multiple
metaTitle: Click every matching element in an axiom.ai cloud browser session
description: Click every element matching a CSS selector, up to a maximum, using axiom.clickMultiple().
order: 6
---

`axiom.clickMultiple(select)` clicks every element that matches a CSS selector, up to a cap. The same step type as the No-Code Tool's [**Click multiple elements**](/docs/no-code-tool/reference/steps/click-multiple), called from your code.

## Signature
***

```javascript
await axiom.clickMultiple(select, leftClickRightClick, maxClicks);
```

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `select` | string | Yes | — | CSS selector matching the elements to click. |
| `leftClickRightClick` | string | No | `"left"` | `"left"` or `"right"`. |
| `maxClicks` | number | No | unlimited | Cap on how many elements to click. Use this to bound runtime on pages that match more elements than you want to act on. |

## Example
***

Expand every collapsed section on a page (up to 20):

```javascript
await axiom.clickMultiple(".section-header.collapsed", "left", 20);
```

## Notes
***

- Elements are clicked in document order.
- Hidden, zero-size, or disabled elements throw — there's no "skip if not clickable" mode on this method. For a defensive pass, loop on [`axiom.click()`](/docs/developer-hub/api/step-functions/click) with `optionalClick: true` instead.
- For per-element work (read state, decide whether to click, click), drive the loop in your own code with `axiom.click()` rather than `clickMultiple`.

## Related
***

- [Click](/docs/developer-hub/api/step-functions/click)
- [Click engagement button](/docs/developer-hub/api/step-functions/click-engagement-button)
