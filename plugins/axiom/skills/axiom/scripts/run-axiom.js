#!/usr/bin/env node
/**
 * run-axiom.js
 *
 * Drives an axiom run through the Axiom REST surface. We use the already-shipped
 * name-based endpoints rather than introducing new id-based ones; the trade-offs
 * (no run identity, status is binary, no failure detection, no targeted cancel)
 * are documented in references/workflows-index.md.
 *
 *   POST /api/v3/list-automations  → enumerate the user's axiom names (auth: key in body)
 *   POST /api/v4/trigger           → fire a run by name (auth: X-API-KEY header)
 *   POST /api/v3/run-data          → poll status by name (auth: key in body)
 *
 * Cancel is intentionally not exposed — the existing /v4/stop endpoint requires
 * pod password + pod id which we can only partially recover from the trigger
 * response's VNC URL, and there's no way to target a specific run when multiple
 * are concurrent. Users wanting to cancel should use the dashboard.
 *
 *   AXIOM_API_KEY=axm_... node run-axiom.js list
 *   AXIOM_API_KEY=axm_... node run-axiom.js trigger --name "My Scraper"
 *   AXIOM_API_KEY=axm_... node run-axiom.js status  --name "My Scraper"
 *   AXIOM_API_KEY=axm_... node run-axiom.js wait    --name "My Scraper" [--timeout 300] [--poll 5]
 */

const DEFAULT_BASE_URL = 'https://lar.axiom.ai'

/** List the user's saved automations. Returns the `names` array. */
async function listAutomations(opts) {
    const {apiKey, baseUrl = DEFAULT_BASE_URL, fetchImpl = fetch} = opts
    if (!apiKey) throw new Error('apiKey is required')

    const res = await fetchImpl(`${baseUrl.replace(/\/$/, '')}/api/v3/list-automations`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({key: apiKey})
    })
    const json = await parseOrThrow(res, 'listAutomations')
    if (json.status !== 'success') {
        throw new Error(`listAutomations: unexpected response shape ${JSON.stringify(json)}`)
    }
    return json.data && json.data.names ? json.data.names : []
}

/**
 * Trigger an axiom run by name.
 *
 * Returns `{vncUrl, podPassword}` on success. The pod password is parsed from
 * the VNC URL's query string — useful as evidence of which pod was assigned,
 * but NOT enough to drive a cancel via /v4/stop (which also needs pod id).
 *
 * On 503 (queue full) and queued responses, returns `{queued: true, message}`.
 */
async function triggerByName(opts) {
    const {apiKey, baseUrl = DEFAULT_BASE_URL, fetchImpl = fetch, name, data, apiKeys, noWait} = opts
    if (!apiKey) throw new Error('apiKey is required')
    if (!name) throw new Error('name is required')

    const body = {name}
    if (data !== undefined) body.data = data
    if (apiKeys !== undefined) body.apiKeys = apiKeys
    if (noWait !== undefined) body.noWait = noWait

    const res = await fetchImpl(`${baseUrl.replace(/\/$/, '')}/api/v4/trigger`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'X-API-KEY': apiKey},
        body: JSON.stringify(body)
    })
    const json = await parseOrThrow(res, 'triggerByName')

    // The endpoint returns one of:
    //   {OPEN LINK IN BROWSER: vncUrl}         — happy path, HTTP 200
    //   {status: 'queued', message: '...'}     — HTTP 200, no pod available
    //   {status: 'error', message: '...'}      — non-2xx, already thrown above
    if (json.status === 'queued') {
        return {queued: true, message: json.message || 'Axiom queued'}
    }
    const vncUrl = json['OPEN LINK IN BROWSER']
    if (!vncUrl) {
        throw new Error(`triggerByName: unexpected response shape ${JSON.stringify(json)}`)
    }
    return {vncUrl, podPassword: parseVncPassword(vncUrl)}
}

/**
 * Poll status of any run of the named axiom.
 *
 * Returns `{status: 'Running' | 'Finished', data: {sheetId: rows}}`. Caveat:
 * `Finished` means "no pod is currently running this task name for this user"
 * — it does NOT specifically refer to a run the caller triggered. If the user
 * has concurrent runs of the same axiom, the status flips to `Finished` when
 * ANY of them ends. There's also no way to distinguish success from failure.
 */
async function getStatusByName(opts) {
    const {apiKey, baseUrl = DEFAULT_BASE_URL, fetchImpl = fetch, name} = opts
    if (!apiKey) throw new Error('apiKey is required')
    if (!name) throw new Error('name is required')

    const res = await fetchImpl(`${baseUrl.replace(/\/$/, '')}/api/v3/run-data`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({key: apiKey, name})
    })
    return await parseOrThrow(res, 'getStatusByName')
}

/**
 * Trigger then poll until status flips to `Finished` (or the timeout expires).
 *
 * Important caveat: returns when ANY run of the name reaches `Finished`, not
 * necessarily the run this call triggered. Acceptable for the common case of
 * a single sequential run; misleading if the user runs the same axiom
 * concurrently from the dashboard or a schedule. See module docstring.
 */
async function runAndWaitByName(opts) {
    const {apiKey, baseUrl, fetchImpl, name, data, apiKeys,
           timeoutMs = 300_000, pollMs = 5_000, sleep = defaultSleep} = opts
    const trigger = await triggerByName({apiKey, baseUrl, fetchImpl, name, data, apiKeys})
    if (trigger.queued) {
        return {triggered: trigger, finalStatus: 'queued'}
    }

    const deadline = Date.now() + timeoutMs
    let last
    while (Date.now() < deadline) {
        last = await getStatusByName({apiKey, baseUrl, fetchImpl, name})
        if (last.status === 'Finished') {
            return {triggered: trigger, finalStatus: 'Finished', data: last.data || {}}
        }
        await sleep(pollMs)
    }
    throw new Error(`run of "${name}" did not finish within ${timeoutMs}ms (last status: ${last && last.status})`)
}

/** Parse the `password` query param out of a VNC URL. Returns null if absent. */
function parseVncPassword(vncUrl) {
    if (typeof vncUrl !== 'string') return null
    const m = /[?&]password=([^&]+)/.exec(vncUrl)
    return m ? decodeURIComponent(m[1]) : null
}

function defaultSleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function parseOrThrow(res, opName) {
    let json
    try {
        json = await res.json()
    } catch (_) {
        throw new Error(`${opName} failed (HTTP ${res.status}) — non-JSON response body`)
    }
    if (!res.ok) {
        const msg = json && (json.message || json.status) ? (json.message || json.status) : JSON.stringify(json)
        throw new Error(`${opName} failed (HTTP ${res.status}) — ${msg}`)
    }
    return json
}

module.exports = {listAutomations, triggerByName, getStatusByName, runAndWaitByName, parseVncPassword}

// ---- CLI ----
if (require.main === module) {
    const args = process.argv.slice(2)
    const cmd = args[0]
    const apiKey = process.env.AXIOM_API_KEY
    const baseUrl = process.env.AXIOM_LAR_URL || DEFAULT_BASE_URL

    if (!cmd || cmd === '-h' || cmd === '--help') {
        usage()
        process.exit(cmd ? 0 : 2)
    }
    if (!apiKey) {
        console.error('AXIOM_API_KEY env var is required')
        process.exit(2)
    }

    function flag(name) {
        const i = args.indexOf(`--${name}`)
        return i >= 0 && i + 1 < args.length ? args[i + 1] : null
    }

    const fns = {
        list:    () => listAutomations({apiKey, baseUrl}),
        trigger: () => triggerByName({apiKey, baseUrl, name: flag('name')}),
        status:  () => getStatusByName({apiKey, baseUrl, name: flag('name')}),
        wait:    () => runAndWaitByName({
            apiKey, baseUrl, name: flag('name'),
            timeoutMs: (Number(flag('timeout')) || 300) * 1000,
            pollMs: (Number(flag('poll')) || 5) * 1000
        })
    }

    const fn = fns[cmd]
    if (!fn) {
        console.error(`unknown subcommand: ${cmd}`)
        usage()
        process.exit(2)
    }

    fn()
        .then(result => {
            console.log(JSON.stringify(result, null, 2))
            process.exit(0)
        })
        .catch(err => {
            console.error(`FAIL  ${err.message}`)
            process.exit(1)
        })
}

function usage() {
    console.log(`run-axiom.js — drive an axiom run via the existing REST surface

Usage:
  AXIOM_API_KEY=... node run-axiom.js list
  AXIOM_API_KEY=... node run-axiom.js trigger --name "<axiom name>"
  AXIOM_API_KEY=... node run-axiom.js status  --name "<axiom name>"
  AXIOM_API_KEY=... node run-axiom.js wait    --name "<axiom name>" [--timeout 300] [--poll 5]

Notes:
  - 'status' is binary (Running/Finished); failures are indistinguishable from success.
  - 'wait' returns when ANY run of the name finishes — not necessarily the one this call started.
  - There is no 'cancel' subcommand; the existing /v4/stop endpoint requires pod
    credentials we can't reliably recover. Cancel via the Axiom dashboard.

Env:
  AXIOM_API_KEY   long-lived API token (the X-API-KEY auth used by /v4/trigger).
  AXIOM_LAR_URL   base URL, default https://lar.axiom.ai
`)
}
