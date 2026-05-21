/**
 * IWorkflow contract for the skill's own workflows.
 *
 * Deliberately stripped-down for a single-turn skill: no hook bus, no return
 * stack, no multi-turn pending state, no side-effect executor. Claude reads
 * SKILL.md, picks a workflow, invokes it once. The workflow returns a result
 * and that's the end of the turn.
 *
 * @typedef {Object} WorkflowInput
 * @property {string} message  raw user prompt (used by getRoutes() matchers)
 * @property {Object} [env]    process.env equivalent; injected in tests so they don't read real env
 * @property {Function} [fetchImpl] dependency-injected fetch (defaults to global fetch)
 * @property {Object} [opts]   workflow-specific options (e.g. {email, password} for signup)
 *
 * @typedef {Object} RouteCondition
 * @property {string} key                            workflow key the match resolves to (= this.key)
 * @property {(message: string) => boolean} [match]  regex test against the user message
 * @property {string} [why]                          human-readable rationale for the match
 *
 * @typedef {Object} WorkflowResult
 * @property {{message: string, artifacts?: string[], nextSteps?: string[], data?: Object}} response
 * @property {{route: string, scriptExitCode?: number, durationMs?: number, [k: string]: any}} debug
 *
 * @typedef {Object} IWorkflow
 * @property {string} key
 * @property {string} description
 * @property {() => RouteCondition[]} getRoutes
 * @property {(input: WorkflowInput) => Promise<WorkflowResult>} invoke
 */

module.exports = {} // contract is documentation-only; no exports
