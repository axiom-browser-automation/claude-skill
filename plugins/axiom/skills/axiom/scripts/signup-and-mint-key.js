#!/usr/bin/env node
/**
 * signup-and-mint-key.js
 *
 * Walk a user from "no Axiom account" or "no API key yet" to a freshly-minted long-lived
 * API key. Wraps the three REST calls documented at:
 *   /docs/developer-hub/api/programmatic-signup
 *
 *   POST /api/user/create   (skipped with --existing)
 *   POST /api/user/login
 *   GET  /api/user/key/create  (with Bearer JWT)
 *
 * Usage:
 *   AXIOM_PASSWORD='…' node signup-and-mint-key.js --email user@example.com [--name "Name"]
 *   AXIOM_PASSWORD='…' node signup-and-mint-key.js --email user@example.com --existing
 *   AXIOM_PASSWORD='…' node signup-and-mint-key.js --email user@example.com --check-only
 *
 * Env:
 *   AXIOM_PASSWORD   required — never passed via CLI args to keep it out of process listings.
 *   AXIOM_LAR_URL    optional — base URL, defaults to https://lar.axiom.ai.
 *
 * Output on success (to stdout, parseable):
 *   API_KEY=axm_xxxxx
 *   USER_ID=12345
 *   USER_EMAIL=user@example.com
 *
 * Exits 0 on success, 1 on user-fixable failure (clear error printed to stderr), 2 on usage error.
 *
 * Exported for tests: `signupAndMintKey({...})` returns `{apiKey, userId, userEmail}`.
 */

const DEFAULT_BASE_URL = 'https://lar.axiom.ai'

/**
 * @param {object} opts
 * @param {string} opts.email
 * @param {string} opts.password
 * @param {string} [opts.name]              required if existing=false
 * @param {boolean} [opts.existing]         skip /api/user/create; go straight to login + mint
 * @param {boolean} [opts.checkOnly]        report whether a key already exists; do NOT mint a new one
 * @param {string} [opts.baseUrl]
 * @param {function} [opts.fetchImpl]
 * @returns {Promise<{apiKey?: string, userId?: number, userEmail?: string, hasExistingKey?: boolean}>}
 */
async function signupAndMintKey(opts) {
    const {
        email,
        password,
        name,
        existing = false,
        checkOnly = false,
        baseUrl = DEFAULT_BASE_URL,
        fetchImpl = fetch
    } = opts

    if (!email) throw new Error('email is required')
    if (!password) throw new Error('AXIOM_PASSWORD is required (export AXIOM_PASSWORD=...; never pass via CLI)')
    if (!existing && !name) throw new Error('name is required when creating a new account (or pass --existing)')

    const url = (p) => `${baseUrl.replace(/\/$/, '')}${p}`

    // ---- Step 1: create (unless --existing) ----
    if (!existing) {
        const createRes = await fetchImpl(url('/api/user/create'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({
                name,
                email,
                password,
                company: '',
                country: '',
                role: '',
                campaign: 'claude-skill',
                language: 'en-GB'
            })
        })
        const createJson = await safeJson(createRes)

        // Success returns the new User model serialized as JSON — has `id`, plus a `status`
        // column set to `'created'` (the User model's status field, NOT an error signal).
        // Failure returns `{status: "<error message>"}` with HTTP 200 and no `id`.
        const isError = createJson && !createJson.id && createJson.status
        if (isError) {
            if (createJson.status === 'email_exists') {
                // Helpful fallback — user actually already had an account, just continue to login.
                // Surface as a one-line note so callers can show the user.
                process.stderr.write('NOTE: email_exists — falling back to login\n')
            } else if (/anonymous email|disposable/i.test(createJson.status)) {
                // Laravel's user controller blocks disposable/anonymous providers with the message
                // "...please do not register with an anonymous email provider." — match that
                // plus the more colloquial "disposable" if the wording ever changes.
                throw new Error('disposable email — please use a real address')
            } else {
                throw new Error(`signup failed: ${createJson.status}`)
            }
        }
    }

    // ---- Step 2: login ----
    const loginRes = await fetchImpl(url('/api/user/login'), {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({email, password})
    })
    const loginJson = await safeJson(loginRes)

    // The login endpoint returns either:
    //   - the user object with a `token` field (success)
    //   - null  (bad credentials — deliberately collapses "wrong password" and "unknown email")
    //   - the string "blocked"  (account locked out after 29 failed attempts)
    if (loginJson === null) {
        throw new Error('invalid credentials (login returned null)')
    }
    if (loginJson === 'blocked') {
        throw new Error('account locked — too many failed login attempts; contact support')
    }
    if (!loginJson || !loginJson.token) {
        throw new Error(`login failed: unexpected response ${JSON.stringify(loginJson)}`)
    }

    const jwt = loginJson.token
    const userId = loginJson.id
    const userEmail = loginJson.email || email

    // ---- Step 2.5: --check-only short-circuit ----
    if (checkOnly) {
        const hasRes = await fetchImpl(url('/api/user/key/has-existing'), {
            headers: {'Authorization': `Bearer ${jwt}`, 'Accept': 'application/json'}
        })
        const hasJson = await safeJson(hasRes)
        return {hasExistingKey: !!(hasJson && hasJson.result), userId, userEmail}
    }

    // ---- Step 3: mint key ----
    // NB: this INVALIDATES any previous key on the account.
    const keyRes = await fetchImpl(url('/api/user/key/create'), {
        headers: {'Authorization': `Bearer ${jwt}`, 'Accept': 'application/json'}
    })
    const keyJson = await safeJson(keyRes)
    if (!keyJson || !keyJson.token) {
        throw new Error(`key mint failed: unexpected response ${JSON.stringify(keyJson)}`)
    }

    return {apiKey: keyJson.token, userId, userEmail}
}

async function safeJson(res) {
    const text = await res.text()
    if (!text) return null
    try { return JSON.parse(text) } catch (_) {
        // Some failure modes (HTML error pages) return non-JSON. Surface as a clear error upstream.
        throw new Error(`non-JSON response (HTTP ${res.status}): ${text.slice(0, 200)}`)
    }
}

module.exports = {signupAndMintKey}

// ---- CLI ----
if (require.main === module) {
    const args = parseArgs(process.argv.slice(2))
    const password = process.env.AXIOM_PASSWORD
    const baseUrl = process.env.AXIOM_LAR_URL || DEFAULT_BASE_URL

    if (args.help || !args.email) {
        usage()
        process.exit(args.help ? 0 : 2)
    }
    if (!password) {
        console.error('AXIOM_PASSWORD env var is required.')
        console.error('Set it in your shell first (so it stays out of process listings and chat history):')
        console.error("  export AXIOM_PASSWORD='your-password'")
        process.exit(2)
    }
    if (!args.existing && !args.name) {
        console.error('--name is required when creating a new account (or pass --existing)')
        process.exit(2)
    }

    signupAndMintKey({
        email: args.email,
        password,
        name: args.name,
        existing: args.existing,
        checkOnly: args['check-only'],
        baseUrl
    })
        .then(result => {
            if (args['check-only']) {
                console.log(`HAS_EXISTING_KEY=${result.hasExistingKey ? 'true' : 'false'}`)
                console.log(`USER_ID=${result.userId}`)
                console.log(`USER_EMAIL=${result.userEmail}`)
            } else {
                console.log(`API_KEY=${result.apiKey}`)
                console.log(`USER_ID=${result.userId}`)
                console.log(`USER_EMAIL=${result.userEmail}`)
                console.error('NOTE: this minted a fresh key. Any previous key on the account is now invalid.')
            }
            process.exit(0)
        })
        .catch(err => {
            console.error(`FAIL  ${err.message}`)
            process.exit(1)
        })
}

function parseArgs(argv) {
    const out = {}
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i]
        if (a === '-h' || a === '--help') { out.help = true; continue }
        if (a === '--existing') { out.existing = true; continue }
        if (a === '--check-only') { out['check-only'] = true; continue }
        if (a === '--email') { out.email = argv[++i]; continue }
        if (a === '--name') { out.name = argv[++i]; continue }
        console.error(`unknown arg: ${a}`)
        process.exit(2)
    }
    return out
}

function usage() {
    console.log(`signup-and-mint-key.js — bootstrap an Axiom API key

Usage:
  AXIOM_PASSWORD='...' node signup-and-mint-key.js --email <email> [--name "<name>"]
  AXIOM_PASSWORD='...' node signup-and-mint-key.js --email <email> --existing
  AXIOM_PASSWORD='...' node signup-and-mint-key.js --email <email> --check-only

Flags:
  --email <email>      account email (always required)
  --name "<name>"      account display name (required when creating; ignored with --existing)
  --existing           skip /api/user/create; user already has an account
  --check-only         report whether the user already has an API key (does NOT mint a new one)
  -h, --help           this message

Env:
  AXIOM_PASSWORD       account password — REQUIRED via env; never accept on the CLI.
  AXIOM_LAR_URL        base URL; default https://lar.axiom.ai.

Output (success, create/login flow):
  API_KEY=axm_xxxxx
  USER_ID=12345
  USER_EMAIL=user@example.com

Output (--check-only):
  HAS_EXISTING_KEY=true|false
  USER_ID=12345
  USER_EMAIL=user@example.com

WARNING: minting a key INVALIDATES any previous key on the account. Use --check-only first
if you want to confirm the user doesn't already have a key wired into existing integrations.
`)
}
