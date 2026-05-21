---
title: Programmatic signup
metaTitle: Create an axiom.ai account and mint an API key from code
description: Three-call REST flow for code that needs to sign up its own user, log in, and mint an API key — useful for agents, Claude skills, and headless onboarding.
order: 4
---

For most users, the right path is to sign up in the browser and copy your API key from the dashboard — see [Authentication](/docs/developer-hub/api/authentication). This page is for **code that needs to sign up its own user**, typically:

- Agents and Claude skills that onboard a new caller automatically.
- CI / test harnesses that mint throwaway accounts.
- Wrapper tools that abstract the dashboard away from end users.

The same three endpoints power the [Code Tool's](https://code.axiom.ai) sign-up form, so anything you do here matches what a normal user would do in the browser.

## The three-step flow
***

```
POST /api/user/create   →   creates the account (no token yet)
        │
        ▼
POST /api/user/login    →   returns a Bearer JWT
        │
        ▼
GET  /api/user/key/create   →   returns the long-lived API key
```

All requests go to `https://lar.axiom.ai`.

### Step 1 — Create the account

```bash
curl -X POST https://lar.axiom.ai/api/user/create \
  -H "Content-Type: application/json" \
  -d '{
    "name":     "Ada Lovelace",
    "email":    "ada@example.com",
    "password": "<strong-password>",
    "company":  "",
    "country":  "",
    "role":     "",
    "campaign": "programmatic-signup",
    "language": "en-GB"
  }'
```

| Field | Required | Notes |
|---|---|---|
| `name` | yes | Free text. Rejected if it looks like a URL or email address — the server matches `[a-z0-9@:%._+~#=]{1,256}\.[a-z0-9()]{1,6}` and bails. Keep names plain. |
| `email` | yes | Must not be from a disposable-email provider (the server runs an `isDisposable()` check and returns `{"status": "To prevent abuse of our free plan, please do not register with an anonymous email provider."}` on failure). |
| `password` | yes | No length minimum enforced server-side at the moment; use something sensible. |
| `company`, `country`, `role` | no | Free text. Used for analytics; pass empty strings if unknown. |
| `campaign` | no | Free text. Use this to mark where the signup came from (`pro-code-signup`, `claude-skill`, your tool name) so the team can attribute traffic. |
| `language` | no | BCP 47 tag (e.g. `en-GB`, `de-DE`). Defaults to whatever the browser sends; in headless code, pass it explicitly. |

**Response (success):** the new user object.

```json
{
  "id": 12345,
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "company": "",
  "role": "",
  "country": "",
  "language": "en-GB"
}
```

**Response (failure):** a `200 OK` with a `status` field describing what went wrong. The endpoint doesn't use HTTP status codes for these cases — watch the `status` field.

```json
{ "status": "email_exists" }
```

```json
{ "status": "Could not create an account, name field contains a URL or email address" }
```

```json
{ "status": "To prevent abuse of our free plan, please do not register with an anonymous email provider." }
```

Welcome email is sent automatically on success.

### Step 2 — Log in

```bash
curl -X POST https://lar.axiom.ai/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ada@example.com", "password": "<strong-password>"}'
```

**Response (success):**

```json
{
  "id": 12345,
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOi...",
  "refresh_token": "def502009b..."
}
```

`token` is an OAuth2 access token (Bearer JWT) you'll use to authenticate the next call. It's not the long-lived API key yet — that's step 3.

**Response (failure):**

| Body | Meaning |
|---|---|
| `null` | Email doesn't exist on the platform, or password is wrong. The endpoint deliberately collapses these into one signal to avoid leaking which case applies. |
| `"blocked"` | Account is locked out after 29 failed login attempts. Will stay locked until contact support to reset. Don't loop on this. |

### Step 3 — Mint the long-lived API key

```bash
curl https://lar.axiom.ai/api/user/key/create \
  -H "Authorization: Bearer <JWT_FROM_STEP_2>"
```

**Response:**

```json
{ "token": "axm_..." }
```

This `token` is the long-lived API key you use everywhere else in the API — see [Authentication](/docs/developer-hub/api/authentication#use-the-key-in-a-request) for how it's passed.

> **One key per account.** Calling `GET /api/user/key/create` on an account that already has a key **invalidates the old one and returns a new one**. Any existing integration using the old key stops working immediately. To check if an account already has a key without invalidating it, call `GET /api/user/key/has-existing` (same Bearer JWT auth) and inspect `{"result": true|false}`.

## End-to-end example (Node.js)
***

```javascript
const BASE = 'https://lar.axiom.ai';

async function signUpAndMintKey({ name, email, password, campaign = 'programmatic' }) {
  // Step 1 — create
  const createRes = await fetch(`${BASE}/api/user/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name, email, password,
      company: '', country: '', role: '',
      campaign,
      language: process.env.LANG?.split('.')[0]?.replace('_', '-') ?? 'en-GB',
    }),
  });
  const createJson = await createRes.json();
  if (createJson.status) {
    // status field present = an error case (email_exists, disposable, name-looks-like-url, ...)
    throw new Error(`signup failed: ${createJson.status}`);
  }

  // Step 2 — log in
  const loginRes = await fetch(`${BASE}/api/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const loginJson = await loginRes.json();
  if (loginJson === null) throw new Error('login failed: bad credentials');
  if (loginJson === 'blocked') throw new Error('login failed: account locked (too many failed attempts)');

  // Step 3 — mint API key (uses the JWT from step 2)
  const keyRes = await fetch(`${BASE}/api/user/key/create`, {
    headers: { 'Authorization': `Bearer ${loginJson.token}` },
  });
  const keyJson = await keyRes.json();

  return { user: createJson, apiKey: keyJson.token };
}

// Usage
const { user, apiKey } = await signUpAndMintKey({
  name: 'Ada Lovelace',
  email: `ada+${Date.now()}@example.com`,  // unique email avoids `email_exists`
  password: process.env.NEW_ACCOUNT_PASSWORD,
  campaign: 'my-tool-headless-signup',
});
console.log(`Provisioned ${user.email} with API key (last 6: ${apiKey.slice(-6)})`);
```

## If the account already exists
***

Skip step 1 and just do steps 2-3:

```javascript
// existing email + password → JWT → API key
const loginRes = await fetch(`${BASE}/api/user/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
const { token: jwt } = await loginRes.json();

const keyRes = await fetch(`${BASE}/api/user/key/create`, {
  headers: { 'Authorization': `Bearer ${jwt}` },
});
const { token: apiKey } = await keyRes.json();
```

Remember: step 3 invalidates the previous API key. If the user already had integrations wired up, you'll break them. Use `GET /api/user/key/has-existing` first to avoid surprising them.

## Abuse & rate-limit considerations
***

- **Disposable-email check.** Step 1 blocks signups from anonymous email providers (`mailinator.com`, `10minutemail.com`, etc.). If your tool legitimately needs to onboard high volumes, work with the team to whitelist your domain rather than trying to bypass the check.
- **Login lockout.** 29 failed login attempts puts the account into `"blocked"` state. The lockout is not auto-cleared — the user has to email support. So loops that retry login on a bad password are dangerous.
- **No bulk-create endpoint.** If you find yourself signing up thousands of accounts programmatically, talk to the team first — at that point a different account model (team API key, multi-tenant scoping) is the right answer.
- **Welcome email is sent on success.** Every successful `POST /api/user/create` sends a registered-with-Axiom email. Don't use this flow for ephemeral test accounts at scale without coordinating with the team — it's a deliverability liability.

## Related
***

- [Authentication](/docs/developer-hub/api/authentication) — the manual flow + how the API key is used in subsequent requests
- [Quickstart](/docs/developer-hub/api/quickstart) — your first run after you have a key
- [Start a browser session](/docs/developer-hub/api/step-functions/start-a-session) — what to do with the key
