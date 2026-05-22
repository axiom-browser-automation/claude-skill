---
name: axiom
description: This skill should be used when the user asks to "build an axiom", "create an axiom", "make an automation that scrapes/clicks/fills/downloads/etc.", "set up a bot", "scrape this site", or otherwise wants browser automation built with Axiom — whether as a saved no-code axiom in their account or as a Node script using the @axiom_ai/api library. The skill also handles "I don't have an Axiom account" / "set me up" / "get me an API key" by walking the user through signup, login, and key minting. Emits one of two artifacts based on the user's intent and validates it before declaring done.
version: 0.7.1
license: ISC
---

# Axiom builder skill

You build axioms in **two formats**, chosen at runtime based on the user's intent:

- **No-code axiom (JSON)** — an `AutomationTemplate` saved to the user's Axiom account, runs in the dashboard, schedulable.
- **Coded axiom (`@axiom_ai/api` JavaScript)** — a Node script the user runs from their own code.

You can also **run** a saved axiom (trigger it, poll for results) and **hand one off** to the Chrome extension for local preview/edit. These five capabilities are encoded as workflows in [`workflows/`](./workflows/) — see [`references/workflows-index.md`](./references/workflows-index.md) for the full registry.

Before you produce anything, **decide which workflow fits**. If the user's intent is ambiguous, ask one clarifying question.

## Step 0 — Make sure the user has an API key

Skip this section if `AXIOM_API_KEY` is already set in the environment AND the user hasn't said anything like "I don't have an account" / "set me up". Otherwise walk through it before producing any artifacts.

**Quick check:** run `[ -n "$AXIOM_API_KEY" ] && echo "AXIOM_API_KEY=set" || echo "AXIOM_API_KEY=unset"` via Bash. **Do not echo the raw value** — it will end up in the conversation transcript. If it prints `unset`, you need to onboard.

You also need to do this if a save attempt later returns HTTP 401 — the key is stale or invalid.

### Decision tree

Ask the user **one question**:

> *"Do you have an Axiom account already? (a) Yes, I just haven't minted an API key yet, (b) No, sign me up, (c) I already have a key — let me paste it."*

**For (c) — they have a key:**

Take the key. Write it to `~/.claude/settings.json`'s `env` block under `AXIOM_API_KEY`. Tell the user to restart Claude Code for it to pick up. **Don't store the key anywhere else** — settings.json is the canonical location. For the current Bash session, also export it inline:

```bash
export AXIOM_API_KEY="axm_…"
```

Then proceed to Step 1.

**For (a) or (b) — they need a fresh key:**

1. **Ask only for what's needed.**
   - (a): just their email.
   - (b): their name and email.

2. **Never take the password in chat.** Tell the user:

   > *"Set your password in your shell so it doesn't end up in our chat history: `export AXIOM_PASSWORD='your-password-here'`. I'll read it from the env and won't see the value."*

   Wait for them to confirm they've done it.

3. **Run the bundled helper:**

   New account (b):
   ```bash
   node plugins/axiom/skills/axiom/scripts/signup-and-mint-key.js \
     --name "Their Name" --email their@email.com
   ```

   Existing account (a):
   ```bash
   node plugins/axiom/skills/axiom/scripts/signup-and-mint-key.js \
     --email their@email.com --existing
   ```

   The helper outputs three lines on success:
   ```
   API_KEY=axm_xxxxxxxxxxxxxxxxxxxx
   USER_ID=12345
   USER_EMAIL=their@email.com
   ```

   Capture the `API_KEY` line.

4. **Persist the key.** Read `~/.claude/settings.json`, add the key to the `env` block:

   ```json
   "env": {
     "AXIOM_API_KEY": "axm_…",
     "AXIOM_LAR_URL": "https://lar.axiom.ai"
   }
   ```

   Tell the user the key is persisted and will be available in future Claude Code sessions.

5. **Export for the current session.**
   ```bash
   export AXIOM_API_KEY="axm_…"
   ```

6. **Warn about rotation.** Minting a key invalidates any prior key on the account. If the user mentioned existing integrations, point that out — they'll need to update those integrations with the new key.

See [`references/account-setup.md`](./references/account-setup.md) for the full reference: edge cases, error modes, and the underlying flow.

## Step 1 — Pick a path (and check the intent isn't "fix-my-existing-axiom")

Read `references/decision-tree.md` for the rules. Quick summary:

| Signal | Path |
|---|---|
| "every day at 9am", "schedule", "save to my account", "in my dashboard" | **No-code** |
| "Node script", "from my CI", "in my repo", "TypeScript", names a language | **Coded** |
| "Build me a bot", "scrape this page" with no other context | **Ask** |
| "my axiom is failing", "the click is wrong", "stuck on Cloudflare", "page won't load" | **Troubleshooting** — see below |

Don't emit both. One artifact per request.

### Troubleshooting intents

If the user's prompt sounds like a complaint about an _existing_ automation rather than a build
request, the skill is the wrong tool. Consult [`references/workflows/_catalog.json`](./references/workflows/_catalog.json) — the
`troubleshooting`-category entries describe the symptoms each in-app flow handles. If the user's
prompt matches one of those descriptions, tell them:

> *"This sounds like a troubleshooting issue on a running automation. The skill builds new axioms
> — it doesn't fix live runs. Open the failing automation in the Axiom dashboard and use the chat
> there (it has access to the run logs and can apply fixes in-place). The flow that handles this
> is `<workflow-key>`."*

Don't try to re-implement the troubleshooting flow. Those in-app flows depend on multi-turn
session state (pending operations, hook bus, return stack) that has no analog in a single-turn
Claude session.

## Step 2 — Read the relevant reference material

**For the no-code path:**

1. `references/automation-template-schema.json` — authoritative schema your output must validate against.
2. `references/automation-template-schema.md` — prose explanation of the shape, with the minimal-required-fields cheatsheet.
3. `references/action-vocabulary.json` — the `machine_name` values you may use in widgets (`baseActionList` + `widgetActionList`).
4. `examples/no-code/*.json` — three minimal, hand-crafted, schema-valid AutomationTemplates. Read them to absorb the boilerplate shape.

**For the coded path:**

1. `references/axiom-api-surface.md` — the only methods you may call. The full method allowlist with signatures.
2. `references/axiom-api-method-allowlist.json` — machine-readable allowlist the validator uses.
3. `references/axiom-api-method-blocklist.json` — methods the validator rejects (private + internal).
4. `examples/coded/*.js` — three golden patterns: simple scrape, login-then-extract, parallel sessions.

### Step 2.5 — Consult the docs index for relevant deep-dives

The skill ships the full axiom.ai user docs (332 files across 41 categories — step references,
troubleshooting recipes, integration guides, API deep-dives) under `references/docs/`. **Always**
read [`references/docs/_index.json`](./references/docs/_index.json) before composing the artifact.

The index has one entry per file with `path`, `title`, `description` and (where present) `docCategory`
and `order`. Scan it to find 3-6 docs whose `title` + `description` match the user's prompt — for
example:

- User says *"scrape paginated results"* → read the `no-code-tool/how-it-works/loop.md` entry and any
  step-reference entries about pagination loops.
- User mentions *Google Sheets* → read the matching entries from `no-code-tool/integrations/` plus the
  `WidgetWriteGoogleSheet` step reference.
- User reports an error message → look in `no-code-tool/troubleshooting/errors/` for a match.

**Don't read everything.** The index exists so you pick precisely. Reading 3-6 well-chosen docs is
always better than scanning the whole corpus. If nothing matches, skip this step rather than reading
indiscriminately.

**Always read:**

- `references/decision-tree.md` if uncertain which path.

## Step 3 — Pick the output path, then emit the artifact

**Ask the user where they want the file saved before you write it.** Propose `~/Downloads/axiom-<short-name>.json` (or `.js` for the coded path) as the default — the Downloads folder is what the user's file picker opens in when they go to import via the Chrome extension's **Cog → Import or download → Select file** flow, so it's the path of least friction. Let them override with anything else if they prefer (`/tmp/...`, a project directory, etc.).

Resolve `~` to the user's home directory before writing — most file-writing tools don't expand the tilde themselves. Quick way:

```bash
echo "$HOME/Downloads/axiom-<short-name>.json"
```

If `~/Downloads` doesn't exist on the user's machine (rare — present on macOS, Windows, and most Linux distros), fall back to `~/` and tell the user.

Use the same conventions as the examples for the artifact contents.

### No-code rules

- Every `data.form` widget needs `machine_name`, `name`, `stepNumber`, `params`.
- `machine_name` must be a value from `references/action-vocabulary.json`. Pick the most specific widget for the intent (e.g. `WidgetDriverScrapeLinks` rather than a generic `WidgetDriverSmartScraper` when the user wants link extraction).
- `triggers` is empty `[]` unless the user wants a schedule. Schedule shape: `{name, status: "active", type: "recursive", time_criteria, interval_type, starting_time}`.
- Top-level boilerplate (`id: 0`, `openWidgetIndex: -1`, `templateId: 0`, `share_status: false`, `share_link: ""`, `stored_cookies: []`) is always required by the schema.
- `data.context` is an array of `{context: "url", url: "<url>"}`. At least one entry.
- `data.injector`, `data.templateItem`, `data.mode: "browser"` etc. — see `examples/no-code/visit-example.json` for the minimal valid envelope.

### Coded rules

- Always `import { AxiomApi } from '@axiom_ai/api'`. No other SDK import paths.
- Read the token from `process.env.<NAME>` — never inline a literal.
- Wrap step calls in `try { … } finally { await axiom.browserClose() }`.
- Only call methods listed in `references/axiom-api-method-allowlist.json`.
- Never call `step()` directly (it's the internal dispatcher — emit the named method like `goto`, `click`, `scrape`).
- Never call `_`-prefixed methods.

## Step 4 — Validate before declaring done

Run the corresponding validator on your output. Don't tell the user the artifact is ready until validation passes.

**No-code:**

```bash
node skills/axiom/scripts/validate-no-code.js /tmp/your-axiom.json
```

Exit 0 = valid. Exit 1 = AJV errors printed; each line names an `instancePath` and `keyword` — fix the field and re-validate.

**Coded:**

```bash
node skills/axiom/scripts/validate-coded.js /tmp/your-script.js
```

Exit 0 = valid. Exit 1 = error codes printed (`UNKNOWN_METHOD`, `MISSING_LIFECYCLE`, `HARDCODED_TOKEN`, …). Fix and re-run.

If validation fails, **read the error, fix the artifact, re-run the validator**. Don't argue with the validator — its rules come from the actual Axiom backend schema and the published `@axiom_ai/api` surface.

## Step 5 — Hand the artifact back to the user

### No-code: tell the user how to import the JSON

After validation passes, the JSON is sitting on disk at the path you wrote it to. The user imports it into Axiom themselves. Give them the path **plus** the 4-step import flow:

> Validated and written to `<path>`.
>
> To use it in your Axiom account:
> 1. Open the Chrome extension's builder.
> 2. Click the **Cog** icon in the left toolbar.
> 3. Open **Import or download** → click **Select file** → pick the JSON above.
> 4. Save the automation.
>
> Full docs: <https://axiom.ai/docs/no-code-tool/reference/settings/import-export/sharing>

If the user doesn't have the Chrome extension yet, invoke `HandoffToExtensionWorkflow` to point them at the install page.

No save endpoint, no API key required to ship the artifact — the path on disk is the contract.

### Coded: hand the script back to the user

"I've written the script to `<path>`. To run it: `npm install @axiom_ai/api`, set `AXIOM_API_KEY` in your environment, then `node <path>`. The script uses your account's automation token — see `references/axiom-api-surface.md` for the methods used."

## Failure modes you'll see

| Symptom | What it means | Fix |
|---|---|---|
| Schema `keyword: 'required'` with `missingProperty: 'X'` | Top-level or `data.X` field is missing | Add it. See the minimal envelope in `examples/no-code/visit-example.json`. |
| Schema `keyword: 'enum'` on a `machine_name` | You used a widget name that doesn't exist | Pick the right one from `action-vocabulary.json`. |
| Schema `keyword: 'additionalProperties'` | You added a field the schema doesn't recognise | Remove it. The schema is strict (`additionalProperties: false`). |
| Coded `UNKNOWN_METHOD` | You called `axiom.<foo>` where foo isn't in the allowlist | Check `axiom-api-surface.md` and pick a real method. |
| Coded `MISSING_LIFECYCLE` | Missing `try { … } finally { await axiom.browserClose() }` | Wrap step calls. |
| Coded `HARDCODED_TOKEN` | You inlined the API key as a string literal | Replace with `process.env.AXIOM_API_KEY`. |
| Coded `INTERNAL_METHOD` | You called `axiom.step(...)` directly | Emit the named method (`goto`, `click`, etc.) instead. |

## What this skill won't do

- **It doesn't run the axiom.** That's the user's job — either via the dashboard (no-code) or `node script.js` (coded).
- **It doesn't troubleshoot live runs.** If the user has an existing axiom that's failing, point them at the dashboard's run reports.
