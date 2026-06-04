/**
 * BuildNoCodeWorkflow — produce a validated no-code AutomationTemplate JSON.
 *
 * The workflow is the single entry point for the no-code path. It takes a
 * high-level intent ({machineName, values} per step) and runs the full
 * pipeline internally:
 *
 *   1. buildAxiom(intent)            — clone canonical shape from widgetActionList
 *   2. validateAutomationTemplate(.) — structural + schema check
 *   3. writeFileSync(outputPath, .)  — persist to disk
 *
 * Hand-composing AutomationTemplate JSON is structurally unsafe (every step
 * needs original_name + the widget's full param list with declared types,
 * and missing fields render as `undefined: …` in the Chrome extension). The
 * helper is therefore in-path, not optional. The legacy `opts.artifactPath`
 * input is preserved as a validate-only escape hatch for re-running checks
 * on files Claude has already written.
 */

const {validateAutomationTemplate} = require('../scripts/validate-no-code.js')
const {buildAxiom} = require('../scripts/build-axiom.js')
const fs = require('fs')
const path = require('path')
const os = require('os')

const IMPORT_DOCS_URL = 'https://axiom.ai/docs/no-code-tool/reference/settings/import-export/sharing'

class BuildNoCodeWorkflow {
    static key = 'build_no_code'
    static description = 'Produce a no-code AutomationTemplate JSON from an intent (machineName + value overrides per step). Builds via the canonical helper, validates, writes to disk.'

    static getRoutes() {
        return [
            {
                key: BuildNoCodeWorkflow.key,
                match: (msg) => /save\b.*\b(to|in)\s+my\s+account|in my dashboard|schedule|every day|every hour|no.?code|automation template/i.test(msg),
                why: 'mentions dashboard / scheduling / no-code'
            }
        ]
    }

    /**
     * Two invocation shapes:
     *
     *   build from intent (PRIMARY PATH):
     *     opts: {intent: {name, contextUrl, steps, ...}, outputPath: string}
     *     → calls buildAxiom(intent), validates, writes outputPath, returns
     *       the path + the 4-step import flow.
     *
     *   validate-only (escape hatch):
     *     opts: {artifactPath: string}
     *     → reads + validates an existing JSON. Use when re-checking a file
     *       Claude has already written. Does NOT bypass the structural check —
     *       hand-composed JSON will still fail.
     */
    static async invoke(input) {
        const start = Date.now()
        const opts = input.opts || {}

        if (opts.intent !== undefined) {
            return BuildNoCodeWorkflow.#buildFromIntent(opts, start)
        }
        if (opts.artifactPath) {
            return BuildNoCodeWorkflow.#validateExisting(opts, start)
        }
        return {
            response: {
                message: 'Provide either opts.intent (preferred — name + steps; the workflow builds and validates) or opts.artifactPath (validate an existing JSON file).'
            },
            debug: {route: BuildNoCodeWorkflow.key, error: 'missing_input'}
        }
    }

    static #buildFromIntent(opts, start) {
        const {intent, outputPath} = opts
        if (!outputPath) {
            return {
                response: {
                    message: 'opts.outputPath is required when building from an intent. Suggest ~/Downloads/axiom-<short-name>.json — that\'s where the Chrome extension import dialog opens by default.'
                },
                debug: {route: BuildNoCodeWorkflow.key, error: 'missing_output_path'}
            }
        }

        const absOutput = expandTilde(outputPath)
        let axiom
        try {
            axiom = buildAxiom(intent)
        } catch (err) {
            return {
                response: {
                    message: `build-axiom failed: ${err.message}`,
                    nextSteps: ['Check the intent\'s machineNames against references/action-vocabulary.json\'s widgetActionList', 'Check each step\'s `values` keys are the exact param names (case-sensitive)', 'For token-typed params (bot_token, token, merge_token, …) use `tokenRefs: {paramName: "upstreamTokenName"}` — not `values`']
                },
                debug: {route: BuildNoCodeWorkflow.key, error: err.message, phase: 'build'}
            }
        }

        const validation = validateAutomationTemplate(axiom)
        if (!validation.valid) {
            // The helper should produce canonical shape, so this would indicate
            // a bug in the helper or the vocabulary. Surface clearly.
            return {
                response: {
                    message: `INTERNAL: helper output failed validation. This shouldn't happen — report it. ${validation.errors.length} error(s).`,
                    data: {errors: validation.errors}
                },
                debug: {route: BuildNoCodeWorkflow.key, error: 'helper_output_invalid', phase: 'validate', durationMs: Date.now() - start}
            }
        }

        try {
            fs.mkdirSync(path.dirname(absOutput), {recursive: true})
            fs.writeFileSync(absOutput, JSON.stringify(axiom, null, 2) + '\n')
        } catch (err) {
            return {
                response: {message: `couldn't write to ${absOutput}: ${err.message}`},
                debug: {route: BuildNoCodeWorkflow.key, error: err.message, phase: 'write'}
            }
        }

        return {
            response: {
                message: importMessage(absOutput),
                artifacts: [absOutput],
                data: {artifactPath: absOutput, importDocsUrl: IMPORT_DOCS_URL},
                nextSteps: [
                    `Import via the Chrome extension — see ${IMPORT_DOCS_URL}`,
                    'If the extension isn\'t installed yet, invoke HandoffToExtensionWorkflow for install guidance'
                ]
            },
            debug: {route: BuildNoCodeWorkflow.key, durationMs: Date.now() - start, phase: 'built'}
        }
    }

    static #validateExisting(opts, start) {
        const absPath = expandTilde(opts.artifactPath)
        let template
        try {
            template = JSON.parse(fs.readFileSync(absPath, 'utf8'))
        } catch (err) {
            return {
                response: {message: `couldn't read or parse ${absPath}: ${err.message}`},
                debug: {route: BuildNoCodeWorkflow.key, error: err.message, phase: 'read'}
            }
        }

        const validation = validateAutomationTemplate(template)
        if (!validation.valid) {
            return {
                response: {
                    message: `Validation failed for ${absPath}: ${validation.errors.length} error(s). The file looks hand-composed — recompose via opts.intent to let the helper produce the canonical shape, or fix the listed errors by hand.`,
                    artifacts: [absPath],
                    data: {errors: validation.errors}
                },
                debug: {route: BuildNoCodeWorkflow.key, durationMs: Date.now() - start, validationFailed: true, phase: 'validate'}
            }
        }

        return {
            response: {
                message: importMessage(absPath),
                artifacts: [absPath],
                data: {artifactPath: absPath, importDocsUrl: IMPORT_DOCS_URL},
                nextSteps: [
                    `Import via the Chrome extension — see ${IMPORT_DOCS_URL}`,
                    'If the extension isn\'t installed yet, invoke HandoffToExtensionWorkflow for install guidance'
                ]
            },
            debug: {route: BuildNoCodeWorkflow.key, durationMs: Date.now() - start, phase: 'validated-existing'}
        }
    }
}

function expandTilde(p) {
    if (typeof p !== 'string') return p
    if (p === '~' || p.startsWith('~/')) return path.join(os.homedir(), p.slice(2))
    return p
}

function importMessage(absPath) {
    return [
        `Validated and written to ${absPath}.`,
        '',
        'To use it in your Axiom account:',
        '  1. Open the Chrome extension\'s builder.',
        '  2. Click the Cog icon in the left toolbar.',
        '  3. Open "Import or download" → click "Select file" → pick the JSON above.',
        '  4. Save the automation.',
        '',
        `Full docs: ${IMPORT_DOCS_URL}`
    ].join('\n')
}

module.exports = {BuildNoCodeWorkflow, IMPORT_DOCS_URL}
