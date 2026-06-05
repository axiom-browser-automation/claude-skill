#!/usr/bin/env node
/**
 * save-automation.js
 *
 * Saves a built AutomationTemplate JSON to the user's Axiom account by POSTing
 * to /api/v4/automation. Mirrors the X-API-KEY auth + AXIOM_LAR_URL conventions
 * already used by run-axiom.js. Skill calls this from BuildNoCodeWorkflow's
 * post-build step instead of telling the user to import via the Chrome extension.
 *
 *   POST /api/v4/automation
 *     headers: X-API-KEY, Content-Type
 *     body: {name, data, triggers, stored_cookies, ...}    // 1:1 with the AutomationTemplate
 *
 *   AXIOM_API_KEY=axm_... node save-automation.js --artifact /path/to/automation.json
 *
 * Function-level: `saveAutomation()` returns a tagged result rather than throwing,
 * so the workflow can fall back to the manual-import flow on failure without a
 * try/catch dance. CLI mirrors that — exit 0 only on `{ok: true}`.
 */

const fs = require('fs')

const DEFAULT_BASE_URL = 'https://lar.axiom.ai'

/**
 * Save (create) an AutomationTemplate against the user's account.
 *
 * @param {object} opts
 * @param {string} opts.apiKey      — AXIOM_API_KEY value
 * @param {object} opts.template    — parsed AutomationTemplate JSON
 * @param {string} [opts.baseUrl]   — defaults to https://lar.axiom.ai
 * @param {function} [opts.fetchImpl] — for tests
 * @returns {Promise<{ok: true, name: string, id: number, response: object} | {ok: false, error: string, status?: number, raw?: any}>}
 */
async function saveAutomation(opts) {
    const {apiKey, baseUrl = DEFAULT_BASE_URL, fetchImpl = fetch, template} = opts
    if (!apiKey) return {ok: false, error: 'AXIOM_API_KEY is required'}
    if (!template || typeof template !== 'object') return {ok: false, error: 'template is required'}
    if (!template.name) return {ok: false, error: 'template.name is required'}

    const body = {
        name:           template.name,
        data:           template.data || {},
        triggers:       Array.isArray(template.triggers) ? template.triggers : [],
        stored_cookies: Array.isArray(template.stored_cookies) ? template.stored_cookies : [],
    }
    if (template.organization_id !== undefined) body.organization_id = template.organization_id
    if (template.type !== undefined)            body.type            = template.type
    if (template.status !== undefined)          body.status          = template.status
    if (template.color !== undefined)           body.color           = template.color
    if (template.favourite !== undefined)       body.favourite       = template.favourite

    let res
    try {
        res = await fetchImpl(`${baseUrl.replace(/\/$/, '')}/api/v4/automation`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'X-API-KEY': apiKey},
            body: JSON.stringify(body)
        })
    } catch (err) {
        return {ok: false, error: `couldn't reach Axiom (${err.message})`}
    }

    let json
    try {
        json = await res.json()
    } catch (_) {
        return {ok: false, error: `non-JSON response from server (HTTP ${res.status})`, status: res.status}
    }

    if (res.status === 401) return {ok: false, error: 'API key invalid or expired', status: 401, raw: json}
    if (res.status === 403) return {ok: false, error: json.message || 'forbidden (Pro subscription required for API access)', status: 403, raw: json}
    if (res.status === 404) return {ok: false, error: 'endpoint not deployed on this LAR yet', status: 404, raw: json}
    if (!res.ok)            return {ok: false, error: json.message || `HTTP ${res.status}`, status: res.status, raw: json}

    if (json.status !== 'success' || !json.data || typeof json.data.id !== 'number') {
        return {ok: false, error: `unexpected response shape: ${JSON.stringify(json)}`, status: res.status, raw: json}
    }

    return {ok: true, name: json.data.name, id: json.data.id, response: json.data}
}

function readTemplate(artifactPath) {
    let raw
    try {
        raw = fs.readFileSync(artifactPath, 'utf8')
    } catch (err) {
        return {ok: false, error: `couldn't read ${artifactPath}: ${err.message}`}
    }
    let template
    try {
        template = JSON.parse(raw)
    } catch (err) {
        return {ok: false, error: `couldn't parse ${artifactPath} as JSON: ${err.message}`}
    }
    return {ok: true, template}
}

module.exports = {saveAutomation, readTemplate}

// ---- CLI ----
if (require.main === module) {
    const args = process.argv.slice(2)
    if (args.includes('-h') || args.includes('--help') || args.length === 0) {
        usage()
        process.exit(args.length === 0 ? 2 : 0)
    }

    const flagIdx = args.indexOf('--artifact')
    const artifactPath = flagIdx >= 0 && flagIdx + 1 < args.length ? args[flagIdx + 1] : null
    if (!artifactPath) {
        console.error('--artifact <path> is required')
        usage()
        process.exit(2)
    }

    const apiKey = process.env.AXIOM_API_KEY
    const baseUrl = process.env.AXIOM_LAR_URL || DEFAULT_BASE_URL
    if (!apiKey) {
        console.log(JSON.stringify({ok: false, error: 'AXIOM_API_KEY env var is required'}))
        process.exit(1)
    }

    const read = readTemplate(artifactPath)
    if (!read.ok) {
        console.log(JSON.stringify(read))
        process.exit(1)
    }

    saveAutomation({apiKey, baseUrl, template: read.template})
        .then(result => {
            console.log(JSON.stringify(result))
            process.exit(result.ok ? 0 : 1)
        })
        .catch(err => {
            console.log(JSON.stringify({ok: false, error: `unexpected: ${err.message}`}))
            process.exit(1)
        })
}

function usage() {
    console.log(`save-automation.js — POST a built AutomationTemplate to the user's Axiom account

Usage:
  AXIOM_API_KEY=... node save-automation.js --artifact /path/to/automation.json

Output (stdout, single-line JSON; exit code 0 only on ok):
  {"ok": true,  "name": "My Axiom", "id": 24210}
  {"ok": false, "error": "API key invalid", "status": 401}

Env:
  AXIOM_API_KEY   long-lived API token (same X-API-KEY auth as /v4/trigger).
  AXIOM_LAR_URL   base URL, default https://lar.axiom.ai
`)
}
