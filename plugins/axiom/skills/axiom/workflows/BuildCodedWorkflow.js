/**
 * BuildCodedWorkflow — emit an @axiom_ai/api Node script for the user to run.
 *
 * Like BuildNoCodeWorkflow, Claude composes the JS; this workflow runs the
 * AST validator over the written file and hands it back. There is no
 * server-side "save" — the user runs the script themselves.
 */

const {validateCodedScript} = require('../scripts/validate-coded.js')
const fs = require('fs')
const path = require('path')

class BuildCodedWorkflow {
    static key = 'build_coded'
    static description = 'Emit a Node script using @axiom_ai/api (the published step-function library). User runs it from their own code.'

    static getRoutes() {
        return [
            {
                key: BuildCodedWorkflow.key,
                match: (msg) => /node script|@axiom[_\s]?ai\/api|from my ci|in my repo|typescript|javascript file|standalone script/i.test(msg),
                why: 'mentions node script / typescript / CI / library usage'
            }
        ]
    }

    /**
     * @param {import('./types').WorkflowInput} input
     * @param {string} input.opts.artifactPath  path to the .js file Claude has written
     */
    static async invoke(input) {
        const start = Date.now()
        const opts = input.opts || {}

        if (!opts.artifactPath) {
            return {
                response: {message: 'No artifact path provided. Claude should write the script to a .js file and pass it as opts.artifactPath.'},
                debug: {route: BuildCodedWorkflow.key, error: 'missing_artifact_path'}
            }
        }

        const absPath = path.resolve(opts.artifactPath)
        const source = fs.readFileSync(absPath, 'utf8')
        const validation = validateCodedScript(source)

        if (!validation.valid) {
            return {
                response: {
                    message: `Validation failed for ${absPath}: ${validation.errors.length} error(s). Fix and re-invoke.`,
                    artifacts: [absPath],
                    data: {errors: validation.errors}
                },
                debug: {route: BuildCodedWorkflow.key, durationMs: Date.now() - start, validationFailed: true}
            }
        }

        return {
            response: {
                message: `Coded artifact valid at ${absPath}. To run: \`npm install @axiom_ai/api && AXIOM_API_KEY=... node ${path.basename(absPath)}\`.`,
                artifacts: [absPath],
                nextSteps: [
                    'Hand the path back to the user with run instructions',
                    'No server-side save — coded artifacts live in the user\'s repo'
                ]
            },
            debug: {route: BuildCodedWorkflow.key, durationMs: Date.now() - start}
        }
    }
}

module.exports = {BuildCodedWorkflow}
