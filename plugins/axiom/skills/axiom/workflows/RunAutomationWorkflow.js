/**
 * RunAutomationWorkflow — trigger a saved axiom by name, poll status, surface results.
 *
 * Wraps scripts/run-axiom.js (which talks to the existing /v3/v4 endpoints).
 * Modes (via opts.mode, default 'wait'):
 *   'list'     enumerate the user's axiom names
 *   'trigger'  fire-and-forget — return VNC URL + parsed pod password
 *   'status'   poll status for an axiom name (binary Running/Finished — see caveats)
 *   'wait'     trigger + poll until status='Finished' (see caveats)
 *
 * Caveats inherited from the underlying endpoints:
 *   - No run identity. "Status: Finished" means "no pod is running this name"
 *     — concurrent runs of the same axiom can't be told apart.
 *   - Status is binary. A failed run looks identical to a successful one.
 *   - Only Google-Sheets-widget output is recoverable via the status endpoint;
 *     other scraped data isn't surfaced.
 *   - No cancel mode. Cancel via the dashboard.
 */

const {listAutomations, triggerByName, getStatusByName, runAndWaitByName} = require('../scripts/run-axiom.js')

class RunAutomationWorkflow {
    static key = 'run_automation'
    static description = 'Trigger a saved axiom by name, poll status, surface results when finished.'

    static getRoutes() {
        return [
            {
                key: RunAutomationWorkflow.key,
                match: (msg) => /run\s+(my|the)\s+\w+|trigger\s+(my|the)\s+\w+|kick off|fire (off|the)|execute the|start the (axiom|automation|bot)/i.test(msg),
                why: 'mentions running / triggering an existing axiom'
            }
        ]
    }

    /**
     * @param {import('./types').WorkflowInput} input
     * @param {string} [input.opts.mode]      one of 'list' | 'trigger' | 'status' | 'wait' (default 'wait')
     * @param {string} [input.opts.name]      axiom name (trigger / status / wait)
     * @param {Array}  [input.opts.data]      input variables forwarded to the trigger
     * @param {Object} [input.opts.apiKeys]   per-widget API keys (e.g. {openAI: ...}) forwarded to the trigger
     * @param {number} [input.opts.timeoutMs] wait-mode timeout, default 300_000ms
     * @param {number} [input.opts.pollMs]    wait-mode poll interval, default 5_000ms
     */
    static async invoke(input) {
        const start = Date.now()
        const opts = input.opts || {}
        const env = input.env || process.env
        const apiKey = opts.apiKey || env.AXIOM_API_KEY
        const baseUrl = env.AXIOM_LAR_URL
        const fetchImpl = input.fetchImpl

        if (!apiKey) {
            return {
                response: {message: 'AXIOM_API_KEY is required. Run SignupWorkflow first.', nextSteps: ['Invoke SignupWorkflow']},
                debug: {route: RunAutomationWorkflow.key, error: 'missing_api_key'}
            }
        }

        const mode = opts.mode || 'wait'
        let result
        try {
            switch (mode) {
                case 'list':
                    result = await listAutomations({apiKey, baseUrl, fetchImpl})
                    return {
                        response: {message: `${result.length} axiom(s) on this account: ${result.join(', ') || '(none)'}`, data: {names: result}},
                        debug: {route: RunAutomationWorkflow.key, mode, durationMs: Date.now() - start}
                    }
                case 'trigger':
                    result = await triggerByName({apiKey, baseUrl, fetchImpl, name: opts.name, data: opts.data, apiKeys: opts.apiKeys})
                    break
                case 'status':
                    result = await getStatusByName({apiKey, baseUrl, fetchImpl, name: opts.name})
                    break
                case 'wait':
                    result = await runAndWaitByName({
                        apiKey, baseUrl, fetchImpl,
                        name: opts.name, data: opts.data, apiKeys: opts.apiKeys,
                        timeoutMs: opts.timeoutMs, pollMs: opts.pollMs, sleep: opts.sleep
                    })
                    break
                default:
                    throw new Error(`unknown mode: ${mode}`)
            }
        } catch (err) {
            return {
                response: {message: `run-automation ${mode} failed: ${err.message}`},
                debug: {route: RunAutomationWorkflow.key, mode, error: err.message, durationMs: Date.now() - start}
            }
        }

        return {
            response: {
                message: describeResult(mode, opts.name, result),
                data: result,
                nextSteps: nextStepsFor(mode)
            },
            debug: {route: RunAutomationWorkflow.key, mode, durationMs: Date.now() - start}
        }
    }
}

function describeResult(mode, name, r) {
    if (mode === 'trigger') {
        if (r.queued) return `"${name}" queued (no pod available right now): ${r.message}`
        return `Triggered "${name}". Watch it run at ${r.vncUrl}.`
    }
    if (mode === 'status') return `"${name}" status=${r.status}. ${r.status === 'Finished' ? 'No pod is currently running it (failure indistinguishable from success).' : ''}`
    if (mode === 'wait')   return `"${name}" finalStatus=${r.finalStatus}${r.data && Object.keys(r.data).length ? ` (with ${Object.keys(r.data).length} sheet output(s))` : ''}.`
    return JSON.stringify(r)
}

function nextStepsFor(mode) {
    if (mode === 'trigger') return ['Open the VNC URL to watch', 'Poll with mode="status" for completion (binary — see caveats)']
    if (mode === 'wait')    return ['Inspect data.* for Google-Sheets output (other output not surfaced)']
    return []
}

module.exports = {RunAutomationWorkflow}
