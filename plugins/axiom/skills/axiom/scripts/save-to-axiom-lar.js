#!/usr/bin/env node
/**
 * save-to-axiom-lar.js
 *
 * POST a validated AutomationTemplate to /api/v4/automation on lar.axiom.ai.
 * Refuses to send if the template doesn't validate against the local schema.
 *
 *   AXIOM_API_KEY=axm_... node save-to-axiom-lar.js path/to/axiom.json
 *
 * Env:
 *   AXIOM_API_KEY   required — long-lived API token (same as /v4/trigger uses)
 *   AXIOM_LAR_URL   optional — base URL, defaults to https://lar.axiom.ai
 *
 * Also exported so the test suite can drive it without spawning a process.
 */

const {readFileSync, existsSync} = require('node:fs')
const {validateAutomationTemplate} = require('./validate-no-code.js')

const DEFAULT_BASE_URL = 'https://lar.axiom.ai'

/**
 * Build the POST body the /v4/automation endpoint accepts from an AutomationTemplate.
 * Pulled out so tests can assert on the wire shape without making an HTTP call.
 *
 * @param {object} template — a (validated) AutomationTemplate object
 * @returns {object} the request body
 */
function buildRequestBody(template) {
    const body = {
        name: template.name,
        data: template.data,
        triggers: template.triggers || [],
        stored_cookies: template.stored_cookies || []
    }
    if (typeof template.id === 'number' && template.id > 0) {
        body.id = template.id
    }
    return body
}

/**
 * Save a template via the REST endpoint.
 *
 * @param {object} opts
 * @param {object} opts.template      The validated AutomationTemplate object
 * @param {string} opts.apiKey        Long-lived API token
 * @param {string} [opts.baseUrl]     Default https://lar.axiom.ai
 * @param {function} [opts.fetchImpl] Override fetch (used by tests)
 * @returns {Promise<{id: number, name: string, [k: string]: any}>} the `data` block from the success response
 */
async function saveAutomation(opts) {
    const {template, apiKey, baseUrl = DEFAULT_BASE_URL, fetchImpl = fetch} = opts

    if (!apiKey) throw new Error('apiKey is required')
    if (!template || typeof template !== 'object') throw new Error('template must be an object')

    // Refuse to send invalid JSON. The server has its own validation but we save the round-trip.
    const result = validateAutomationTemplate(template)
    if (!result.valid) {
        const summary = result.errors.slice(0, 3)
            .map(e => `${e.path} [${e.keyword}] ${e.message}`)
            .join('; ')
        throw new Error(`template failed schema validation — ${summary}`)
    }

    const url = `${baseUrl.replace(/\/$/, '')}/api/v4/automation`
    const res = await fetchImpl(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-API-KEY': apiKey
        },
        body: JSON.stringify(buildRequestBody(template))
    })

    let json
    try {
        json = await res.json()
    } catch (e) {
        throw new Error(`save failed (HTTP ${res.status}) — non-JSON response body`)
    }

    if (!res.ok) {
        const msg = json && json.message ? json.message : JSON.stringify(json)
        throw new Error(`save failed (HTTP ${res.status}) — ${msg}`)
    }
    if (!json || json.status !== 'success') {
        throw new Error(`save failed — unexpected response shape: ${JSON.stringify(json)}`)
    }
    return json.data
}

module.exports = {saveAutomation, buildRequestBody}

// CLI mode
if (require.main === module) {
    const file = process.argv[2]
    const apiKey = process.env.AXIOM_API_KEY
    const baseUrl = process.env.AXIOM_LAR_URL || DEFAULT_BASE_URL

    if (!apiKey) {
        console.error('AXIOM_API_KEY required')
        process.exit(2)
    }
    if (!file) {
        console.error('usage: AXIOM_API_KEY=... save-to-axiom-lar.js <path-to-axiom.json>')
        process.exit(2)
    }
    if (!existsSync(file)) {
        console.error(`file not found: ${file}`)
        process.exit(2)
    }

    let template
    try {
        template = JSON.parse(readFileSync(file, 'utf8'))
    } catch (e) {
        console.error(`could not parse JSON in ${file}: ${e.message}`)
        process.exit(1)
    }

    saveAutomation({template, apiKey, baseUrl})
        .then(data => {
            console.log(`saved: id=${data.id} name=${JSON.stringify(data.name)}`)
            process.exit(0)
        })
        .catch(err => {
            console.error(`FAIL  ${err.message}`)
            process.exit(1)
        })
}
