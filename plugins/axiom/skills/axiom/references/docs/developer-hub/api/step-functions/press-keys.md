---
title: Press keys
metaTitle: Fire keyboard events in an axiom.ai cloud browser session
description: Send keyboard key presses (Enter, Tab, arrow keys, modifier combinations) to the currently focused element using axiom.pressKeys().
order: 10
---

`axiom.pressKeys(key)` fires a keyboard event on the currently focused element. Use it for control keys ([`axiom.enterText()`](/docs/developer-hub/api/step-functions/enter-text) handles ordinary typed text), modifier combinations, and keyboard navigation. The same step type as the No-Code Tool's [**Press key(s)**](/docs/no-code-tool/reference/steps/press-keys).

## Signature
***

```javascript
await axiom.pressKeys(key, delimiter, delay);
```

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `key` | string \| string[] | Yes | — | A single key name (`"Enter"`, `"Tab"`, `"ArrowDown"`), an array of keys to press as a chord (`["Control", "a"]`), or a delimited string parsed via `delimiter`. |
| `delimiter` | string | No | — | When `key` is a string, split it on this delimiter into multiple keys to be pressed in sequence. |
| `delay` | number | No | `10` | Milliseconds between successive key presses. |

Key names follow the [Chrome DevTools key constants](https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-dispatchKeyEvent) (`Enter`, `Tab`, `Escape`, `ArrowLeft`, `Control`, `Meta`, etc.). On cloud Linux pods, `"Meta"` is automatically rewritten to `"Control"` so the same script works regardless of the underlying OS.

## Examples
***

**Submit a form by pressing Enter:**

```javascript
await axiom.click("input#search");
await axiom.enterText("input#search", "ergonomic keyboard");
await axiom.pressKeys("Enter");
```

**Select-all in the focused field:**

```javascript
await axiom.pressKeys(["Control", "a"]);
```

**Navigate a custom listbox with arrow keys, then commit:**

```javascript
await axiom.pressKeys("ArrowDown,ArrowDown,Enter", ",", 80);
```

## Notes
***

- The event targets whatever element currently has focus. Click an input first (or use [`axiom.enterText()`](/docs/developer-hub/api/step-functions/enter-text) to focus by selector) before pressing keys that the page should treat as field input.
- For ordinary text input, prefer [`axiom.enterText()`](/docs/developer-hub/api/step-functions/enter-text) — it handles focusing the element for you.

## Related
***

- [Enter text](/docs/developer-hub/api/step-functions/enter-text)
- [Click](/docs/developer-hub/api/step-functions/click)
