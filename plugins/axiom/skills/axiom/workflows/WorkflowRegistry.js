/**
 * WorkflowRegistry — the canonical list of skill workflows, in routing order.
 *
 * Order matters: `signup` first so "I don't have a key" doesn't fall through to
 * a build flow. Routing scans this list and the first workflow whose
 * `getRoutes()` returns a `match()` matching the user's message wins.
 *
 * Single-turn dispatch primitive lives in index.js — no hook bus, no return stack.
 */

const {SignupWorkflow} = require('./SignupWorkflow')
const {BuildNoCodeWorkflow} = require('./BuildNoCodeWorkflow')
const {BuildCodedWorkflow} = require('./BuildCodedWorkflow')
const {RunAutomationWorkflow} = require('./RunAutomationWorkflow')
const {HandoffToExtensionWorkflow} = require('./HandoffToExtensionWorkflow')

const WORKFLOWS = [
    SignupWorkflow,
    BuildNoCodeWorkflow,
    BuildCodedWorkflow,
    RunAutomationWorkflow,
    HandoffToExtensionWorkflow
]

function list() {
    return WORKFLOWS.map(W => ({
        key: W.key,
        description: W.description,
        routes: W.getRoutes()
    }))
}

function byKey(key) {
    return WORKFLOWS.find(W => W.key === key) || null
}

/**
 * Find the first matching workflow for a user message.
 *
 * @param {string} message
 * @returns {{workflow: any, route: import('./types').RouteCondition} | null}
 */
function route(message) {
    for (const W of WORKFLOWS) {
        for (const r of W.getRoutes()) {
            if (r.match && r.match(message)) {
                return {workflow: W, route: r}
            }
        }
    }
    return null
}

module.exports = {WORKFLOWS, list, byKey, route}
