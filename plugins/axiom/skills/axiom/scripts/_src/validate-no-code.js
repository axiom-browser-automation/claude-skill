#!/usr/bin/env node
/**
 * validate-no-code.js
 *
 * Validate an AutomationTemplate JSON against (a) the vendored AJV schema
 * and (b) a stricter structural check that catches what the schema doesn't:
 * each step must declare every field the Chrome extension importer needs,
 * and its params must match the widget definition position-for-position.
 *
 * The schema alone is too permissive — its step item is `properties: {}`,
 * `required: []`, so a step with just `{machine_name, name, params: [one
 * truncated param]}` validates "OK" but renders as `undefined: <name>`
 * in the builder because the importer can't resolve the widget.
 *
 *   node validate-no-code.js path/to/axiom.json
 *
 * Also exported for the test suite + workflows.
 */

const {readFileSync, existsSync} = require('node:fs')
const {resolve} = require('node:path')
const Ajv = require('ajv')

const SCHEMA_PATH = resolve(__dirname, '..', 'references', 'automation-template-schema.json')
const VOCAB_PATH = resolve(__dirname, '..', 'references', 'action-vocabulary.json')

const schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'))
const cleanSchema = {...schema}
delete cleanSchema._sourceCommit
delete cleanSchema._sourceFile

// The vendored schema runs behind the widget vocabulary in two specific ways
// (verified by feeding canonical exports through both). Patch the schema in
// memory rather than diverging from the upstream source.
//
//   1) `$defs.param.properties.type.enum` doesn't list every type the live
//      widgets declare (e.g. `double_click`, `toggle` on WidgetDriverClick).
//      Widen the enum with the union of every type seen in widgetActionList.
//   2) `$defs.param.properties.help.items.type === "string"` rejects entries
//      that are objects of the form {name, linkSrc, linkText} — which several
//      widgets ship (e.g. WidgetDriverGoto's Store Cookie). Loosen to accept
//      either a string or an object.
function patchSchema(schema) {
    try {
        const vocab = JSON.parse(readFileSync(VOCAB_PATH, 'utf8'))
        const typesFromVocab = new Set()
        for (const w of vocab.widgetActionList || []) {
            for (const p of w.params || []) {
                if (p.type) typesFromVocab.add(p.type)
            }
        }
        if (schema.$defs && schema.$defs.param && schema.$defs.param.properties) {
            const typeProp = schema.$defs.param.properties.type
            if (typeProp && Array.isArray(typeProp.enum)) {
                typeProp.enum = [...new Set([...typeProp.enum, ...typesFromVocab])]
            }
            const helpProp = schema.$defs.param.properties.help
            if (helpProp && helpProp.items && helpProp.items.type === 'string') {
                helpProp.items = {type: ['string', 'object']}
            }
        }
    } catch (_) { /* best-effort; if patching fails, fall back to the raw schema */ }
    return schema
}

const ajv = new Ajv({allErrors: true, strict: false})
const validate = ajv.compile(patchSchema(cleanSchema))

let _vocabCache = null
function loadWidgetMap() {
    if (_vocabCache) return _vocabCache
    const v = JSON.parse(readFileSync(VOCAB_PATH, 'utf8'))
    _vocabCache = new Map((v.widgetActionList || []).map(w => [w.machineName, w]))
    return _vocabCache
}

// Step-level fields every importable step needs. Anything missing here makes
// the extension's widget resolver render the step as `undefined`.
const REQUIRED_STEP_FIELDS = ['machine_name', 'name', 'original_name', 'stepNumber', 'params']

/**
 * Structural check that runs after AJV passes. Catches the failure modes
 * the schema's loose step shape doesn't cover.
 *
 * @param {object} candidate
 * @returns {Array<{path, keyword, message, params: any}>}
 */
function structuralCheck(candidate) {
    const errors = []
    const form = candidate && candidate.data && candidate.data.form
    if (!Array.isArray(form)) return errors  // schema catches this separately

    let widgets
    try { widgets = loadWidgetMap() } catch (_) { return errors }

    form.forEach((step, i) => {
        const stepPath = `/data/form/${i}`

        // (1) Required step-level fields.
        for (const f of REQUIRED_STEP_FIELDS) {
            if (step[f] === undefined || step[f] === null || step[f] === '') {
                errors.push({
                    path: `${stepPath}/${f}`,
                    keyword: 'required',
                    message: `step is missing the "${f}" field — the Chrome extension importer iterates this list, so the step will render as "undefined" in the builder`,
                    params: {missingProperty: f}
                })
            }
        }

        // (2) machine_name must resolve to a known widget.
        if (!step.machine_name) return
        const widget = widgets.get(step.machine_name)
        if (!widget) {
            errors.push({
                path: `${stepPath}/machine_name`,
                keyword: 'enum',
                message: `unknown widget "${step.machine_name}" — not present in references/action-vocabulary.json's widgetActionList`,
                params: {value: step.machine_name}
            })
            return
        }

        // (3) original_name should match the widget's canonical name. (Allow it
        // to be present-but-wrong only if we're being lenient; flag mismatch.)
        if (step.original_name && step.original_name !== widget.name && step.original_name !== widget.originalName) {
            errors.push({
                path: `${stepPath}/original_name`,
                keyword: 'const',
                message: `original_name "${step.original_name}" doesn't match the widget's canonical name "${widget.name}"`,
                params: {expected: widget.name, actual: step.original_name}
            })
        }

        // (3.5) method, modes + index. The Chrome extension's runner dispatches
        // on step.method.{driver|browser} and orders steps by step.index. A step
        // missing these imports cleanly but never executes — the browser sits on
        // about:blank and the run hangs. They're deterministic: method/modes are
        // copied from the widget definition, index is the 0-based position. This
        // is the regression behind v0.7.8 (build-axiom silently dropped them);
        // pin it here so it can't come back.
        if (step.method === undefined || step.method === null) {
            errors.push({
                path: `${stepPath}/method`,
                keyword: 'required',
                message: `step is missing "method" — the extension's runner dispatches on method.{driver|browser}; without it the imported step never runs (the browser hangs on about:blank). Expected ${JSON.stringify(widget.method)}.`,
                params: {missingProperty: 'method', expected: widget.method}
            })
        } else if (JSON.stringify(step.method) !== JSON.stringify(widget.method)) {
            errors.push({
                path: `${stepPath}/method`,
                keyword: 'param_method',
                message: `${step.machine_name} method ${JSON.stringify(step.method)} doesn't match the widget's canonical method ${JSON.stringify(widget.method)}.`,
                params: {expected: widget.method, actual: step.method}
            })
        }

        if (step.modes === undefined || step.modes === null) {
            errors.push({
                path: `${stepPath}/modes`,
                keyword: 'required',
                message: `step is missing "modes" — required alongside method for the step to run. Expected ${JSON.stringify(widget.modes)}.`,
                params: {missingProperty: 'modes', expected: widget.modes}
            })
        } else if (JSON.stringify(step.modes) !== JSON.stringify(widget.modes)) {
            errors.push({
                path: `${stepPath}/modes`,
                keyword: 'param_modes',
                message: `${step.machine_name} modes ${JSON.stringify(step.modes)} doesn't match the widget's canonical modes ${JSON.stringify(widget.modes)}.`,
                params: {expected: widget.modes, actual: step.modes}
            })
        }

        if (typeof step.index !== 'number') {
            errors.push({
                path: `${stepPath}/index`,
                keyword: 'required',
                message: `step is missing a numeric "index" — the extension orders steps by it. Expected ${i} (0-based position).`,
                params: {missingProperty: 'index', expected: i}
            })
        } else if (step.index !== i) {
            errors.push({
                path: `${stepPath}/index`,
                keyword: 'param_index',
                message: `index ${step.index} doesn't match the step's 0-based position ${i}.`,
                params: {expected: i, actual: step.index}
            })
        }

        // (4) Params must match the widget's declared param list by count AND
        // position-and-name. This is the check that catches the "I only sent
        // the params I cared about" failure mode.
        const widgetParams = widget.params || []
        const stepParams = Array.isArray(step.params) ? step.params : []
        if (stepParams.length !== widgetParams.length) {
            errors.push({
                path: `${stepPath}/params`,
                keyword: 'param_count',
                message: `${step.machine_name} declares ${widgetParams.length} params; this step ships ${stepParams.length}. The importer iterates the full list — missing params render as undefined.`,
                params: {expected: widgetParams.length, actual: stepParams.length, widget: step.machine_name}
            })
        }
        const compareLen = Math.min(stepParams.length, widgetParams.length)
        for (let j = 0; j < compareLen; j++) {
            const got = stepParams[j]
            const want = widgetParams[j]
            if (!got || got.name !== want.name) {
                errors.push({
                    path: `${stepPath}/params/${j}/name`,
                    keyword: 'param_name',
                    message: `${step.machine_name} param ${j}: expected name "${want.name}", got "${got && got.name}". Param order and names must match the widget definition.`,
                    params: {expected: want.name, actual: got && got.name}
                })
            }
            if (got && want && got.type !== want.type) {
                errors.push({
                    path: `${stepPath}/params/${j}/type`,
                    keyword: 'param_type',
                    message: `${step.machine_name} param "${want.name}": expected type "${want.type}", got "${got.type}". Use the widget's declared type, not a guess.`,
                    params: {expected: want.type, actual: got.type}
                })
            }
        }
    })

    return errors
}

/**
 * @param {any} candidate
 * @returns {{valid: boolean, errors: Array<{path, message, keyword, params}>}}
 */
function validateAutomationTemplate(candidate) {
    const schemaValid = validate(candidate)
    const schemaErrors = schemaValid ? [] : (validate.errors || []).map(e => ({
        path: e.instancePath || '<root>',
        message: e.message || '',
        keyword: e.keyword,
        params: e.params
    }))

    const structuralErrors = structuralCheck(candidate)
    const errors = [...schemaErrors, ...structuralErrors]
    return {valid: errors.length === 0, errors}
}

module.exports = {validateAutomationTemplate, structuralCheck}

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
