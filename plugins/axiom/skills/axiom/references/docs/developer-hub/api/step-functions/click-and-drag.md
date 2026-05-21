---
title: Click and drag
metaTitle: Mouse-press and drag between two coordinates in an axiom.ai cloud browser session
description: Press the mouse at one coordinate, drag to another, and release using axiom.clickAndDrag(). Useful for sliders, range pickers, drag-and-drop UIs, and slider captchas.
order: 9
---

`axiom.clickAndDrag(startCoordinates, endCoordinates)` presses the mouse at one coordinate, drags to another, and releases. Use it for sliders, drag-and-drop UIs, and any control that responds to a press-move-release rather than a click. The same step type as the No-Code Tool's [**Mouse click & drag**](/docs/no-code-tool/reference/steps/mouse-drag).

## Signature
***

```javascript
await axiom.clickAndDrag(startCoordinates, endCoordinates);
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `startCoordinates` | object | Yes | `{ scrollX, scrollY, clientX, clientY }`. Where the mouse-down event fires. |
| `endCoordinates` | object | Yes | `{ scrollX, scrollY, clientX, clientY }`. Where the mouse-up event fires. |

`scrollX` / `scrollY` are the page-relative coordinates (the document position). `clientX` / `clientY` are viewport-relative. For most ordinary drag operations on a page that isn't scrolled in either axis, the four values are equal pairwise.

## Example
***

Slide a range control from `x=100` to `x=300` on the same horizontal line (`y=400`):

```javascript
await axiom.clickAndDrag(
  { scrollX: 100, scrollY: 400, clientX: 100, clientY: 400 },
  { scrollX: 300, scrollY: 400, clientX: 300, clientY: 400 }
);
```

## Notes
***

- This step works in raw coordinates, not selectors. To anchor a drag to an element, compute the element's bounding box in a previous step (in the No-Code Tool the selector tool does this for you) and pass the result.
- For drag operations that depend on HTML5 drag-and-drop events (`dragstart`, `dragover`, `drop`), some sites won't respond to a synthesized mouse drag. Test before relying on this for HTML5 drag UIs.

## Related
***

- [Click](/docs/developer-hub/api/step-functions/click)
- [Hover](/docs/developer-hub/api/step-functions/hover)
