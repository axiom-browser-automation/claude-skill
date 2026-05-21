---
title: Click engagement button
metaTitle: Toggle a like/follow/subscribe button in an axiom.ai cloud browser session
description: Click a like, follow, subscribe, or similar toggle only when it isn't already in the target state, using axiom.clickEngagementButton().
order: 7
---

`axiom.clickEngagementButton(select, setValueToCheck)` clicks a toggle button (like, follow, subscribe) only when its visible label doesn't already match the target state. Use it to make like/follow steps idempotent — running them twice won't accidentally unlike or unfollow.

## Signature
***

```javascript
await axiom.clickEngagementButton(select, setValueToCheck);
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `select` | string | Yes | CSS selector for the button. |
| `setValueToCheck` | string | Yes | Text that indicates the button is already in the target state. If the button's text matches, the step is a no-op. |

## Example
***

Follow a user, but only if they're not already followed:

```javascript
await axiom.clickEngagementButton("button.follow-action", "Following");
```

If the button reads "Follow", the step clicks it. If it already reads "Following", the step is a no-op. The same step type as the No-Code Tool's [**Click engagement button**](/docs/no-code-tool/reference/steps/click-engagement-button).

## Notes
***

- The match is on the button's visible text. Aria-pressed or other state attributes are ignored.
- For non-toggle buttons (where clicking again does something different rather than reverting), use [`axiom.click()`](/docs/developer-hub/api/step-functions/click) instead.

## Related
***

- [Click](/docs/developer-hub/api/step-functions/click)
