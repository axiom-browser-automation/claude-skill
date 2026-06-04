# Changelog

## 0.7.13 — fix: purge `scrape(null)` anti-pattern from bundled examples + docs (closes S1 from the harness findings)

Two scenarios in the latest harness run (16, 19) produced coded axioms that called `axiom.scrape(null, …)` — passing `null` for the `url` argument. The cloud driver rejects this with a 500: `url` is required. The runtime fix shipped in `@axiom_ai/api@1.0.4` (the method now navigates to `url` internally before scraping, so `null` no longer makes sense), but the skill's bundled examples and reference docs still taught the old pattern, and Claude was emitting it verbatim.

Cleaned up across six files:

- `examples/coded/simple-scrape.js` — pulled fresh from `axiom-api/examples/` (now uses a real URL).
- `examples/coded/login-then-extract.js` — same.
- `examples/coded/parallel-sessions.js` — same.
- `references/axiom-api-surface.md` — `scrape()` row rewritten to call out `url` is required + the post-login navigation behaviour (cookies persist across the internal navigation).
- `references/docs/developer-hub/api/step-functions/integrate-ai.md` — two `scrape(null, …)` examples replaced with real URLs.
- `references/docs/developer-hub/api/step-functions/step-function-vs-no-code-step.md` — table row rewritten to match the new surface.md text.

Test fixture `test/coded/fixtures/invalid/missing-finally.MISSING_LIFECYCLE.js` also updated — its purpose is to fail on the missing `try/finally`, the `scrape(null)` was incidental.

`api-publish/test-env/axiom-api.tgz` refreshed from `@axiom_ai/api@1.0.4` so the bundled package the container sees matches the latest published surface (the previous tarball was pinned at v1.0.0 and was reinforcing the stale teaching from inside the container).

221/221 tests green.

## 0.7.12 — feat: `WidgetDriverSmartScraper.Select` now accepts an array of column specs (closes P2 from the harness findings)

The v0.7.11 harness re-run confirmed scenarios 03/07/08 fixed but scenario 02 still failed — Claude scaffolded a SmartScraper step with only the row-container selector (`article.product_pod`) and told the user to wire columns manually. Judge: *"defines no column selectors for title, price, or stock, so the scrape produces no actual structured columns and nothing meaningful is written to the sheet."*

Root cause located in `axiom_lib/lib/execution/AxiomApiHelper.js#buildSelectorArray`: the runtime accepts the `smart_selector` param as **either** a string (legacy single-selector) **or** an array of objects with `{selector, resultType}` per column. The helper had no way to express the array shape — it just passed values through verbatim, so callers had to know the full UI-built shape (including `selectedElements` / `rejectedElements` fingerprints) to populate columns.

Fix in `build-axiom.js`: any value targeting a param of type `smart_selector` is now normalised — callers can pass

```js
'Select': [
  { selector: 'article.product_pod h3 a',          resultType: 'textContent' },
  { selector: 'article.product_pod .price_color',  resultType: 'textContent' },
  { selector: 'article.product_pod .availability', resultType: 'textContent' },
]
```

and the helper fills in `selectedElements: []` + `rejectedElements: []` (UI-only fields the runtime ignores). `resultType` defaults to `"textContent"` when omitted. The legacy single-string form (`'Select': 'article.product_pod'`) still works — strings pass through unchanged.

Also adds a "Multi-column scraping" subsection to SKILL.md Step 3 with the canonical shape + the four valid `resultType` values (`textContent`, `innerHTML`, `link`, `axiom-download`).

Three new unit tests pin the happy path + the string-passthrough + preserving UI-pre-populated `selectedElements`. 221/221 green.

## 0.7.11 — feat: skill can now produce fully-wired loops and step-to-step data flows (closes the "defer to manual" gap from the v0.7.10 harness run)

The first run of the LLM-driven test harness (`api-publish/test-env/llm-harness/`) caught a consistent pattern: when a user prompt involved "for each row of this sheet, do X" or any step that consumed another step's output, the skill produced a *scaffold* — structurally valid JSON with correct selectors — but left the actual wiring (loop + token references between steps) for the user to finish in the Axiom builder UI. Symptom in the user-facing transcripts:

> *"I couldn't bake the loop step into the JSON — Axiom's loop widget has a malformed field the importer's validator rejects, so it's a one-click add in the UI."*

Root cause (verified against `axiom_extension/test/agent/axioms/axiom_test_correct.json` for the canonical loop shape):

- The schema permits `TemplateLoopThroughData` as a `machine_name`, but **that's the extension's macro name** — the actual JSON uses **`WidgetBotCreate` (start) + body + `WidgetBotComplete` (end)**, with the start carrying `isLooping: true` + `afterLoopUpdate: true` and the body sub-numbered (`"3.1"`, `"3.2"`, …) under the parent.
- `WidgetBotCreate`'s `Loop through data` param is type `bot_token` whose populated shape is `value: ["[<upstream-token-name>]"]` — a single-element array containing the upstream token name in square brackets. The same shape applies to every other token-typed param across the surface (`token`, `token_list`, `merge_token`, `merge_token_list`).
- `build-axiom.js`'s old `values: { paramName: literalValue }` shape had no way to express "this param references step N's output token" — so Claude (correctly) refused to emit broken JSON and punted to the user.

Fix:

- **`build-axiom.js`** — step intent now accepts `tokenRefs: { paramName: "upstreamTokenName" }` alongside `values`. The helper resolves each entry to the canonical `["[<name>]"]` array shape, validates that the target param is one of the token-typed types listed above (rejects with a clear error otherwise), and assigns it to the param's `value`. Arrays-of-names are also accepted for multi-token params. The intent shape also now takes a per-step `stepNumber` override — used to label loop-body sub-steps like `"3.1"` under their parent BotCreate's `"3"`.
- **`action-vocabulary.json`** — patched `WidgetBotCreate` with `isLooping: true` + `afterLoopUpdate: true` (importer-required step-level flags); patched its `driverLaunchOptions` param `type` from `""` to `"hidden"` so the value passes the AJV enum.
- **`SKILL.md`** Step 3 — new "Loops" subsection teaching `WidgetBotCreate` + body + `WidgetBotComplete`, with the `stepNumber` convention spelled out and a pointer to the new example. Plus a general "Token references between steps" subsection explaining when to use `tokenRefs` vs `values`.
- **`examples/no-code/loop-through-sheet.json`** — new fully-wired sheet → loop → body example, generated by `buildAxiom` itself (so it provably matches what the helper produces) and validated against `automation-template-schema.json`.

What this unblocks (from the v0.7.10 harness findings):

- **Scenario 03** (sheet → form, single iteration) — the skill can now wire `WidgetReadGoogleSheet` → `WidgetBotCreate` → form-fill body → `WidgetBotComplete` directly.
- **Scenario 07** (conditional add-to-cart) — `WidgetContinue`'s `Data to check` (`token` type) is now wirable via the same `tokenRefs` mechanism — no more empty `[]` placeholder.
- **Scenario 08** (sheet → form, multi-row) — full loop body works end-to-end, eliminating the workaround Claude was attempting (inlining N copies of the form-fill steps, which previously hit response-token limits and produced a truncated artefact).

Out of scope for this release: P2 from the findings doc (multi-column `smart_selector` for scenarios that scrape distinct columns and write them to a sheet — needs more reverse engineering against the extension's selector serializer). P3 (truncation) is also deferred — likely resolves automatically with loops working, will re-verify in the next harness run.

Tests: 8 new unit tests in `test/scripts/build-axiom.spec.ts` pin the `tokenRefs` happy path + the "tokenRef against a non-token-typed param" / "tokenRef with unknown param name" / "tokenRefs win over values" failure modes, plus the `stepNumber` override and the `isLooping`/`afterLoopUpdate` propagation. 218/218 green.

Source-of-truth references read while reverse-engineering: `axiom_extension/src/axiombuilder/models/widgets/WidgetBotCreate.ts`, `axiom_extension/src/axiombuilder/models/params/ParamToken.ts`, `axiom_extension/test/agent/axioms/loop.json` + `axiom_test_correct.json`. Findings doc with the full diagnostic trail: `api-publish/docs/skill-findings-2026-06-04.md`.

## 0.7.10 — docs: skill now handles user-reported Google Sheets auth errors by directing the user to reconnect in the Axiom extension

When a user's existing axiom fails at runtime with a Google Sheets auth error — `"Google access token has expired"` / `"Your Google access token is invalid or has expired"` / Google Sheets steps suddenly returning permission errors after working before — the skill previously fell through to its blanket "I don't troubleshoot live runs; check the dashboard's run reports" stance. That left the user without the specific recovery (which is non-obvious: it's a Google-side token revocation, not an axiom bug, and the fix is a one-click reconnect in the Axiom Chrome extension).

This release adds a new **"User-reported runtime errors"** section to [`SKILL.md`](plugins/axiom/skills/axiom/SKILL.md) listing exactly this case + the recovery: click the Axiom extension icon → open **Google Sheets and API key** → **Connect Google Sheets**. Section is structured as a table so future runtime-error rows can be added cleanly. The "What this skill won't do" line that absolutely refused to troubleshoot live runs is softened to point at the new table.

Source-of-truth for the underlying error semantics remains [`references/docs/no-code-tool/troubleshooting/errors/integrations/google-sheets.md`](plugins/axiom/skills/axiom/references/docs/no-code-tool/troubleshooting/errors/integrations/google-sheets.md); the SKILL.md row links there.

No code changes, no validator changes, no example changes — pure SKILL.md content addition.

## 0.7.9 — fix: output-producing steps (SmartScraper, ScrapeLinks, ReadGoogleSheet, …) shipped with an empty `token`

After the 0.7.8 fix unblocked the scrape from running, the next defect surfaced: the "Get Data" step ran but produced no named output — `step.token` was empty, so downstream steps and the user had nothing to reference. This wasn't a 0.7.8 regression; the same shape had been emitted since the helper was introduced.

Same class of defect as 0.7.8: the canonical value lives in the vocabulary (49 of 95 widgets declare a default token — `scrape-data`, `link-data`, `google-sheet-data`, …) and `buildStep` failed to use it. Caller-supplied tokens still win; the vocab default fills the gap when none is passed.

Fix:

- `scripts/build-axiom.js` — `buildStep` now falls back to `widget.token` when the caller doesn't pass one. `buildAxiom` deduplicates collisions across steps (two SmartScraper steps in one axiom become `scrape-data` + `scrape-data-2`).
- `scripts/_src/validate-no-code.js` (+ rebuilt bundle) — new structural check: a widget that declares a vocab token must ship a non-empty step token. The check is permissive on the *name* (callers may rename) and strict on presence.
- `examples/no-code/scrape-and-write-sheet.json` — scraper step now carries `token: "scrape-data"`.
- `references/automation-template-schema.md` — prose now documents the token fallback + dedup behavior.

Discovery credit: end-user smoke test — "the built scraper runs ok, but the Get Data step doesn't give you a token."

## 0.7.8 — fix: generated no-code steps were missing `method`, `modes`, and `index` (axioms imported but hung on about:blank)

A user built a no-code axiom to scrape `https://axiom.ai/`, imported the JSON, and the run hung on `about:blank` — it never navigated. Comparing the generated JSON against a manually-built automation showed every step was missing three fields the Chrome extension's runner needs: `method` (e.g. `{"driver": "driver.gotoV4070"}` — what the runner dispatches on), `modes` (`["driver"]` / `["browser"]`), and `index` (the step's 0-based position). Without `method`/`modes` the step imports cleanly but never executes.

Root cause: `scripts/build-axiom.js`'s `buildStep` constructed each step without those fields, even though `action-vocabulary.json` carries `method`/`modes` for every widget and the function's own docstring claimed it set `index`. The schema, the validator, and the three reference examples all failed to carry or require them too, so nothing caught the gap — and Claude faithfully reproduced the broken example shape.

Fix, across all four guards:

- `scripts/build-axiom.js` — `buildStep` now copies `method`/`modes` from the widget definition and sets `index` to the 0-based step position.
- `references/automation-template-schema.json` — the widget definition now lists `index` as an allowed property and **requires** `index`, `method`, and `modes` (a correct export carrying `index` previously failed AJV because `additionalProperties: false` didn't permit it).
- `scripts/_src/validate-no-code.js` (+ rebuilt bundle) — structural check now verifies each step's `method`/`modes` match the canonical widget definition and that `index` equals the step position, with an explicit "the run hangs on about:blank" message.
- `examples/no-code/*.json` — all three reference axioms regenerated to carry the fields.
- `references/automation-template-schema.md` — minimal-step example + prose now document the three fields as load-bearing at runtime.
- Regression pinned: `test/no-code/fixtures/claude-emitted/missing-method-modes-index.json` is a known-bad fixture asserting the validator rejects the exact reported shape.

Discovery credit: surfaced by an end-user smoke test — "ran it via the skill but it just hung on about:blank and never went to https://axiom.ai".

## 0.7.7 — fix: all bundled-script invocations in skill docs use the announced skill base directory

Every `node plugins/axiom/skills/axiom/<x>` instruction across the skill docs was a relative path that only resolved when the bash tool's CWD happened to match the marketplace source root — which it usually doesn't. Real-world symptom: every new conversation opened with a scary `Cannot find module …/plugins/axiom/skills/axiom/scripts/check-for-updates.js` error before the skill proceeded normally. The same shape silently broke `signup-and-mint-key.js`, `validate-coded.js`, and three `workflows/index.js` examples.

Additionally, the installed cache layout (`<cache>/skills/axiom/...`) has no `plugins/axiom` segment at all, so the relative path was wrong regardless of CWD.

Fix: all 9 `node` invocations across the skill's docs now reference `<SKILL_BASE_DIR>` — the absolute path Claude is told at skill activation ("Base directory for this skill: …") — quoted for paths with spaces. Sites changed:

- `SKILL.md` — `check-for-updates.js`, `signup-and-mint-key.js` (×2), `workflows/index.js invoke build_no_code`, `validate-coded.js`
- `references/account-setup.md` — `signup-and-mint-key.js` (×2)
- `references/workflows-index.md` — `workflows/index.js` (`list`, `dispatch`, `invoke run_automation`)

Discovery credit: surfaced by an end-user session — `Cannot find module /mnt/.../plugins/axiom/skills/axiom/scripts/check-for-updates.js` on every new chat.

## 0.7.5 — build-axiom is now in-path: BuildNoCodeWorkflow accepts an intent and runs the full pipeline

v0.7.4 added the helper but only documented it in SKILL.md — Claude could still ignore the guidance and hand-compose JSON, in which case the strengthened validator would reject it but Claude might then iterate "fix one error at a time" instead of reaching for the helper. v0.7.5 closes that gap by wiring the helper into the workflow itself.

`BuildNoCodeWorkflow.invoke({intent, outputPath})` now runs the full pipeline internally:

```
buildAxiom(intent)            ← clone canonical shape from widgetActionList
  → validateAutomationTemplate ← structural + schema check
  → writeFileSync(outputPath)  ← persist to disk
  → return import-flow message
```

SKILL.md Step 3 directs Claude through the workflow (not the standalone scripts). The standalone `scripts/build-axiom.js` and `scripts/validate-no-code.js` are retained as power-user / CI escape hatches.

The legacy `opts.artifactPath` shape is preserved as a validate-only mode for re-checking files Claude already wrote — but the strengthened validator still rejects hand-composed shapes and the workflow's error message now nudges back toward `opts.intent` for the fix.

`~` in `opts.outputPath` is expanded to the user's home dir so paths like `~/Downloads/axiom-bbc.json` work without extra shell preprocessing.

New: `test/workflows/build-no-code.spec.ts` — 8 specs covering build-via-intent (with disk side-effect), unknown widget rejection, wrong-param-key rejection, missing outputPath guidance, validate-only acceptance of canonical files, hand-composed rejection with recompose hint, and missing-input guidance. Suite total: 197 → 205 across 16 → 17 suites.

## 0.7.4 — build-axiom helper, strengthened validator, regenerated examples

Live install on a clean machine surfaced a structural bug that affected every no-code axiom the skill produced: the generated JSON imported into the Chrome extension with every step rendering as `undefined: <name>` because the canonical step shape — `original_name`, the full param list with the widget's declared types and metadata — was missing. The schema validator passed because the schema's step item is wide-open (`properties: {}`, `required: []`); the structural mismatch only surfaces at import time.

Three coordinated fixes so this can't happen again:

- **New `scripts/build-axiom.js` helper.** Takes a small "intent" JSON (the user's automation name + the list of steps as `{machineName, values}`) and produces a canonical AutomationTemplate by cloning every param from `widgetActionList`. The caller only specifies `value` overrides for named params; the helper fills in `name`, `type`, `description`, `default_value`, `help`, every other field. Wrong param names (`"URL"` instead of `"Enter URL"`) and unknown widgets fail loudly with messages that name the right alternatives. **SKILL.md Step 3 directs Claude to use the helper; hand-composing is explicitly called out as wrong**.

- **Strengthened `scripts/validate-no-code.js`.** Adds a structural check after AJV that catches what the loose schema doesn't:
  - Each step must have `machine_name`, `name`, `original_name`, `stepNumber`, `params`.
  - `machine_name` must resolve to a widget in `widgetActionList`.
  - The step's params must match the widget's declared params by **count, name (by position), and type**.
  - `original_name` must match the widget's canonical name.

  Plus two in-memory schema patches to align it with the widget vocabulary (the vendored schema is slightly stale): the `type` enum gets widened with every type used in `widgetActionList`, and `help` items can now be either strings or `{name, linkSrc, linkText}` objects (which several widgets ship).

- **Three regenerated examples.** `examples/no-code/visit-example.json`, `scheduled-daily.json`, and `scrape-and-write-sheet.json` were rebuilt through the helper and now serve as canonical reference shapes (not hand-compose patterns).

Two regression fixtures land alongside the new test suite:
- `test/no-code/fixtures/invalid/bbc-search-missing-params.param_count.json` — the exact broken JSON a user produced before this release; the strengthened validator now catches it on four counts.
- `test/no-code/fixtures/invalid/step-missing-original-name.required.json` — minimal repro of the missing-`original_name` failure mode.

Plus 19 new specs in `test/scripts/build-axiom.spec.ts` (param cloning, value override semantics, error paths, end-to-end "helper output passes the strengthened validator"). Suite total: 178 → 197 across 15 → 16 suites.

`npm run build:axiom` is the new entry point.

## 0.7.3 — version bump to exercise the update-check flow

Pure version bump — no functional change. Released so the v0.7.2 update-check
flow can be tested end-to-end: an installer on v0.7.2 starts a fresh
conversation, the Step −1 probe runs, finds 0.7.3 upstream, and surfaces the
heads-up. Confirms the live `gh api` lookup, the semver comparison, and the
user-facing message all work in a real Claude Code session.

## 0.7.2 — per-conversation update check

The skill now checks for newer upstream versions the first time it activates in a conversation and prompts the user to upgrade if one's available. Closes the gap where installers who got the skill weeks ago had no idea that fixes had landed since.

How it works:

- New script `plugins/axiom/skills/axiom/scripts/check-for-updates.js` reads the locally-installed `plugin.json`'s `version`, then probes the upstream `main` branch's `plugin.json` via either `gh api` (best for the current private-repo state) or unauthenticated HTTPS (kicks in once the repo flips public). Whichever returns first wins. Hard 5-second timeout; if both fail, the script exits 0 with no output.
- New **SKILL.md Step −1** tells Claude to run the script once per conversation and, if its output starts with `UPDATE_AVAILABLE`, surface a one-line note to the user: "Heads up: skill v\<latest\> is available — run `/plugin marketplace update axiom-skills` then `/reload-plugins` to upgrade." Claude proceeds with the user's request either way.
- Semver-aware comparison (`0.10.0 > 0.9.9` works), null-safe, malformed-input-safe — the check never raises an alarm it shouldn't.

Honours `LOCAL_VERSION_OVERRIDE` and `REMOTE_VERSION_OVERRIDE` env vars for testing without network. Honours `GITHUB_TOKEN` for the curl fallback.

Tests: 21 new specs in `test/scripts/check-for-updates.spec.ts` (compareSemver / formatOutput / readLocalVersion / fetchRemoteVersion primitives with injected fakes — no real network). Suite total: 157 → 178 across 14 → 15 suites.

## 0.7.1 — ask the user where to save the artifact; default to ~/Downloads

SKILL.md Step 3 now tells Claude to ask the user where they want the JSON (or JS) artifact written before it's emitted, with `~/Downloads/axiom-<short-name>.json` as the suggested default. Downloads is the right default because the Chrome extension's import file-picker opens there — making the path of least friction "click Select file, the JSON is already in front of you".

Claude is reminded to resolve `~` to the user's home dir before writing (via `$HOME/Downloads/…` or equivalent) since most file-writing tools don't expand the tilde themselves, and to fall back to `~/` with a heads-up if `~/Downloads` doesn't exist on the machine.

No code changes; no test changes; the workflow still accepts whatever path Claude passes in `opts.artifactPath` and the file just lands somewhere more sensible.

## 0.7.0 — drop save endpoint, drop sample IRs, recommend VS Code

The skill no longer POSTs the validated AutomationTemplate JSON to a backend save endpoint. That endpoint was always behind an unmerged backend branch and was never available on the public Axiom backend, so any external installer hit a 404 the moment the skill tried to save. The skill now writes the JSON to disk and hands the user the path plus the 4-step import flow:

> 1. Open the Chrome extension's builder.
> 2. Click the **Cog** icon in the left toolbar.
> 3. Open **Import or download** → click **Select file** → pick the JSON.
> 4. Save the automation.
>
> Full docs: <https://axiom.ai/docs/no-code-tool/reference/settings/import-export/sharing>

No API key required to ship the artifact; no network call from `BuildNoCodeWorkflow`; no failure modes beyond schema validation.

Other cleanups landing at the same time:

- **Removed the `references/sample-irs/` corpus.** Three large vendored AutomationTemplate samples that overlapped with the hand-crafted `examples/no-code/*.json`. The remaining reference material (schema JSON, schema prose, action vocabulary, examples) is enough for Claude to compose valid artifacts.
- **README recommends the VS Code extension** for day-to-day building. The `/plugin` install commands still require Claude Code (the CLI), but a new **Step 3** points users at the VS Code extension once install is complete — the extension shares plugin install + `~/.claude/settings.json` env vars with the CLI.

Deleted:
- `plugins/axiom/skills/axiom/scripts/save-to-axiom-lar.js`
- `plugins/axiom/skills/axiom/references/rest-save-endpoint.md`
- `plugins/axiom/skills/axiom/references/graphql-task-mutation.md`
- `plugins/axiom/skills/axiom/references/sample-irs/` (3 files)
- `test/no-code/save-helper.spec.ts` (8 tests gone)

Modified:
- `plugins/axiom/skills/axiom/workflows/BuildNoCodeWorkflow.js` — now pure validate + hand-off; no `require()` of the save helper
- `plugins/axiom/skills/axiom/SKILL.md` — Step 5 rewritten; sample-irs bullet removed from Step 2
- `plugins/axiom/skills/axiom/references/workflows-index.md` — `build_no_code` no longer "saves"
- `plugins/axiom/skills/axiom/references/account-setup.md` — onboarding trigger no longer references the save 401
- `package.json` — `save:no-code` npm script removed
- `.env.example` — `AXIOM_API_KEY` comment now references `run-axiom.js` instead of the deleted save helper
- `README.md` — VS Code Step 3 added; CLI-only callout softened
- Version bumped to 0.7.0 in `package.json`, `plugins/axiom/.claude-plugin/plugin.json`, and `SKILL.md` frontmatter

## 0.6.1 — vendor the full axiom.ai docs corpus into the skill

Replaces a vector-store-backed doc retrieval model with file-based docs Claude reads on demand. Skill now ships the entire user-facing documentation tree (332 markdown files across 41 categories) under `plugins/axiom/skills/axiom/references/docs/`, plus a generated `_index.json` so Claude can scan the catalog before reading any specific file.

Rationale: Claude reads structured indices well, picks files precisely, and ingests whole documents rather than chunks. For a single-turn skill where the model isn't context-constrained, vendored markdown + a Claude-readable index is the right shape; retrieval-augmented generation is overkill.

What landed:
- **`references/docs/_index.json`** — generated catalog: 332 entries grouped into 41 category buckets. Each entry has `path`, `title`, `description`, optional `docCategory` + `order`.
- **`references/docs/<full tree>`** — the 332 markdown files, with Nuxt Content frontmatter and `::ComponentName{}` shortcodes preserved.
- **`SKILL.md` Step 2.5** — "always read `_index.json` before composing", with example prompt-to-doc mappings. Emphasises reading 3-6 well-chosen docs rather than scanning the corpus.

## 0.6.0 — five-workflow architecture: signup, build (no-code + coded), run, handoff

The skill now exposes five workflows in a code-based registry. Each is a class with `key`, `description`, `getRoutes()` (regex matchers), and `invoke()` returning `{response, debug}`. Routing precedence is registry order; first match wins.

Two new user-facing capabilities land alongside the registry:

- **Run/trigger a saved axiom from Claude.** Drives the existing Axiom REST surface — no backend changes. Modes: `list` / `trigger` / `status` / `wait`. Limitations of the underlying name-keyed endpoints flow through to the workflow and are documented in `references/workflows-index.md`:
  - No run identity — status reads ask "is any pod running this name?"; concurrent runs of the same axiom can't be told apart.
  - Status is binary (`Running`/`Finished`); failures are indistinguishable from success.
  - Only Google-Sheets-widget output is recoverable via the status endpoint; other scraped data isn't surfaced.
  - No `cancel` mode — `/v4/stop` requires pod credentials we can't reliably recover. Cancel via the dashboard.
- **Tell the user how to install the Chrome extension.** Pure guidance: returns a message pointing at `https://axiom.ai` and the Chrome Web Store URL, with sign-in-with-same-email instructions so the user's saved axioms appear in the extension dashboard.

The five workflows in routing order:

| Key | Wraps | Purpose |
|---|---|---|
| `signup` | `signup-and-mint-key.js` | Bootstrap account + mint API key |
| `build_no_code` | `validate-no-code` + `save-to-axiom-lar` | Emit + validate + save `AutomationTemplate` JSON |
| `build_coded` | `validate-coded` | Emit + validate `@axiom_ai/api` script |
| `run_automation` | `run-axiom.js` | List / trigger by name / status / wait (see caveats above) |
| `handoff_to_extension` | (inline guidance) | Tell the user how to install the Chrome extension and find their saved axioms |

CLI: `node workflows/index.js list | dispatch --message "..." | invoke <key> [opts-json]`. Used by tests + power users.

Total skill tests: 63 → 102 across 10 → 12 suites.

## 0.5.0 — vendor in-app workflow catalog into the skill

Skill consults a sanitised catalog of in-app chat workflows to recognise build-vs-troubleshooting intent without trying to re-implement multi-turn dispatch:

- **`references/workflows/_catalog.json`** — 32 entries, one per workflow. Each carries `key`, `description`, `category` (build/troubleshooting/settings), and an optional `forcing` flag. Drives Step 1 intent classification.
- **`SKILL.md` Step 1** — new troubleshooting-intent branch points the user back to the in-app chat rather than emitting an artifact.

## 0.4.0 — account onboarding (signup + key mint)

The skill can now bootstrap a user from "no Axiom account" or "no API key" to a working state. New artifacts:

- **`scripts/signup-and-mint-key.js`** — combined helper wrapping the three REST calls (`POST /api/user/create` → `POST /api/user/login` → `GET /api/user/key/create`). CLI flags: `--email`, `--name`, `--existing` (skip create), `--check-only` (report whether a key already exists without minting one). Password read from `AXIOM_PASSWORD` env var (never the CLI). Auto-falls-back from create to login when the server returns `email_exists`.
- **`references/account-setup.md`** — Claude-facing reference for the onboarding flow: when to invoke it, the choreography (one question, password via env, run helper, persist key, retry save), error modes, and the key-rotation gotcha.
- **`SKILL.md` Step 0** — Claude now checks `AXIOM_API_KEY` is set before producing artifacts. If not, it walks the user through the decision (existing account vs new vs paste-a-key) and uses the helper.

## 0.3.0 — marketplace-of-plugins layout for local installability

Restructured to canonical Claude Code plugin-marketplace layout: top-level `.claude-plugin/marketplace.json` lists `axiom` plugin under `./plugins/axiom`. All paths updated: package.json scripts, test spec imports + runtime path resolution.

## 0.2.0 — wire the REST save endpoint

- **`references/rest-save-endpoint.md`** — full contract for `POST /api/v4/automation` (request fields, defaults, error table, curl examples).
- **`scripts/save-to-axiom-lar.js`** — Node helper that POSTs a validated AutomationTemplate to the endpoint. Re-runs schema validation before sending; refuses on invalid. Exposes `saveAutomation()` and `buildRequestBody()` for tests.
- **`SKILL.md` Step 5** — Claude runs the save helper for the no-code path after validation passes.

## 0.1.0 — initial scaffold

- Plugin layout: `.claude-plugin/plugin.json` + `skills/axiom/SKILL.md`.
- Dual-output skill: no-code AutomationTemplate JSON + coded `@axiom_ai/api` script.
- Hand-crafted references: `axiom-api-method-allowlist.json` / `…-blocklist.json`, `axiom-api-surface.md`, `decision-tree.md`, `automation-template-schema.md`.
- Validators: `validate-no-code.js` (AJV) and `validate-coded.js` (acorn AST). Same code Claude runs at skill execution time is what the test suite uses.
- Test suite: Jest + ts-jest, covering valid-corpus + filename-coded negative fixtures + Claude-output regression bank.
