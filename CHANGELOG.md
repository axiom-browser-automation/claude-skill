# Changelog

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
