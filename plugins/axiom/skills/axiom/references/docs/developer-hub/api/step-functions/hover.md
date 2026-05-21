---
title: Hover
metaTitle: Hover an element in an axiom.ai cloud browser session
description: Move the mouse over an element to trigger hover-only UI (dropdown menus, tooltips, lazy-loaded content) using axiom.hover().
order: 8
---

`axiom.hover(select)` moves the mouse pointer over the first element matching a CSS selector and fires the corresponding `mouseover` events. Use this to open dropdown menus, surface tooltips, or trigger lazy-loaded content that only appears on hover. The same step type as the No-Code Tool's [**Rollover element**](/docs/no-code-tool/reference/steps/rollover).

## Signature
***

```javascript
await axiom.hover(select);
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `select` | string | Yes | CSS selector for the element to hover over. |

## Example
***

Open a hover-only navigation menu, then click an item inside it:

```javascript
await axiom.hover("nav .menu-trigger");
await axiom.click(".dropdown-menu .item-settings");
```

## Notes
***

- The hover persists until the next mouse move. A subsequent [`axiom.click()`](/docs/developer-hub/api/step-functions/click) elsewhere on the page will move the mouse and dismiss any hover-revealed UI — chain hover and click without other interleaved steps.
- Some sites use focus-based dropdowns rather than hover. For those, [`axiom.click()`](/docs/developer-hub/api/step-functions/click) the trigger instead.
- Selectors operate on the top-level document only.

## Related
***

- [Click](/docs/developer-hub/api/step-functions/click)
- [Click and drag](/docs/developer-hub/api/step-functions/click-and-drag)
