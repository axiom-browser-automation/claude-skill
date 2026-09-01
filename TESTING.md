# Testing the Axiom skill + desktop-app MCP (AXIOM-6277)

Pre-release. The skill (v0.14.0) is on this repo's `AXIOM-6277` branch, and the desktop
app with the built-in MCP server is a **release candidate** at
<https://site.axiom.ai/axiom_desktop/rc/> (macOS Apple Silicon `.dmg`, Linux `.deb` /
`.AppImage`; no Windows build yet). Five steps, then try things.

## Before you start

- Claude Code CLI installed and signed in; git access to `bitbucket.org/thegreatwebco/claude-skill`.
- An Axiom account on a **paid plan** and its API key (production). Don't mint a new key if
  you already have one — minting rotates the key and breaks anything using the old one.
- If you already have the public `axiom@axiom-skills` plugin, remove it first:
  `/plugin uninstall axiom@axiom-skills`.

## 1. Install the skill from the branch

```bash
git clone -b AXIOM-6277 git@bitbucket.org:thegreatwebco/claude-skill.git ~/axiom-claude-skill
```

In Claude Code, as **separate messages** (the third one matters — see the warning below):

```
/plugin marketplace add ~/axiom-claude-skill
/plugin install axiom@axiom-skills
/plugin update axiom
```

Restart Claude Code. **Verify before going further** — from a shell:

```bash
claude plugin list                 # axiom@axiom-skills must say Version: 0.14.0
claude plugin marketplace list     # axiom-skills must say Source: Directory (…/axiom-claude-skill)
```

> ⚠️ **Why the `update`:** the public GitHub marketplace has the *same name*
> (`axiom-skills`). If you ever installed the published plugin, the `marketplace add`
> silently repoints the source at your clone but the installed copy **stays at the old
> version**, and `install` then reports "already installed" and does nothing — you'd be
> testing v0.8.x (five workflows, no `setup_desktop_mcp`) with no error anywhere.
> `/plugin update axiom` re-resolves from your clone. Same after a `git pull` in the
> clone: directory sources don't auto-refresh — run `/plugin update axiom` and restart.

Then in a fresh session: ask *"list the workflows the axiom skill exposes"* — you should
see six, including `setup_desktop_mcp`. (Deterministic check:
`node ~/axiom-claude-skill/plugins/axiom/skills/axiom/workflows/index.js list`.)

If your API key isn't set yet, add it to `~/.claude/settings.json`:

```json
{ "env": { "AXIOM_API_KEY": "axm_…", "AXIOM_LAR_URL": "https://lar.axiom.ai" } }
```

## 2. Install the desktop app release candidate

Download your platform's installer from <https://site.axiom.ai/axiom_desktop/rc/> and
install it (macOS: if Gatekeeper objects, right-click → Open). Launch it — the Axiom icon
appears in the menu bar / tray. The app must be **running** for the browser tools.

## 3. Connect Claude to it

Open the app's tray menu → **Set up Claude MCP…** → toggle on → paste the same API key →
**Save and activate**. The status line should report Claude Code as registered.

Then **restart Claude Code** (the tools only appear in a new session). Check: `/mcp` shows
`axiom` connected; asking *"what mcp__axiom tools do you have?"* lists 17.

Alternative without the tray UI (any platform, from a shell where the key is exported):

```bash
echo "$AXIOM_API_KEY" | <path-to-app>/axiom-mcp setup save-key   # key over stdin, never argv
<path-to-app>/axiom-mcp setup status
```

(Linux: `/usr/bin/axiom-mcp` after `dpkg -i`. macOS: inside the app bundle under
`Contents/MacOS/`.) Or let the skill do it — say *"set up the Axiom desktop app"*; on Linux
it downloads, extracts and registers by itself. Point it at the RC index first:
`export AXIOM_DESKTOP_INDEX_URL=https://site.axiom.ai/axiom_desktop/rc/`.

## 4. Try it

| # | Say to Claude | You should see |
|---|---|---|
| 1 | *"build an axiom that scrapes the h1 of example.com and save it to my account"* | Claude probes the page through the MCP (`open_browser`, `step`), authors + validates the IR (`compile_ir`), **asks before saving**, saves via `save_automation`. The automation appears in your Axiom dashboard. |
| 2 | *"run it and tell me what it scraped"* | Asks for a go-ahead (paid runtime), then `run_automation` returns the result. |
| 3 | Quit the desktop app, repeat 1 | Claude says the desktop app isn't running and asks you to open it — no fallback to raw HTTP or a cloud run. |
| 4 | With the MCP **not** registered (or in a session before step 3): repeat 1 | The old behaviour: a JSON file + an offer to save, and a single offer to set up the desktop app. |
| 5 | *"set up the Axiom desktop app"* | Routes to the setup workflow: download link, tray instructions, "restart Claude Code". |
| 6 | Look at the transcript and `~/.claude.json` | The key never appears in chat; it sits in `mcpServers.axiom.env`. |

## Troubleshooting

- **Only five workflows / no `setup_desktop_mcp`** → you're running the published skill,
  not the branch. `claude plugin list` will show a version below 0.14.0. Fix:
  `/plugin marketplace add ~/axiom-claude-skill`, `/plugin update axiom`, restart. Also
  confirm the clone: `git -C ~/axiom-claude-skill branch --show-current` → `AXIOM-6277`.
- **`/mcp` doesn't list `axiom`** → redo step 3 and restart; `axiom-mcp setup status`
  shows what's registered where.
- **Browser tools answer "desktop app isn't running"** → open the app (tray icon must be
  visible); that's expected behaviour, not a bug (see step 2).

## 5. Report

Prompt, Claude's full reply, which tools it called, and the app version (`/axiom/isrunning`
on `http://127.0.0.1:3333`). On failures also attach the app's `axiom-server.log`
(macOS: `~/Library/Logs/<bundle-id>/`). Redact the key.

---

**Automated equivalent:** `api-publish` branch `AXIOM-6277`,
`AXIOM_DESKTOP_INDEX_URL=https://site.axiom.ai/axiom_desktop/rc/ bash test-env/run.sh`
runs the same flow headlessly (T7 setup leg, T8 MCP-mode build). See its `test-env/README.md`.
