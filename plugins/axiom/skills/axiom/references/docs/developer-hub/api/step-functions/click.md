---
title: Click
metaTitle: Click an element in an axiom.ai cloud browser session
description: Click a button, link, or any other element in a cloud browser session by passing a CSS selector to axiom.click().
order: 4
---

`axiom.click(select)` clicks the first element on the page that matches a CSS selector. The same step type as the No-Code Tool's [**Click element**](/docs/no-code-tool/reference/steps/click), called from your code with a selector you choose at runtime.

## Signature
***

```javascript
await axiom.click(select, leftClickRightClick, optionalClick);
```

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `select` | string | Yes | — | CSS selector for the element to click. |
| `leftClickRightClick` | string | No | `"left"` | `"left"` or `"right"`. Use `"right"` to fire a context-menu click. |
| `optionalClick` | boolean | No | `false` | When `true`, the call resolves successfully even if the selector matches zero elements. Useful for "click if present" cleanups (close-banner, accept-cookies). |

If the selector matches multiple elements, only the first is clicked. For batched clicks, use [`axiom.clickMultiple()`](/docs/developer-hub/api/step-functions/click-multiple).

## Example
***

```javascript
await axiom.browserOpen();
await axiom.goto("https://example.com/login");
await axiom.click("button[type=submit]");
```

## Common patterns
***

**Optional dismiss.** Cookie banners and consent modals only appear sometimes. With `optionalClick`, the step is a no-op when they're absent:

```javascript
await axiom.click("#cookie-accept", "left", true);
```

**Right-click for context menus.**

```javascript
await axiom.click(".file-row", "right");
```

## Notes
***

- Hidden, zero-size, or disabled elements throw an error unless `optionalClick` is `true`.
- Selectors operate on the top-level document only. Elements inside iframes are not reachable today.
- For elements without a stable selector (no ID, no class), use a more specific path like `nav > ul > li:nth-child(3) > a`.

## Related
***

- [Click multiple](/docs/developer-hub/api/step-functions/click-multiple)
- [Hover](/docs/developer-hub/api/step-functions/hover)
- [Enter text](/docs/developer-hub/api/step-functions/enter-text)
