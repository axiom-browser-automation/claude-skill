---
title: Enter text
metaTitle: Enter text into an input in an axiom.ai cloud browser session
description: Enter text into an input, textarea, or other focusable element in a cloud browser session using axiom.enterText().
order: 5
---

`axiom.enterText(selectTextField, text)` enters text into the first element matching a CSS selector. The same step type as the No-Code Tool's [**Enter text**](/docs/no-code-tool/reference/steps/enter-text), called from your code.

## Signature
***

```javascript
await axiom.enterText(selectTextField, text, delay, appendExisting, customLineBreak, optionalText);
```

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `selectTextField` | string | Yes | — | CSS selector for the input. |
| `text` | string | Yes | — | Text to enter into the input. |
| `delay` | number | No | `0` | Per-keystroke delay in milliseconds. Use a non-zero value (e.g. 50–100) when target sites debounce input or run keystroke-based validation. |
| `appendExisting` | boolean | No | `false` | When `true`, appends to the field's current value instead of replacing it. |
| `customLineBreak` | string \| null | No | `null` | Token in `text` to translate into a real newline keypress. Use this when the field treats Enter as "submit" but you want literal multi-line input. |
| `optionalText` | boolean | No | `false` | When `true`, the call resolves successfully even if the selector matches zero elements. |

## Example
***

```javascript
await axiom.browserOpen();
await axiom.goto("https://example.com/login");
await axiom.enterText("#email", "user@example.com");
await axiom.enterText("#password", process.env.PW);
await axiom.click("button[type=submit]");
```

## Common patterns
***

**Slow down for picky inputs.** Search-as-you-type fields and React-controlled inputs sometimes drop characters when typed instantly. A small per-character delay fixes most cases:

```javascript
await axiom.enterText("#search", "ergonomic keyboard", 60);
```

**Append rather than replace.** By default `enterText` replaces the field's contents. Set `appendExisting` to `true` to add to it:

```javascript
await axiom.enterText("textarea#notes", "\n\nUpdated " + new Date().toISOString(), 0, true);
```

**Multi-line text without submitting.** If the form treats Enter as submit, escape line breaks with a custom token and pass it as `customLineBreak`:

```javascript
await axiom.enterText("textarea", "line one<BR>line two<BR>line three", 0, false, "<BR>");
```

## Notes
***

- Best results on `<input>` and `<textarea>`. Behaviour on `contenteditable` divs and custom controls (rich-text editors, code editors) varies — test before relying on it.
- For control keys (Tab, Enter, arrow keys) on their own, use [`axiom.pressKeys()`](/docs/developer-hub/api/step-functions/press-keys).
- The element must be focusable. Disabled, hidden, or zero-size inputs throw an error unless `optionalText` is `true`.

## Related
***

- [Press keys](/docs/developer-hub/api/step-functions/press-keys)
- [Click](/docs/developer-hub/api/step-functions/click)
- [Select list](/docs/developer-hub/api/step-functions/select-list)
