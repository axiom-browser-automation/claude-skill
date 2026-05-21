---
title: Date picker
metaTitle: Pick a date in a calendar widget in an axiom.ai cloud browser session
description: Navigate a calendar widget month by month and pick a target day using axiom.datePicker().
order: 12
---

`axiom.datePicker(selectMonth, selectMonthChangeButton, changeMonthTo, changeDayOfMonthTo)` drives a calendar-widget date picker: it advances the calendar until the visible month matches your target, then clicks the day. The same step type as the No-Code Tool's [**Date picker**](/docs/no-code-tool/reference/steps/date-picker).

## Signature
***

```javascript
await axiom.datePicker(selectMonth, selectMonthChangeButton, changeMonthTo, changeDayOfMonthTo);
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `selectMonth` | string | Yes | CSS selector for the element that displays the currently shown month (e.g. the calendar's header). |
| `selectMonthChangeButton` | string | Yes | CSS selector for the "next month" button on the widget. The step clicks it until the displayed month matches `changeMonthTo`. |
| `changeMonthTo` | string | Yes | The target month name (e.g. `"June 2026"`). Matched fuzzily against the text of `selectMonth` so a small format difference is tolerated. |
| `changeDayOfMonthTo` | string | Yes | The target day (e.g. `"15"`). The step clicks the closest matching day cell. |

## Example
***

```javascript
await axiom.click("#checkin-date");           // open the picker
await axiom.datePicker(
  ".calendar .month-header",                  // selectMonth
  ".calendar .next-month-button",             // selectMonthChangeButton
  "June 2026",
  "15"
);
```

## Notes
***

- This step is built for **forward navigation only** — it clicks `selectMonthChangeButton` repeatedly. If your target month is in the past relative to the picker's initial month, pass the "previous month" button as `selectMonthChangeButton` instead.
- The day match picks the calendar cell closest in document order. On months where the first/last few cells belong to the previous/next month, this can occasionally pick the wrong cell — verify your selector targets only the current month's day cells.
- For non-widget date inputs (`<input type="date">`), use [`axiom.enterText()`](/docs/developer-hub/api/step-functions/enter-text) with an ISO date string instead.

## Related
***

- [Click](/docs/developer-hub/api/step-functions/click)
- [Select list](/docs/developer-hub/api/step-functions/select-list)
