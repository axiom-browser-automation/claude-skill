# claude-skill — Axiom builder

Claude Code plugin that helps users build Axiom automations from natural language. Produces either:

- **No-code axiom** — an `AutomationTemplate` JSON conforming to the schema used by Axiom's no-code dashboard.
- **Coded axiom** — a Node script using the `@axiom_ai/api` library.

Claude (loaded with this skill) reads the user's prompt, picks the right format, emits the artifact, and runs the bundled validator before declaring done.

## Install

> **For the install steps below you need Claude Code (the CLI tool)** — the `/plugin` slash-commands only work in a terminal session. Once installed, you can keep working in Claude Code or switch to the [Claude extension for VS Code](#step-3--optional-recommended-switch-to-the-vs-code-extension) (see Step 3) for day-to-day building. If you don't have Claude Code yet, install from <https://www.claude.com/product/claude-code>.

Open a Claude Code session in any directory and submit each command as its **own** message — wait for the first to finish before sending the second.

**Step 1 — add the marketplace:**

```
/plugin marketplace add git@github.com:axiom-browser-automation/claude-skill.git
```

You should see a confirmation that the `axiom-skills` marketplace was added.

**Step 2 — install the plugin:**

```
/plugin install axiom@axiom-skills
```

> ⚠️ Submit Step 1 and Step 2 as separate messages. If you paste both into a single message, Claude Code concatenates them and tries to clone a malformed URL — you'll see a `fatal: remote error: ... is not a valid repository name` from git.

Restart Claude Code after install so the skill is picked up. The first invocation will check that `AXIOM_API_KEY` is set — if it isn't, the skill walks you through signup and key minting (see [`plugins/axiom/skills/axiom/references/account-setup.md`](./plugins/axiom/skills/axiom/references/account-setup.md)). To set it manually, add to `~/.claude/settings.json`'s `env` block:

```json
{
  "env": {
    "AXIOM_API_KEY": "axm_…",
    "AXIOM_LAR_URL": "https://lar.axiom.ai"
  }
}
```

### Step 3 — optional, recommended: switch to the VS Code extension

The `/plugin` commands above require Claude Code (the CLI), but once the plugin is installed, day-to-day building works smoothly in the **Claude extension for VS Code**. Install it from VS Code's Extensions panel (search "Claude"), sign in with the same account you used for Claude Code, and the axiom skill will activate automatically when you ask Claude to build an axiom in any project.

The extension shares the plugin install + `~/.claude/settings.json` env vars with the CLI, so you only set things up once.

### Updating

Updating is **two commands**, not one. Submit each separately:

```
/plugin update axiom@axiom-skills
```

```
/reload-plugins
```

The first command fetches the new version into Claude Code's plugin cache; the second applies it to the running session. If you skip `/reload-plugins`, the cache is updated but you'll keep using the old skill until you restart Claude Code. The success message from the first command literally tells you this — look for `✓ Updated axiom. Run /reload-plugins to apply.`

Run both from Claude Code CLI — the `/plugin` slash-commands aren't available in the VS Code extension. Auto-update is on by default for marketplaces added explicitly; you can disable it per-marketplace in `~/.claude/settings.json`.

If `/reload-plugins` misbehaves for any reason, quit Claude Code entirely and restart — that always picks up the latest cached version.

## What's in here

```
.claude-plugin/marketplace.json      Marketplace manifest (lists the axiom plugin)
plugins/axiom/.claude-plugin/         Plugin manifest
plugins/axiom/skills/axiom/
  SKILL.md                            Claude entry — decision rules + workflow
  workflows/                          Five-workflow registry (signup, build, run, handoff)
  references/                         Schemas, action vocab, method allowlist, docs index
  examples/                           Golden valid artifacts (no-code + coded)
  scripts/                            Validators + helpers Claude runs on its own output
test/                                 Jest test suite — validates examples + negative fixtures
```

## Development

```bash
npm install
npm test                              # full suite
npm run test:no-code                  # just the no-code path
npm run test:coded                    # just the coded path
npm run validate:no-code -- path/to/file.json
npm run validate:coded   -- path/to/script.js
AXIOM_API_KEY=... npm run save:no-code -- path/to/axiom.json
AXIOM_PASSWORD=... npm run signup -- --email user@example.com --name "User"
```

### Environment variables

See [`.env.example`](./.env.example) for the full list. Most-used:

| Var | What | Default |
|---|---|---|
| `AXIOM_API_KEY` | Long-lived API token for the save helper | (required for save) |
| `AXIOM_LAR_URL` | Base URL the save helper POSTs to | `https://lar.axiom.ai` |

For Claude Code to pick up these env vars when running the skill's scripts via its Bash tool, set them in `~/.claude/settings.json`'s `env` block (or in your shell rc — Claude Code inherits your environment).

### Add a new test fixture

The test suite is fixture-driven via `test.each` — adding a fixture file is the only step.

**Valid examples** (must pass validation): drop a `.json` or `.js` into `plugins/axiom/skills/axiom/examples/no-code/` or `plugins/axiom/skills/axiom/examples/coded/`. The `valid-examples.spec.ts` picks it up automatically.

**Invalid fixtures** (must fail with a specific error): drop into `test/no-code/fixtures/invalid/` or `test/coded/fixtures/invalid/`. Encode the expected error in the filename suffix:

- No-code: `<name>.<expected-keyword>.json` — e.g. `missing-name.required.json`. Keywords are AJV's: `required`, `enum`, `type`, `additionalProperties`, etc.
- Coded: `<name>.<EXPECTED_CODE>.js` — e.g. `phantom-method.UNKNOWN_METHOD.js`. Codes are the validator's: `UNKNOWN_METHOD`, `PRIVATE_METHOD`, `INTERNAL_METHOD`, `MISSING_LIFECYCLE`, `HARDCODED_TOKEN`, `DISALLOWED_IMPORT`, `PARSE_ERROR`.

**Regression bank**: real Claude outputs go in `test/{no-code,coded}/fixtures/claude-emitted/` with a sibling `.expected.json` (`{"valid": true}` or `{"valid": false, "expectedKeyword": "..."}` / `"expectedCode": "..."`).

## Contributing

The skill's content (recipes, decision rules, error guidance) lives in `plugins/axiom/skills/axiom/SKILL.md` and `plugins/axiom/skills/axiom/references/*.md`. When the `@axiom_ai/api` surface changes:

1. Update `references/axiom-api-method-allowlist.json` and `references/axiom-api-surface.md`.
2. Run `npm test` to confirm existing examples still validate.
3. Add a new example to `examples/coded/` if the change introduces a new method users should know about.

The vendored schema (`automation-template-schema.json`), action vocabulary, sample IRs, docs index, and workflow catalog are regenerated by maintainer tooling — not edited by hand.
