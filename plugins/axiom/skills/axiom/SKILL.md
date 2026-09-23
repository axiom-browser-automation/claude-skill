---
name: axiom
description: This skill should be used when the user asks to "build an axiom", "create an axiom", "make an automation that scrapes/clicks/fills/downloads/etc.", "set up a bot", "scrape this site", or otherwise wants browser automation built with Axiom — whether as a saved no-code axiom in their account or as a Node script using the @axiom_ai/api library. The skill also handles "I don't have an Axiom account" / "set me up" / "get me an API key" by walking the user through signup, login, and key minting. Also handles "set up the Axiom desktop app" / "install the Axiom MCP server" / "connect Claude to Axiom" by walking through the desktop-app download and MCP registration that upgrade this skill with live mcp__axiom__* tools. Emits one of two artifacts based on the user's intent and validates it before declaring done.
version: 0.14.3
license: ISC
---

# Axiom builder skill

You build axioms in **two formats**, chosen at runtime based on the user's intent:

- **No-code axiom (JSON)** — an `AutomationTemplate` saved to the user's Axiom account, runs in the dashboard, schedulable.
- **Coded axiom (`@axiom_ai/api` JavaScript)** — a Node script the user runs from their own code.

You can also **run** a saved axiom (trigger it, poll for results), **hand one off** to the Chrome extension for local preview/edit, and **set up the Axiom desktop app's MCP server** — the runtime upgrade described in Step 0.5. These six capabilities are encoded as workflows in [`workflows/`](./workflows/) — see [`references/workflows-index.md`](./references/workflows-index.md) for the full registry.

Before you produce anything, **decide which workflow fits**. If the user's intent is ambiguous, ask one clarifying question.

## Step −1 — Check for a newer skill version (once per conversation)

The first time the axiom skill activates in a conversation, run the update check via the skill's bundled script. **Use the absolute path** — the skill's base directory was announced when this skill loaded ("Base directory for this skill: <PATH>"). The bash tool's CWD won't always match the skill directory, so a relative path will fail.

```bash
node "<SKILL_BASE_DIR>/scripts/check-for-updates.js"
```

Replace `<SKILL_BASE_DIR>` with the absolute path you were given at skill activation.

If it prints a line starting with `UPDATE_AVAILABLE`, surface a one-line note to the user before continuing with their request:

> Heads up: skill v\<latest\> is available (you're on v\<current\>). Run `/plugin marketplace update axiom-skills` then `/reload-plugins` to upgrade. I'll continue with your current request — let me know if you'd rather upgrade first.

If the script prints nothing, proceed silently.

**Don't re-run the check in the same conversation.** Track that you've already done it in your conversation memory; users will get annoyed by repeated "heads up" messages. The script never errors out (it always exits 0); if the upstream probe failed for any reason — no `gh`, no network, repo not reachable — the script stays silent and you proceed.

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

   (Paths below use `<SKILL_BASE_DIR>` — substitute the absolute path announced at skill activation.)

   New account (b):
   ```bash
   node "<SKILL_BASE_DIR>/scripts/signup-and-mint-key.js" \
     --name "Their Name" --email their@email.com
   ```

   Existing account (a):
   ```bash
   node "<SKILL_BASE_DIR>/scripts/signup-and-mint-key.js" \
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

6. **Warn about rotation.** Minting a key invalidates any prior key on the account. If the user mentioned existing integrations, point that out — they'll need to update those integrations with the new key. That includes the Axiom desktop app's MCP registration: a key saved through the app's key entry (or `axiom-mcp setup save-key`) is a *copy*, so after any rotation re-run the MCP setup in Step 0.5 so the client configs carry the new key.

See [`references/account-setup.md`](./references/account-setup.md) for the full reference: edge cases, error modes, and the underlying flow.

## Step 0.5 — Detect the Axiom MCP server (MCP mode)

Check your **in-session tool list** for tools named `mcp__axiom__*` (e.g. `mcp__axiom__step`, `mcp__axiom__save_automation`). There is no Bash probe for this — it's a property of your session, decided when Claude Code started.

- **Present → MCP mode.** The Axiom desktop app's MCP server is registered and this skill upgrades: probe selectors on the live page before authoring, save in one call, run and verify. The table below says what changes; everything else in this file still applies.
- **Absent → standalone mode.** Follow the rest of this file exactly as written. Every MCP-aware behaviour in this skill is a **runtime upgrade, never a requirement** — nothing below fails without MCP.

| Capability | Standalone mode (no MCP) | MCP mode |
|---|---|---|
| Browser session | None — the `@axiom_ai/api` step API ("cloud browser" in `axiom-api-surface.md` and the step-function docs) is a cloud pod, standalone mode only | `mcp__axiom__open_browser` → `step` (`goto`, `scrapeProbe`) → `get_page_html` — a real browser on the user's machine, never the cloud |
| Validate a no-code axiom | AJV inside `BuildNoCodeWorkflow` | Author IR, validate with `mcp__axiom__compile_ir` |
| Save to the account | `saveCommand` (`scripts/save-automation.js`, raw HTTP) | `mcp__axiom__save_automation` (takes the IR; upserts by name) |
| Run / verify | Not done — the user runs it | `mcp__axiom__run_automation` runs it **on the user's machine** through the desktop app and blocks until it finishes; `trigger_bot` is the cloud run (paid) — only after the Step 5 confirmation |
| Tool manuals | — | **Read `references/tools/INDEX.md` and follow its read order** (Step 2) |

**The desktop app must be running** for the browser tools (`open_browser`, `step`, `get_page_html`, `close_browser`) and for `run_automation` — they execute through the app's local server, not in the cloud. `compile_ir`, `save_automation`, `list_actions` and the operator tools work without the app.

**No fallbacks — an MCP failure is never a reason to switch transport.** When any `mcp__axiom__*` tool fails, stop and remediate; never "get it done" another way:

- *App not running* → relay the tool's message verbatim, ask the user to open the app (its tray menu has "Launch at Login"), then retry the **same** tool. Never reroute the run to the cloud.
- *401 / key rejected* → the key registered with the MCP is stale — most often a key was minted or re-pasted since registration, and minting rotates the account key. Run `node "<SKILL_BASE_DIR>/scripts/setup-desktop-mcp.js" verify` (redacted key fingerprints across settings.json, the shell env, and the MCP client config), then re-run the registration with the current key (the `register` subcommand or the tray "Set up Claude MCP…") and have the user restart Claude Code. Do not retry through other tools.
- `trigger_bot` is a separate, **cloud, paid** path. Use it only when the user explicitly asks for a cloud run — never as a fallback for a failed or blocked `run_automation`.
- Raw HTTP against the Axiom API is **never** used in MCP mode, and endpoints are never invented. The skill's bundled REST scripts belong to standalone mode only.

**If the tools are absent**, offer the upgrade **once** after Step 0 completes — the desktop app ships the MCP server — and don't nag if the user declines. If they accept (or ask for it directly: "set up the desktop app", "install the MCP server"), follow the next section; that's the `setup_desktop_mcp` workflow.

### Setting up the desktop app + MCP

The desktop app bundles the `axiom-mcp` stdio server as a sidecar binary. The app's tray menu **"Set up Claude MCP…"** and the sidecar's own `axiom-mcp setup` CLI drive the *same* registration code, so use whichever the platform allows:

**Linux (or any box where you can run commands) — perform it yourself** with the bundled helper. Each subcommand prints one-line JSON (`{ok: true, …}` / `{ok: false, error}`):

```bash
node "<SKILL_BASE_DIR>/scripts/setup-desktop-mcp.js" resolve                       # this platform's installer from the release manifest
node "<SKILL_BASE_DIR>/scripts/setup-desktop-mcp.js" download --dest /tmp           # fetches it (100+ MB) and checks its sha256
node "<SKILL_BASE_DIR>/scripts/setup-desktop-mcp.js" extract --appimage /tmp/axiom-desktop-linux-<ver>.AppImage --dest ~/.axiom-desktop
node "<SKILL_BASE_DIR>/scripts/setup-desktop-mcp.js" register --sidecar <the "sidecar" path printed by extract>
```

`register` reads `AXIOM_API_KEY` from the environment (Step 0 put it there) and pipes it to `axiom-mcp setup save-key` over **stdin**. The key must never appear in chat, in argv, or in the transcript — the helper refuses a `--key` argument by design. If `AXIOM_LAR_URL` points at a non-production LAR, the helper forwards the matching `AXIOM_API_BASE` so the registration targets the same backend. If the result says the `claude` CLI wasn't found, it includes a key-redacted `claude mcp add …` hint — show that to the user rather than composing your own. The published Linux installer is the AppImage; `extract` unpacks it with its own `--appimage-extract` (no FUSE, no root) and also accepts a `.deb` (`--deb`) from a staging folder. Testing a release candidate? Set `AXIOM_DESKTOP_INDEX_URL` (e.g. `https://site.axiom.ai/axiom_desktop/rc/`) or pass `--index <url>` and `resolve`/`download` read that folder's `manifest.json` instead of the published `latest.json`.

**macOS / Windows — instruct the user** (GUI installers can't be driven from here):

1. Download from https://axiom.ai/install-desktop-app and install (`.dmg` / `-setup.exe`).
2. Open the app's **tray menu → "Set up Claude MCP…"**.
3. Paste the **same API key from Step 0** into the key field (the app's axiom key entry) and click **Save and activate**.

**Always finish with:** *"Restart Claude Code (or run `/mcp` and reconnect) — the `mcp__axiom__*` tools only appear in a new session."* The current session stays in standalone mode; that's expected, not a failure.

### One key, one story

`~/.claude/settings.json`'s `env.AXIOM_API_KEY` (Step 0) stays the **canonical source**. The MCP client configs' `env` blocks and the desktop app's key field are **derived delivery copies** written by the setup flow — the setup CLI prefers the process env over any stale config copy, so registering from a session where Step 0 ran writes the canonical key through automatically. Never treat a client-config copy as the source, and never re-mint a key to "sync" them (minting rotates the key for the whole account — see Step 0's rotation warning).

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

**For BOTH paths, whenever the automation touches a live page** (any scrape,
click, or fill): `references/browser-automation-rules.md` — the shared core
rules on probing in the real runtime, consent overlays (dismiss them in the
automation, not just while researching), selector craft, column alignment,
and session etiquette. These rules are shared verbatim with Axiom's setup
agent; treat them as non-negotiable.

**In MCP mode (Step 0.5), additionally read [`references/tools/INDEX.md`](./references/tools/INDEX.md)
and follow its read order** (sessions → scrape / navigation / outputs as applicable →
compile-save). Those manuals are the authoritative call shapes and failure modes for the
`mcp__axiom__*` tools; `browser-automation-rules.md` still applies on top of them.

**For the no-code path:**

1. `references/automation-template-schema.json` — authoritative schema your output must validate against.
2. `references/automation-template-schema.md` — prose explanation of the shape, with the minimal-required-fields cheatsheet.
3. `references/action-vocabulary.json` — the `machine_name` values you may use in widgets (`baseActionList` + `widgetActionList`).
4. `examples/no-code/*.json` — three canonical reference AutomationTemplates regenerated through the build-axiom helper. **Read for shape reference; don't hand-copy** — produce your own JSON via `BuildNoCodeWorkflow` (see Step 3).

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

### MCP mode — probe first, author IR, compile (replaces the hand-composed JSON pipeline)

In MCP mode (Step 0.5) the no-code pipeline changes shape — the live tools replace emit-and-hope:

1. **Vocabulary**: `mcp__axiom__list_actions` is the authoritative step catalogue (the same vocabulary as `references/action-vocabulary.json`).
2. **Probe before authoring**: `mcp__axiom__open_browser`, then `step` with `goto`, then `scrapeProbe` for every candidate selector (and `get_page_html` for selector research). Never author a selector you haven't probed — `references/tools/` has the call shapes and failure modes.
3. **Author the IR** (not a hand-composed AutomationTemplate) and validate it with `mcp__axiom__compile_ir`; fix its warnings before going on.
4. **Hand to Step 5** for the confirm-and-save gate — `mcp__axiom__save_automation` takes the IR directly. Saving via raw HTTP (`scripts/save-automation.js`) while the MCP tools are present is an anti-pattern (`references/tools/compile-save.md`).
5. **Close the browser** (`mcp__axiom__close_browser`) when probing is done. A "session is closed" error is recoverable: open a fresh session and continue — don't retry the old handle.

The file-emitting `BuildNoCodeWorkflow` path below stays correct when the user explicitly wants a JSON file on disk, and is the automatic path in standalone mode. **Don't do both**: in MCP mode the `save_automation` save is the deliverable — skip the Downloads JSON unless the user asked for a file. The coded path is unchanged by MCP mode (the script the user runs uses `@axiom_ai/api`), but you may still probe selectors with the MCP tools before writing it.

### No-code path — invoke BuildNoCodeWorkflow with an intent. Do NOT hand-compose JSON.

The workflow is the single entry point for the no-code path. It takes a high-level intent (the user's automation name + a list of `{machineName, values}` step intents) and runs the full pipeline internally: build the canonical AutomationTemplate from `widgetActionList`, validate it, write it to disk. Hand-composing JSON is structurally unsafe — every step needs `original_name` + the widget's full param list with declared types + full metadata, and missing fields render as `undefined: …` in the Chrome extension. The workflow handles all of that.

**Workflow:**

1. **Compose an intent JSON** describing the axiom at the high level. `machineName` must be a value from `references/action-vocabulary.json`'s `widgetActionList`. `values` keys must be the exact param names declared by that widget (case-sensitive — `"Enter URL"`, not `"URL"`).

   ```json
   {
     "name": "BBC search for harry kane",
     "description": "Navigates to bbc.co.uk and searches for harry kane.",
     "contextUrl": "https://www.bbc.co.uk",
     "steps": [
       {"machineName": "WidgetDriverGoto", "values": {"Enter URL": "https://www.bbc.co.uk"}},
       {"machineName": "WidgetDriverEnterText", "values": {"Select text field": "input[type='search']", "Text": "harry kane"}},
       {"machineName": "WidgetDriverClick", "values": {"Select": "button[type='submit']"}}
     ]
   }
   ```

2. **Invoke the workflow** with the intent + the user's chosen output path:

   ```bash
   node "<SKILL_BASE_DIR>/workflows/index.js" invoke build_no_code "$(cat <<'JSON'
   {
     "intent": { ...the intent JSON from step 1... },
     "outputPath": "~/Downloads/axiom-bbc-search.json"
   }
   JSON
   )"
   ```

   The workflow's `invoke()` returns a `response.message` containing the absolute path the file was written to and the 4-step Chrome-extension import flow. If the intent has a typo (wrong widget name, wrong param key, etc.), invoke fails with a clear message naming the right alternative — fix and re-run.

3. **Hand the path + import flow back to the user.** That's the end of the no-code path. No separate build / validate / save calls; the workflow does the lot.

> ⚠️ Don't run `scripts/build-axiom.js` or `scripts/validate-no-code.js` directly. They exist as a power-user / CI escape hatch, but the workflow is the supported path. Don't hand-write JSON either — the strengthened validator catches the failure modes and refuses to declare a hand-composed artifact done.

#### Loops — repeat a body of steps once per row of data

When the user wants "for each row in this sheet, do X" / "visit each of these links" / similar, **the no-code JSON has a specific shape** that the helper now supports directly. There is no single "loop" widget; a loop is **a `WidgetBotCreate` step (the start) + body steps + a `WidgetBotComplete` step (the end)**, with three conventions:

1. **Wire the iteration data** with `tokenRefs`, not `values`. The BotCreate step has a `Loop through data` param of type `bot_token`; in the intent, point it at the upstream step's `token`:
   ```js
   { machineName: 'WidgetBotCreate',
     stepNumber: '3',
     tokenRefs: { 'Loop through data': 'google-sheet-data' } }
   ```
   The helper emits `value: "[google-sheet-data]"` (the canonical `bot_token` runtime shape — a single bracketed string, not an array; see the per-type shape table below).
2. **Body steps use sub-numbered `stepNumber` labels** (`"3.1"`, `"3.2"`, …) under the BotCreate's parent number. The helper takes a `stepNumber` override on each body step:
   ```js
   { machineName: 'WidgetDriverEnterText', stepNumber: '3.1', values: { ... } }
   ```
3. **The closing `WidgetBotComplete` step shares the BotCreate's stepNumber** (both `"3"`). The importer pairs them by matching number.

The helper also handles two BotCreate-only top-level flags (`isLooping: true`, `afterLoopUpdate: true`) — set automatically from the vocab.

See [`examples/no-code/loop-through-sheet.json`](examples/no-code/loop-through-sheet.json) for a fully-wired ReadGoogleSheet → Goto → BotCreate(loop) → Wait → BotComplete flow that round-trips through the validator.

> **Don't** try to emit `TemplateLoopThroughData` directly — that's the extension's *macro* name, not a single widget. The JSON is always the start/body/end triple above.

#### Token references between steps (the general pattern)

Anything in the intent that needs to consume another step's output (Continue widget's `Data to check`, BotCreate's `Loop through data`, a Sheet/CSV/Excel writer's `DATA`, etc.) goes through `tokenRefs`, NOT `values`. The helper rejects a `tokenRef` against a non-token-typed param, so typos surface as errors instead of silent literals.

**The value shape is NOT universal** — the runtime in `axiom_lib/lib/execution/ExecutorJson.ts` branches on the param's `type` and expects different shapes. The helper builds the right one for you, but if you're inspecting the output (or hand-patching an axiom), the per-type rules are:

| Param `type` | Value shape the helper emits | Notes |
|---|---|---|
| `token` | `"[<name>]"` (single string) | Most common — used by Continue, AI steps, single-input data consumers. |
| `bot_token` | `"[<name>]"` | BotCreate's `Loop through data`. One token only. |
| `merge_token_list` | `"[<name>]"` | FilterMerge's `Base data` / `Join data`. Despite the `_list` suffix, takes one token. |
| `row_numbering_token` | `"[<name>]"` | RowNumbers input. |
| `write_google_sheet_token` | `"[<name>]"` | Google Sheet writer's `DATA` (single string, not array). |
| `write_csv_data_token` | `"[<name>]"` | CSV writer's `DATA`. |
| `write_excel_sheet_token` | `"[<name>]"` | Excel writer's `DATA`. |
| `token_list` | `"[<name1>]\n[<name2>]"` (newline-separated string) | Multi-token slot. Pass an array of names to the helper; it joins with `\n`. |
| `merge_token` | `"[<name1>]\n[<name2>]"` | Same — newline-separated string when multiple. |

Pre-v0.8.3 the helper always produced the array shape `["[<name>]"]` for every type, which was silently broken at runtime (downstream steps got the unresolved literal string). If you're maintaining axioms produced by older versions, re-run them through `BuildNoCodeWorkflow` to repair the value shape; the helper's `coerceTokenValue` will unwrap legacy arrays automatically when you re-process the intent.

#### Referencing a single COLUMN of row data inside a text field or script (`?*&` format)

This is a DIFFERENT mechanism from the token-typed params above, and it is the one most likely to be gotten wrong. The tables above cover token-typed *params* (`bot_token`, `token`, …) that consume a whole upstream token. But when you need one **specific column** of a sheet-read / loop row plugged into a **plain literal param** — an `Enter text` step's `Text` (type `long_text_required`), a `Go to page` URL, a `Write javascript` `Script`, a `Display a message`, etc. — you embed a **column reference** directly in the `values` string. These params are NOT token-typed, so `tokenRefs` does not apply; the reference is literal text the runtime resolves.

**The correct format is index-based, zero-based, with a `?*&` separator:**

```
[<token>?*&<0-based-column-index>]
```

Examples for a `WidgetReadGoogleSheet` step whose `token` is `google-sheet-data`, columns `First Name | Last Name | Email | Gender | Mobile | … | Current Address`:

| Column (header) | Index | Reference to embed |
|---|---|---|
| First Name | 0 | `[google-sheet-data?*&0]` |
| Last Name | 1 | `[google-sheet-data?*&1]` |
| Email | 2 | `[google-sheet-data?*&2]` |
| Gender | 3 | `[google-sheet-data?*&3]` |
| Mobile | 4 | `[google-sheet-data?*&4]` |
| Current Address | 9 | `[google-sheet-data?*&9]` |

```js
// Enter text step — plug column 0 (First Name) of the current loop row:
{ machineName: 'WidgetDriverEnterText',
  values: { 'Select text field': '#firstName', 'Text': '[google-sheet-data?*&0]' } }

// Inside a Write javascript step — the runtime substitutes the cell value before running:
// var g = `[google-sheet-data?*&3]`.trim();   // Gender column
```

- **Do NOT use `[google-sheet-data:Column Name]`** (colon + header name). That is wrong — it renders as literal text in the field and the step does nothing useful. The separator is `?*&` and the selector is a **numeric index**, not the header string.
- Inside a `Loop through data`, `[<read-step-token>?*&N]` resolves to column N of the **current row**. Reference the **read step's token** (e.g. `google-sheet-data`), not the loop's own output token.
- When you use index-based column refs, set the read step's **`First cell` to `A2`** so the header row isn't looped as a bogus data row (there's no header-name lookup to preserve).
- The whole-row reference (no `?*&`) is `[google-sheet-data]` — used for `bot_token`-typed params like the loop's `Loop through data`.
- If a value must be bound in the extension instead, leave it blank; the user picks the column via **Insert Data**. But prefer emitting the correct `?*&` reference so the axiom runs on import.

#### Multi-column scraping (SmartScraper / ScrapeLinks)

When a user wants more than one field per row (title + price + stock, etc.), `WidgetDriverSmartScraper`'s `Select` param accepts an **array of column specs**, one per field. Pass it through `values` and the helper fills in the UI-only defaults:

```js
{ machineName: 'WidgetDriverSmartScraper',
  values: {
    'Select': [
      { selector: 'article.product_pod h3 a',          resultType: 'textContent' },
      { selector: 'article.product_pod .price_color',  resultType: 'textContent' },
      { selector: 'article.product_pod .availability', resultType: 'textContent' },
    ],
    'Max results': '20',
  },
  token: 'scrape-data' }
```

Each column needs `selector` (CSS) and optionally `resultType` (`"textContent"` by default; can also be `"innerHTML"`, `"link"`, `"axiom-download"`). The runtime extracts those two fields per column and ignores the rest. Scope each column's CSS to a row container (e.g. `article.product_pod h3 a`) so results align across columns. The legacy single-string-selector form (`'Select': 'article.product_pod'`) still works for single-column scrapes — the helper recognises strings and passes them through.

#### Schedules + other top-level shape

`triggers` is empty `[]` unless the user wants a schedule. Schedule shape: `{name, status: "active", type: "recursive", time_criteria, interval_type, starting_time}`. Pass it through `intent.triggers` and the helper forwards it. The starting URL goes in `intent.contextUrl`. The rest of the envelope (`id: 0`, `openWidgetIndex: -1`, `data.injector`, `data.templateItem`, etc.) is handled by the helper — you don't need to think about it.

### Coded rules

- Always `import { AxiomApi } from '@axiom_ai/api'`. No other SDK import paths.
- Read the token from `process.env.<NAME>` — never inline a literal.
- Wrap step calls in `try { … } finally { await axiom.browserClose() }`.
- Only call methods listed in `references/axiom-api-method-allowlist.json`.
- Never call `step()` directly (it's the internal dispatcher — emit the named method like `goto`, `click`, `scrape`).
- Never call `_`-prefixed methods.

## Step 4 — Validate before declaring done (coded path only)

The no-code path validates inside `BuildNoCodeWorkflow` — nothing extra to do. The coded path needs an explicit validator pass:

```bash
node "<SKILL_BASE_DIR>/scripts/validate-coded.js" /tmp/your-script.js
```

Exit 0 = valid. Exit 1 = error codes printed (`UNKNOWN_METHOD`, `MISSING_LIFECYCLE`, `HARDCODED_TOKEN`, …). Fix and re-run. Don't argue with the validator — its rules come from the published `@axiom_ai/api` surface.

## Step 5 — Hand the artifact back to the user

### Confirm before saving, scheduling, or running

Saving to the user's account (the `saveCommand` or `mcp__axiom__save_automation`), attaching a schedule, and triggering a run all either **write to their account** or **consume runtime allowance** — `mcp__axiom__run_automation` runs on the user's machine through the desktop app, `trigger_bot` runs in the cloud; both count against the account's runtime. Always state plainly what is about to happen and get an explicit yes before doing it — e.g. *"This will save '<name>' to your Axiom account"* or *"This will trigger a run and use your cloud runtime quota."* Never save or trigger a run without a clear go-ahead, and confirm a second time for anything irreversible (placing an order, submitting a form, sending a message). When in doubt, ask.

**MCP mode:** after the user's yes, call `mcp__axiom__save_automation` with the IR instead of the `saveCommand` — it compiles and upserts by name (iterating never creates duplicates). Resolve any `warnings` it returns before declaring done. To verify with a run, `mcp__axiom__run_automation` blocks until the run finishes and returns the outcome inline, but it **requires the desktop app to be open** — if it answers that the app isn't running, relay that message verbatim and stop; do not reroute the run to the cloud. The same discipline applies to auth failures: a 401 from any `mcp__axiom__*` tool means the registered key is stale — go to Step 0.5's `verify` + re-registration; never fall back to `trigger_bot`, the bundled REST scripts, or invented endpoints.

### No-code: offer to save it to their account first

`BuildNoCodeWorkflow.invoke()` returns a `response.message` that asks the user whether they want to save the axiom directly to their Axiom account. **Relay that message verbatim and wait for their answer.** The workflow's `response.data` carries the `saveCommand` (an absolute `node scripts/save-automation.js --artifact <path>` invocation) and `response.nextSteps` gives you the exact branching logic.

The flow:

1. **User says yes** → run the `saveCommand` via Bash. It prints a single-line JSON to stdout: `{ok: true, name, id}` on success, `{ok: false, error, status?}` on failure.
   - On `ok: true`: tell the user *"Saved '<name>' to your Axiom account ✓"* and stop.
   - On `ok: false`: tell the user *"Save failed: <error>"* and fall through to the import flow below.
2. **User says no, or the save failed** → walk them through the manual-import flow: open the Chrome extension's builder, click the Cog icon, open "Import or download" → "Select file" → pick the JSON path → Save. Docs in `response.data.importDocsUrl`.
3. **Extension not installed** → invoke `HandoffToExtensionWorkflow` for install guidance, then loop back to step 2.

The save script needs `AXIOM_API_KEY` in env (Step 0 already ensures that) and `AXIOM_LAR_URL` if pointing at a non-prod LAR (defaults to `https://lar.axiom.ai`).

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
| MCP tools answer 401 (key rejected) | The key in the MCP client config is stale — a key was minted or re-pasted since registration | `node "<SKILL_BASE_DIR>/scripts/setup-desktop-mcp.js" verify`, then re-register with the current key and restart Claude Code (Step 0.5). Never retry via `trigger_bot` or raw HTTP. |

## User-reported runtime errors

If the user pastes or describes one of these *after* their axiom ran (vs failures you encountered while *generating* it), follow the recovery in the right column. Anything not on this list — point them at the dashboard's run reports.

| Symptom | What it means | What to tell the user |
|---|---|---|
| "Google access token has expired" / "Your Google access token is invalid or has expired" / Google Sheets steps suddenly returning permission errors after working before | Google has revoked the OAuth token axiom.ai uses on the user's behalf (security rotation, account change, or the user revoked it). Not an axiom bug — Google controls it. | Tell the user to click the **Axiom extension** icon in their browser, open **Google Sheets and API key**, and click **Connect Google Sheets** to re-grant access. Once reconnected, re-run the automation. See [`references/docs/no-code-tool/troubleshooting/errors/integrations/google-sheets.md`](references/docs/no-code-tool/troubleshooting/errors/integrations/google-sheets.md) for the canonical version. |

## What this skill won't do

- **In standalone mode it doesn't run the axiom.** That's the user's job — either via the dashboard (no-code) or `node script.js` (coded). In **MCP mode** it *can* run and verify via `mcp__axiom__run_automation` — but only after the explicit Step 5 confirmation (paid runtime; the desktop app must be open).
- **It doesn't troubleshoot live runs** *beyond* the table in "User-reported runtime errors" above. For anything else, point the user at the dashboard's run reports.

## Sandbox runtime discipline (OpenHands / agent sandboxes)

Three facts that save wasted cycles when this skill runs inside an agent sandbox:

- **Probe slice liveness with the platform heartbeat** before blaming credentials: `GET <laravel>/api/platform/heartbeat` is public and answers `{service:"laravel", feature:"platform-heartbeat", slice, …}`. The user's cloud pod exposes the same contract at `/api/v2/heartbeat`.
- **Never write files with heredocs** (`cat > f << EOF`) — the sandbox terminal rejects them as "multiple commands" and retrying the same call wastes turns. Write files with `printf`/`echo` appends, or `base64 -d`.
- **Do not `invoke_skill` for axiom tooling** — no axiom skill is seeded in the sandbox skill registry (the many generic skills you may see are not this one). Axiom capabilities come from the MCP tools and the job brief.
