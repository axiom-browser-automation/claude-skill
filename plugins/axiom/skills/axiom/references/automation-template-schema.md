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

The Chrome extension importer requires the **full canonical step shape** — every field documented in `docs/developer-hub/deep-dives/axiom-structure.md`, and every param the widget declares (with its real `name`, `type`, `description`, `default_value`, `help`, etc.). Missing fields make the step render as `undefined: <name>` in the builder. A minimal step looks like this:

```jsonc
{
  "machine_name": "WidgetDriverGoto",     // the widget's canonical key
  "index": 0,                             // 0-based position; the extension orders steps by it
  "method": {"driver": "driver.gotoV4070"}, // what the runner dispatches on — copy from the vocabulary
  "modes": ["driver"],                    // ["driver"] or ["browser"] — copy from the vocabulary
  "name": "Go to page",                   // user-visible display label (defaults to original_name)
  "original_name": "Go to page",          // canonical widget name — the importer renders this
  "description": "Instruct the bot...",   // preserved from widget def at creation time
  "stepNumber": "1",                      // string, sequential (1-based)
  "token": "",                            // the step's output token name (empty if none)
  "hasErrors": false,
  "metadata": "",
  "params": [/* every param the widget declares */]
}
```

**`method`, `modes`, and `index` are load-bearing at runtime, not cosmetic.** The extension's runner dispatches each step on `method.{driver|browser}` and orders steps by `index`. A step that omits them imports without complaint but **never executes** — the browser sits on `about:blank` and the run hangs. `method` and `modes` come straight from the widget's entry in [`action-vocabulary.json`](./action-vocabulary.json) (`widgetActionList[].method` / `.modes`); `index` is the step's 0-based position. `build-axiom.js` fills all three in for you — this is the main reason not to hand-compose steps.

**`token` names the step's output.** Roughly half the widgets (scrapers, sheet readers, downloads, date/time, …) produce data the rest of the axiom can reference by token; the vocabulary carries a canonical default per widget (`scrape-data` for SmartScraper, `link-data` for ScrapeLinks, `google-sheet-data` for ReadGoogleSheet, …). `build-axiom.js` fills the vocab default automatically, and `buildAxiom` deduplicates collisions across steps (two scrapers in one axiom become `scrape-data` + `scrape-data-2`). Pass `token: "my-name"` in the step intent only when you want a custom name. An output-producing widget shipped with `token: ""` runs but produces no referenceable output — the validator flags this.

Each param needs `collapsible`, `configurable`, `default_value`, `description`, `help`, `image`, `name`, `type`, `value` — not just the ones you care about. The importer iterates the canonical param list and missing entries render blank.

**Don't hand-compose this shape.** Use [`scripts/build-axiom.js`](../scripts/build-axiom.js) — it clones the canonical shape from `widgetActionList` for you and only requires you to specify `machineName` + the `value` overrides. See [SKILL.md Step 3](../SKILL.md) for the workflow.

`machine_name` MUST be a value in [`action-vocabulary.json`](./action-vocabulary.json)'s `widgetActionList[].machineName`. The strengthened validator (`scripts/validate-no-code.js`) rejects unknown values plus mismatches between the step's param list and the widget's declared params.

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

## Examples

The three reference axioms in [`../examples/no-code/`](../examples/no-code/) are regenerated through the build-axiom helper — they're the canonical shape the importer accepts:

- `visit-example.json` — minimal one-step navigation
- `scheduled-daily.json` — Goto + SaveHTML, with a daily trigger
- `scrape-and-write-sheet.json` — Goto + SmartScraper + WriteGoogleSheet

Read them to see the full step shape, but **don't hand-copy** the structure into a new axiom — go through `build-axiom.js` instead.

## Validate before declaring done

```bash
npm run validate:no-code -- /tmp/my-axiom.json
```

Exit 0 = valid. Exit 1 = AJV prints the errors with `instancePath` pointing at the broken field.
