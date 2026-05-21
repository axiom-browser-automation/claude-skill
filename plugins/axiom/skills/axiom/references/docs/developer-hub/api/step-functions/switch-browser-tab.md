---
title: Switch browser tab
metaTitle: Switch the active tab in an axiom.ai cloud browser session
description: Switch the cloud browser session's focus to another tab using axiom.switchBrowserTab().
order: 13
---

`axiom.switchBrowserTab(selectTab)` switches the session's active tab. Use it after [`axiom.goto(url, false, true)`](/docs/developer-hub/api/step-functions/goto) (or any other action that opens a new tab) to drive the newly opened tab. The same step type as the No-Code Tool's [**Switch browser tab**](/docs/no-code-tool/reference/steps/switch-tab).

## Signature
***

```javascript
await axiom.switchBrowserTab(selectTab);
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `selectTab` | string | Yes | A substring of the target tab's title or URL. The session switches to the first tab whose title or URL contains this string. |

## Example
***

Open a second tab and switch focus to it:

```javascript
await axiom.goto("https://example.com/dashboard");
await axiom.goto("https://example.com/reports", false, true);   // opens in new tab
await axiom.switchBrowserTab("reports");                          // focus the new tab
await axiom.click(".export-csv");
```

## Notes
***

- The match is a substring search against tab title and URL. Use a string that's unique to the target tab — if multiple tabs match, the first match wins.
- After a switch, subsequent step methods act on the newly active tab. The previous tab stays open until the session closes (or you switch back and close it).
- All tabs share runtime quota and the same `axiom` instance. For genuine parallelism, create multiple `AxiomApi` instances.

## Related
***

- [Go to URL](/docs/developer-hub/api/step-functions/goto)
- [Close a session](/docs/developer-hub/api/step-functions/close-a-session)
