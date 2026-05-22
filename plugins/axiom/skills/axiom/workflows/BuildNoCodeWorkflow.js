/**
 * BuildNoCodeWorkflow — emit a no-code AutomationTemplate JSON and validate it.
 *
 * The skill writes a JSON file on disk; the user imports it into their Axiom
 * account themselves via the in-app import flow. No HTTP, no API key, no
 * network failure modes — the path on disk is the contract.
 */

const {validateAutomationTemplate} = require('../scripts/validate-no-code.js')
const fs = require('fs')
const path = require('path')

const IMPORT_DOCS_URL = 'https://axiom.ai/docs/no-code-tool/reference/settings/import-export/sharing'

class BuildNoCodeWorkflow {
    static key = 'build_no_code'
    static description = 'Emit a no-code AutomationTemplate JSON. User imports it into the Axiom Chrome extension via the in-app import flow.'

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
     * @param {string} input.opts.artifactPath  path to the JSON Claude has written
     * @returns {Promise<import('./types').WorkflowResult>}
     */
    static async invoke(input) {
        const start = Date.now()
        const opts = input.opts || {}

        if (!opts.artifactPath) {
            return {
                response: {message: 'No artifact path provided. Claude should write the AutomationTemplate JSON to a file and pass it as opts.artifactPath.'},
                debug: {route: BuildNoCodeWorkflow.key, error: 'missing_artifact_path'}
            }
        }

        const absPath = path.resolve(opts.artifactPath)
        const template = JSON.parse(fs.readFileSync(absPath, 'utf8'))

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

        return {
            response: {
                message: [
                    `Validated and written to ${absPath}.`,
                    '',
                    'To use it in your Axiom account:',
                    '  1. Open the Chrome extension\'s builder.',
                    '  2. Click the Cog icon in the left toolbar.',
                    '  3. Open "Import or download" → click "Select file" → pick the JSON above.',
                    '  4. Save the automation.',
                    '',
                    `Full docs: ${IMPORT_DOCS_URL}`
                ].join('\n'),
                artifacts: [absPath],
                data: {artifactPath: absPath, importDocsUrl: IMPORT_DOCS_URL},
                nextSteps: [
                    `Import the JSON via the Chrome extension — see ${IMPORT_DOCS_URL}`,
                    'If the extension isn\'t installed yet, invoke HandoffToExtensionWorkflow for install guidance'
                ]
            },
            debug: {route: BuildNoCodeWorkflow.key, durationMs: Date.now() - start}
        }
    }
}

module.exports = {BuildNoCodeWorkflow, IMPORT_DOCS_URL}
