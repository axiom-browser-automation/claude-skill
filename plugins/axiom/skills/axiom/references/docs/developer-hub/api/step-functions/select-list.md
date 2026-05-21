---
title: Select list
metaTitle: Pick an option in a native dropdown in an axiom.ai cloud browser session
description: Pick an option in a native HTML <select> element by visible text using axiom.selectList().
order: 11
---

`axiom.selectList(select, text)` picks an option in a native HTML `<select>` element by matching on the option's visible text. The same step type as the No-Code Tool's [**Select list**](/docs/no-code-tool/reference/steps/select-list).

## Signature
***

```javascript
await axiom.selectList(select, text);
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `select` | string | Yes | CSS selector for the `<select>` element. |
| `text` | string | Yes | Visible text of the option to pick (matched case-sensitively against `<option>` text content). |

## Example
***

```javascript
await axiom.selectList("select#country", "United Kingdom");
```

## Notes
***

- Only works on native `<select>` elements. Custom-built dropdowns (divs styled as dropdowns, headless-UI listboxes, React-Select, etc.) don't respond to this — drive them with [`axiom.click()`](/docs/developer-hub/api/step-functions/click): click the trigger, then click the option.
- Matching is on the option's visible text, not its `value` attribute. If the visible text and the underlying value diverge, use the visible text.
- If no option matches `text` exactly, the step throws.

## Related
***

- [Click](/docs/developer-hub/api/step-functions/click)
- [Enter text](/docs/developer-hub/api/step-functions/enter-text)
