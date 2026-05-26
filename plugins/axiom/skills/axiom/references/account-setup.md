# Account setup — getting the user from zero to a working API key

Three Axiom REST endpoints together provide an account → key flow. Use this when the user doesn't yet have `AXIOM_API_KEY` set, or when the save helper returned 401.

```
POST /api/user/create   →  user object        (new account; can skip if user already has one)
POST /api/user/login    →  Bearer JWT         (always required)
GET  /api/user/key/create   (with Bearer JWT) →  long-lived API key (axm_…)
```

Source-of-truth website doc: [/docs/developer-hub/api/programmatic-signup](https://axiom.ai/docs/developer-hub/api/programmatic-signup). The shapes there exactly match what the bundled helper script uses.

## When to invoke the onboarding flow

Trigger this when **any** of the following is true:

- `AXIOM_API_KEY` env var is unset / empty.
- A workflow that uses the key (e.g. `run_automation`) returned HTTP 401 (`Unable to authenticate, please check your API key`).
- User explicitly asks to create an Axiom account / "I don't have a key yet" / "set me up".

## How to drive it (the choreography)

Use the bundled helper `scripts/signup-and-mint-key.js`. Never POST to `/api/user/create` yourself by hand — the helper handles the create-then-login race, the disposable-email gate, and the `email_exists` fallback.

**Step 1 — Ask the user what they need.** One question with three answers:

> *"Do you have an Axiom account already? (a) Yes, I just haven't minted an API key yet, (b) No, sign me up, (c) I have a key, let me paste it."*

If (c), just take the key, write it to `~/.claude/settings.json`'s `env` block under `AXIOM_API_KEY`, and tell them to restart Claude Code. Skip the rest of this doc.

**Step 2 — Collect the inputs.**

For new accounts (b): name + email.
For existing accounts (a): email only.

**Never take the password in chat.** Instead, tell the user:

> *"Set your password in your shell first so it doesn't end up in our chat history: `export AXIOM_PASSWORD='your-password-here'` — I'll read it from the env and never see the value."*

After they set it, you proceed.

**Step 3 — Run the helper.**

(Paths below use `<SKILL_BASE_DIR>` — substitute the absolute path announced at skill activation.)

Existing account:

```bash
node "<SKILL_BASE_DIR>/scripts/signup-and-mint-key.js" \
  --email user@example.com \
  --existing
```

New account:

```bash
node "<SKILL_BASE_DIR>/scripts/signup-and-mint-key.js" \
  --name "User's Name" \
  --email user@example.com
```

The helper reads `AXIOM_PASSWORD` from the env. Output on success:

```
API_KEY=axm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
USER_ID=12345
USER_EMAIL=user@example.com
```

**Step 4 — Persist the key.**

Tell the user to add the key to `~/.claude/settings.json` so the next session inherits it:

```json
{
  "env": {
    "AXIOM_LAR_URL": "https://lar.axiom.ai",
    "AXIOM_API_KEY": "axm_…"
  }
}
```

Restart Claude Code after editing settings.json — env vars are read at startup.

**Step 5 — Use the key in the current session.**

For the current session (no restart), export it inline before invoking any workflow that needs it:

```bash
export AXIOM_API_KEY="axm_…"
```

## Important gotcha — minting a key invalidates the previous one

`GET /api/user/key/create` always issues a **new** key and revokes the old one. So:

- Run the helper **once per user** unless they want to rotate.
- If you run it twice in the same conversation, the first key stops working.
- For existing users who already have a working integration elsewhere, **warn them** before running `--existing` — their other tools will break until they update them to the new key.

If you want to check whether a user already has a key without rotating it, use `GET /api/user/key/has-existing` with the Bearer JWT (returns `{result: true|false}`). The helper exposes this via `--check-only`.

## Error modes the helper surfaces

| Output | Cause | Fix |
|---|---|---|
| `email_exists — falling back to login` | The user has an account already; helper switched to login mode. | Just informational — continues automatically. |
| `disposable email — please use a real address` | `/api/user/create` blocks anonymous email providers (mailinator etc.). | Ask the user for a different email. |
| `invalid credentials (login 401)` | Wrong password, or wrong email entirely. | Ask them to double-check the password they exported. |
| `account locked — too many failed attempts` | 29+ failed login attempts. Account is locked; user must contact support. | Stop. Don't retry. |
| `AXIOM_PASSWORD is required` | Helper couldn't read the env var. | Make sure the user `export`ed it, not just typed it in another window. |

## Reference for the underlying flow

The helper does roughly this in pure JS — for understanding, not for re-implementation:

```js
// Step 1 — create (skipped if --existing)
const created = await fetch(`${AXIOM_LAR_URL}/api/user/create`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({name, email, password, company: '', country: '', role: '', campaign: 'claude-skill', language: 'en-GB'})
}).then(r => r.json())

// Step 2 — login
const {token: jwt} = await fetch(`${AXIOM_LAR_URL}/api/user/login`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email, password})
}).then(r => r.json())

// Step 3 — mint key
const {token: apiKey} = await fetch(`${AXIOM_LAR_URL}/api/user/key/create`, {
  headers: {'Authorization': `Bearer ${jwt}`}
}).then(r => r.json())
```
