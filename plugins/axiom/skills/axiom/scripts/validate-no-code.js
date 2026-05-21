#!/usr/bin/env node
/**
 * validate-no-code.js
 *
 * Read an AutomationTemplate JSON file, validate it against the vendored schema,
 * and exit 0 (valid) or 1 (invalid). On failure, prints AJV errors in a Claude-readable form.
 *
 *   node validate-no-code.js path/to/axiom.json
 *
 * Also exported as a function so the test suite can reuse it.
 */

const {readFileSync, existsSync} = require('node:fs')
const {resolve} = require('node:path')
const Ajv = require('ajv')

const SCHEMA_PATH = resolve(__dirname, '..', 'references', 'automation-template-schema.json')

const schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'))
// Strip our metadata fields before compiling. The schema's `additionalProperties: false` would
// reject `_sourceCommit` and friends at the top level.
const cleanSchema = {...schema}
delete cleanSchema._sourceCommit
delete cleanSchema._sourceFile

const ajv = new Ajv({allErrors: true, strict: false})
const validate = ajv.compile(cleanSchema)

/**
 * @param {any} candidate
 * @returns {{valid: boolean, errors: Array<{path: string, message: string, keyword: string, params: any}>}}
 */
function validateAutomationTemplate(candidate) {
    const valid = validate(candidate)
    if (valid) return {valid: true, errors: []}
    const errors = (validate.errors || []).map(e => ({
        path: e.instancePath || '<root>',
        message: e.message || '',
        keyword: e.keyword,
        params: e.params
    }))
    return {valid: false, errors}
}

module.exports = {validateAutomationTemplate}

// CLI mode
if (require.main === module) {
    const file = process.argv[2]
    if (!file) {
        console.error('usage: validate-no-code.js <path-to-automation-template.json>')
        process.exit(2)
    }
    if (!existsSync(file)) {
        console.error(`file not found: ${file}`)
        process.exit(2)
    }
    let candidate
    try {
        candidate = JSON.parse(readFileSync(file, 'utf8'))
    } catch (e) {
        console.error(`could not parse JSON in ${file}: ${e.message}`)
        process.exit(1)
    }
    const result = validateAutomationTemplate(candidate)
    if (result.valid) {
        console.log(`OK  ${file} — valid AutomationTemplate`)
        process.exit(0)
    } else {
        console.error(`FAIL  ${file}`)
        for (const err of result.errors) {
            console.error(`  ${err.path}  [${err.keyword}]  ${err.message}  ${JSON.stringify(err.params)}`)
        }
        process.exit(1)
    }
}
