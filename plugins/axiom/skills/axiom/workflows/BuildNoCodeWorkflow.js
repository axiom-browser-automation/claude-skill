/**
 * BuildNoCodeWorkflow — emit a no-code AutomationTemplate JSON, validate, save.
 *
 * The actual JSON generation is Claude's job (it composes the artifact from the
 * action vocabulary and example IRs). This workflow's invoke() runs the
 * validator + save helper over an already-written artifact.
 */

const {validateAutomationTemplate} = require('../scripts/validate-no-code.js')
const {saveAutomation} = require('../scripts/save-to-axiom-lar.js')
const fs = require('fs')
const path = require('path')

class BuildNoCodeWorkflow {
    static key = 'build_no_code'
    static description = 'Emit a no-code AutomationTemplate JSON (saved to the user\'s Axiom account, runs in the dashboard, schedulable).'

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
     * @param {import('./types').WorkflowInput} input
     * @param {string} [input.opts.artifactPath]  path to the JSON Claude has written
     * @param {boolean} [input.opts.save]         actually save (true) or validate-only (false)
     * @returns {Promise<import('./types').WorkflowResult>}
     */
    static async invoke(input) {
        const start = Date.now()
        const opts = input.opts || {}
        const env = input.env || process.env

        if (!opts.artifactPath) {
            return {
                response: {message: 'No artifact path provided. Claude should write the AutomationTemplate JSON to a file and pass it as opts.artifactPath.'},
                debug: {route: BuildNoCodeWorkflow.key, error: 'missing_artifact_path'}
            }
        }

        const absPath = path.resolve(opts.artifactPath)
        const template = JSON.parse(fs.readFileSync(absPath, 'utf8'))

        // Step 1 — validate
        const validation = validateAutomationTemplate(template)
        if (!validation.valid) {
            return {
                response: {
                    message: `Validation failed for ${absPath}: ${validation.errors.length} error(s). Fix and re-invoke.`,
                    artifacts: [absPath],
                    data: {errors: validation.errors}
                },
                debug: {route: BuildNoCodeWorkflow.key, durationMs: Date.now() - start, validationFailed: true}
            }
        }

        // Step 2 — save (unless validate-only)
        if (opts.save === false) {
            return {
                response: {
                    message: `Validation passed for ${absPath}. Skipped save (validate-only mode).`,
                    artifacts: [absPath],
                    nextSteps: ['Set save: true on the next invocation to persist to the user\'s account']
                },
                debug: {route: BuildNoCodeWorkflow.key, durationMs: Date.now() - start}
            }
        }

        const apiKey = opts.apiKey || env.AXIOM_API_KEY
        if (!apiKey) {
            return {
                response: {
                    message: 'AXIOM_API_KEY is required to save. Run the signup workflow first.',
                    nextSteps: ['Invoke SignupWorkflow to obtain a key']
                },
                debug: {route: BuildNoCodeWorkflow.key, error: 'missing_api_key'}
            }
        }

        const saveResult = await saveAutomation({
            template,
            apiKey,
            baseUrl: env.AXIOM_LAR_URL,
            fetchImpl: input.fetchImpl
        })

        return {
            response: {
                message: `Saved ${saveResult.name} (id=${saveResult.id}) to ${env.AXIOM_LAR_URL || 'https://lar.axiom.ai'}.`,
                artifacts: [absPath],
                data: saveResult,
                nextSteps: [
                    `Optionally hand off to the extension: HandoffToExtensionWorkflow.invoke({opts: {id: ${saveResult.id}}})`,
                    `Or trigger it: RunAutomationWorkflow.invoke({opts: {id: ${saveResult.id}}})`
                ]
            },
            debug: {route: BuildNoCodeWorkflow.key, durationMs: Date.now() - start, savedId: saveResult.id}
        }
    }
}

module.exports = {BuildNoCodeWorkflow}
