---
title: Go to URL
metaTitle: Send an axiom.ai cloud browser session to a URL with axiom-api
description: Send the cloud browser session to a URL using axiom.goto() and wait for the page to load.
order: 3
---

`axiom.goto(url)` sends the session's page to a URL and resolves once the page has loaded. The same step type as the No-Code Tool's [**Go to page**](/docs/no-code-tool/reference/steps/goto), called from your code.

## Signature
***

```javascript
await axiom.goto(url, doNotShareLocalstorage, openInNewTab);
```

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `url` | string | Yes | — | URL to navigate to. Must use `http` or `https` scheme. |
| `doNotShareLocalstorage` | boolean | No | `false` | When `true`, isolates `localStorage` from any previously visited origins in the session. |
| `openInNewTab` | boolean | No | `false` | When `true`, opens the URL in a new tab rather than reusing the current page. |

## Example
***

```javascript
await axiom.browserOpen();
await axiom.goto("https://example.com/login");
```

## URL constraints
***

Only `http` and `https` URLs are accepted. Other schemes are rejected:

- `file://`: the cloud sandbox has no local filesystem.
- `data:`: not supported.
- `chrome://`: browser-internal pages are not exposed.

## Notes
***

- The cloud browser uses a datacentre IP. Some sites block known datacentre ranges with bot detection, expect this on those targets.
- The call resolves once the page's `load` event fires. For pages that finish their real work after `load` (single-page apps, lazy-loaded content), insert an [`axiom.wait()`](/docs/developer-hub/api/step-functions/wait) before the next step, or retry the next step with your own loop.
- There's no wait-for-selector method today. Use `axiom.wait()` for a fixed pause, or retry your next call until it stops throwing.

## Related
***

- [Click](/docs/developer-hub/api/step-functions/click)
- [Wait](/docs/developer-hub/api/step-functions/wait)
- [Switch browser tab](/docs/developer-hub/api/step-functions/switch-browser-tab)
