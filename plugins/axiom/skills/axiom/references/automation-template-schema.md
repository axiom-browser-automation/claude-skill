# `AutomationTemplate` JSON — what the schema actually wants

The canonical schema is [`automation-template-schema.json`](./automation-template-schema.json). This prose explains the shape so Claude doesn't have to re-derive it from the schema on every run.

## Top-level shape (required fields only)

```jsonc
{
  "id": 0,                              // 0 for new axioms (server assigns on save)
  "openWidgetIndex": -1,                // -1 unless you want a specific widget pre-opened in the UI
  "name": "Scrape product prices",      // user-visible name
  "templateId": 0,                      // 0 for from-scratch; non-zero only when based on a registry template
  "triggers": [],                       // empty unless the axiom is scheduled
  "share_status": false,
  "share_link": "",
  "stored_cookies": [],
  "data": {                             // the actual workflow
    "form": [/* widgets */],            // the step sequence — the meaty bit
    "context": [{"context": "url", "url": "https://example.com/products"}],
    "mode": "browser",
    "headless": false,
    "incognitoMode": false,
    "templateMode": false,
    "templateStarted": false,
    "templateId": 0,
    "templateItem": {"name": "Scrape product prices", "description": ""},
    "builderTemplateId": 0,
    "allowConcurrencyDesktop": true,
    "disallowConcurrencyCloud": false,
    "injector": {"injector": "dom", "magic_btn_status": true, "selector": ""},
    "storeCookies": false,
    "tokens": null,
    "viewport": null
  }
}
```

## Widget (`data.form` entry) — required fields

Every widget has:

```jsonc
{
  "machine_name": "WidgetDriverGoto",     // see action-vocabulary.json for the full enum
  "name": "Go to page",                   // user-visible label
  "stepNumber": "1",                      // string, sequential
  "params": [/* param objects */]          // type-specific; see widget docs
}
```

`machine_name` MUST be a value in [`action-vocabulary.json`](./action-vocabulary.json)'s `widgetActionList[].action` or `baseActionList[].machineName`. The schema enforces this via an enum.

## Triggers (only present for scheduled axioms)

```jsonc
{
  "name": "Daily at 9am",
  "status": "active",                   // "active" or "paused"
  "type": "recursive",                  // "recursive" | "once"
  "time_criteria": 86400,
  "interval_type": "seconds",           // "seconds" | "minutes" | "hours" | "days"
  "starting_time": "2026-05-21 09:00:00+00"
}
```

## Common widget shapes (cheat-sheet)

Look at the three vendored examples in [`../examples/no-code/`](../examples/no-code/) for golden patterns:

- `download-a-file-from-website-to-google-drive.json` — `goto` then a Google Drive widget.
- `scrape-google-maps-data-to-google-sheet.json` — scrape + sheet write.
- `support-triage-bot-v2.json` — branching / conditional logic.

When in doubt: pattern-match against a vendored example, then validate.

## Validate before declaring done

```bash
npm run validate:no-code -- /tmp/my-axiom.json
```

Exit 0 = valid. Exit 1 = AJV prints the errors with `instancePath` pointing at the broken field.
