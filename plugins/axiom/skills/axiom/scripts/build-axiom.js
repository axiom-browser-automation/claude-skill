#!/usr/bin/env node
/**
 * build-axiom.js
 *
 * Take a high-level axiom *intent* and emit a canonical AutomationTemplate
 * JSON whose steps match what the Chrome extension importer expects.
 *
 * The previous flow had Claude hand-compose every step, including each
 * widget's full param list with all the metadata. Easy to skip a param
 * "I don't care about" and end up with a JSON that imports as a row of
 * `undefined`-labelled steps because the importer iterates the canonical
 * param list and finds gaps. This helper uses references/action-vocabulary.json
 * as the source of truth: clone the widget's full shape, override only the
 * `value` fields the caller actually sets.
 *
 * Intent file shape:
 *
 *   {
 *     "name": "BBC search for harry kane",
 *     "description": "Navigates to bbc.co.uk and searches...",   (optional)
 *     "contextUrl": "https://www.bbc.co.uk",                     (optional)
 *     "triggers": [],                                            (optional)
 *     "steps": [
 *       {
 *         "machineName": "WidgetDriverGoto",
 *         "values": {"Enter URL": "https://www.bbc.co.uk"}
 *       },
 *       {
 *         "machineName": "WidgetDriverEnterText",
 *         "values": {"Select text field": "input[type='search']", "Text": "harry kane"}
 *       },
 *       {
 *         "machineName": "WidgetDriverClick",
 *         "values": {"Select": "button[type='submit']"}
 *       }
 *     ]
 *   }
 *
 * Output: a fully-shaped AutomationTemplate JSON, ready to be imported via
 * the Chrome extension's Cog → Import or download → Select file flow.
 *
 * CLI:
 *   node build-axiom.js --intent path/to/intent.json --output path/to/axiom.json
 *   node build-axiom.js --intent intent.json   # stdout
 *   cat intent.json | node build-axiom.js      # stdin + stdout
 *
 * Also exported (`buildAxiom`, `buildStep`) so the test suite + workflows can
 * drive it without spawning a process.
 */

const {readFileSync, writeFileSync, existsSync} = require('node:fs')
const {resolve} = require('node:path')

const VOCAB_PATH = resolve(__dirname, '..', 'references', 'action-vocabulary.json')

let _vocabCache = null
function loadVocabulary(vocabPath = VOCAB_PATH) {
    if (_vocabCache && _vocabCache.path === vocabPath) return _vocabCache.data
    const data = JSON.parse(readFileSync(vocabPath, 'utf8'))
    _vocabCache = {path: vocabPath, data}
    return data
}

/**
 * Look up a widget by its machineName in widgetActionList.
 *
 * @param {string} machineName
 * @param {object} [vocab]  injected for tests; defaults to loaded action-vocabulary.json
 * @returns {object|null}   the widget definition or null
 */
function findWidget(machineName, vocab) {
    const v = vocab || loadVocabulary()
    return (v.widgetActionList || []).find(w => w.machineName === machineName) || null
}

// Param `type` values whose populated `value` is a single-element array
// containing the upstream step's output token name wrapped in square brackets
// (e.g. `["[google-sheet-data]"]`). Used to translate the caller-friendly
// `tokenRefs: { paramName: "google-sheet-data" }` shape into the canonical
// JSON every step expects. Source-of-truth for which param types are
// token-references is the ParamToken constructor in
// `axiom_extension/src/axiombuilder/models/params/ParamToken.ts`.
const TOKEN_REF_PARAM_TYPES = new Set([
    'token',
    'token_list',
    'merge_token',
    'merge_token_list',
    'bot_token',
])

/**
 * Normalize a `smart_selector` param value so the runtime can scrape multiple
 * columns. Accepts the caller-friendly shorthand
 *   [{selector: "h3 a", resultType: "textContent"},
 *    {selector: ".price", resultType: "textContent"}]
 * and fills in the `selectedElements: []` + `rejectedElements: []` UI-only
 * defaults the importer + runtime tolerate. A `resultType` defaults to
 * `"textContent"`. Source-of-truth for the runtime's accepted shape is
 * `axiom_lib/lib/execution/AxiomApiHelper.js#buildSelectorArray` — it reads
 * `.selector` and `.resultType` from each entry and ignores the rest.
 *
 * If `value` isn't an array (e.g. a single string CSS selector), pass it
 * through unchanged — the runtime also accepts that legacy shape.
 *
 * @param {any} value
 * @returns {any}
 */
function normalizeSmartSelectorValue(value) {
    if (!Array.isArray(value)) return value
    return value.map(entry => {
        if (entry && typeof entry === 'object' && typeof entry.selector === 'string') {
            return {
                selector: entry.selector,
                resultType: typeof entry.resultType === 'string' ? entry.resultType : 'textContent',
                selectedElements: Array.isArray(entry.selectedElements) ? entry.selectedElements : [],
                rejectedElements: Array.isArray(entry.rejectedElements) ? entry.rejectedElements : [],
            }
        }
        return entry
    })
}

/**
 * Build one canonical step from a step intent + the widget definition.
 *
 * The step gets every field axiom-structure.md documents (description,
 * hasErrors, index, machine_name, metadata, method, modes, name,
 * original_name, params, stepNumber, token) and every param the widget
 * declares (collapsible, configurable, default_value, description, help,
 * image, name, type, value). method + modes are copied from the widget
 * definition; the extension's runner dispatches on them, so a step without
 * them imports but never runs.
 *
 * @param {{machineName: string, values?: Object<string, any>, tokenRefs?: Object<string, string|string[]>, name?: string, token?: string, stepNumber?: string}} stepIntent
 * @param {number} stepNumber  1-based (numeric index into form). The caller can
 *   override the string label via stepIntent.stepNumber — needed for sub-steps
 *   inside loops, which use "3.1", "3.2", … under a parent "3".
 * @param {object} [vocab]     injected for tests
 * @returns {object}           canonical step object
 */
function buildStep(stepIntent, stepNumber, vocab) {
    const widget = findWidget(stepIntent.machineName, vocab)
    if (!widget) {
        throw new Error(`build-axiom: unknown widget machineName "${stepIntent.machineName}". Check references/action-vocabulary.json's widgetActionList.`)
    }
    const values = stepIntent.values || {}
    const tokenRefs = stepIntent.tokenRefs || {}

    // Sanity-check the caller didn't pass values/tokenRefs for params the
    // widget doesn't declare. Catches typos like "URL" vs "Enter URL" that
    // would otherwise silently no-op.
    const widgetParamNames = new Set((widget.params || []).map(p => p.name))
    for (const k of Object.keys(values)) {
        if (!widgetParamNames.has(k)) {
            throw new Error(
                `build-axiom: step "${stepIntent.machineName}" got a value for "${k}", but the widget's params are: ${[...widgetParamNames].map(n => `"${n}"`).join(', ')}. Check the param name (it's case-sensitive).`
            )
        }
    }
    for (const k of Object.keys(tokenRefs)) {
        if (!widgetParamNames.has(k)) {
            throw new Error(
                `build-axiom: step "${stepIntent.machineName}" got a tokenRef for "${k}", but the widget's params are: ${[...widgetParamNames].map(n => `"${n}"`).join(', ')}. Check the param name (it's case-sensitive).`
            )
        }
        const param = (widget.params || []).find(p => p.name === k)
        if (!TOKEN_REF_PARAM_TYPES.has(param.type)) {
            throw new Error(
                `build-axiom: step "${stepIntent.machineName}" tokenRef "${k}" points at a param of type "${param.type}", which is not a token-typed param. tokenRefs only apply to params of type: ${[...TOKEN_REF_PARAM_TYPES].join(', ')}. Use values for ordinary param literals.`
            )
        }
    }

    const step = {
        description: widget.description || '',
        hasErrors: false,
        // 0-based position. The extension orders + dispatches steps by index;
        // omitting it is one of the three fields whose absence makes an imported
        // axiom hang without running (see method/modes below).
        index: stepNumber - 1,
        machine_name: widget.machineName,
        metadata: '',
        // method + modes come straight from the widget definition and are what
        // the extension's runner dispatches on (e.g. method.driver →
        // driver.gotoV4070). A step missing them imports fine but never
        // executes — the browser sits on about:blank. Every widget in the
        // vocabulary declares both, so copy them verbatim.
        method: widget.method,
        modes: widget.modes,
        name: stepIntent.name || widget.name || widget.originalName || '',
        original_name: widget.name || widget.originalName || '',
        params: (widget.params || []).map(p => {
            // tokenRefs win over values for token-typed params. Build the
            // canonical [["[<name>]"]] shape — one wrapped name per ref. The
            // caller can pass a single string or an array of names.
            let value
            if (tokenRefs[p.name] !== undefined) {
                const refs = Array.isArray(tokenRefs[p.name]) ? tokenRefs[p.name] : [tokenRefs[p.name]]
                value = refs.map(r => `[${r}]`)
            } else if (values[p.name] !== undefined) {
                value = values[p.name]
            } else if (p.default_value !== undefined) {
                value = p.default_value
            } else if (p.value !== undefined) {
                value = p.value
            } else {
                value = ''
            }
            // smart_selector multi-column shorthand: callers can pass
            //   [{selector, resultType}, {selector, resultType}, …]
            // and the helper fills in the UI-only `selectedElements` /
            // `rejectedElements` defaults the importer + runtime tolerate. A
            // plain string or already-normalised array passes through.
            if (p.type === 'smart_selector') {
                value = normalizeSmartSelectorValue(value)
            }
            return {
                collapsible: p.collapsible !== undefined ? p.collapsible : 0,
                configurable: p.configurable !== undefined ? p.configurable : true,
                default_value: p.default_value !== undefined ? p.default_value : '',
                description: p.description || [],
                help: p.help || [],
                image: p.image || '',
                name: p.name,
                type: p.type,
                value
            }
        }),
        // stepNumber is a string label. Defaults to the 1-based numeric index
        // (e.g. "1", "2", …), but the caller can override with a sub-step
        // label like "3.1" for body steps inside a loop.
        stepNumber: stepIntent.stepNumber || String(stepNumber),
        // 49 of 95 widgets define a canonical output token in the vocabulary
        // (scrape-data, link-data, google-sheet-data, …). Fall back to it so
        // a data-producing step without an explicit caller-supplied token still
        // names its output — otherwise "Get Data" steps import with token="",
        // run fine, and produce no referenceable output. (Caller's explicit
        // token still wins; buildAxiom dedups collisions across steps.)
        token: stepIntent.token || widget.token || ''
    }
    // Optional widget-level flags. Currently only WidgetBotCreate carries them
    // (isLooping=true, afterLoopUpdate=true) — the importer keys off these to
    // recognise a step as the start of a loop block. Schema permits both as
    // optional widget properties.
    if (widget.isLooping !== undefined) step.isLooping = widget.isLooping
    if (widget.afterLoopUpdate !== undefined) step.afterLoopUpdate = widget.afterLoopUpdate
    return step
}

/**
 * Build a full AutomationTemplate from an intent.
 *
 * @param {object} intent
 * @param {string} intent.name              automation name (required)
 * @param {string} [intent.description]
 * @param {string} [intent.contextUrl]      single URL for `data.context`
 * @param {Array}  [intent.triggers]        schedule/webhook trigger entries
 * @param {Array}  intent.steps             step intents
 * @param {object} [opts]
 * @param {object} [opts.vocab]             injected vocabulary for tests
 * @returns {object} the canonical AutomationTemplate
 */
function buildAxiom(intent, opts = {}) {
    if (!intent || typeof intent !== 'object') {
        throw new Error('build-axiom: intent must be an object')
    }
    if (!intent.name || typeof intent.name !== 'string') {
        throw new Error('build-axiom: intent.name is required')
    }
    if (!Array.isArray(intent.steps) || intent.steps.length === 0) {
        throw new Error('build-axiom: intent.steps must be a non-empty array')
    }

    const form = intent.steps.map((s, i) => buildStep(s, i + 1, opts.vocab))

    // Dedup non-empty tokens: when two steps default to the same vocab token
    // (e.g. two SmartScraper steps both inherit "scrape-data") the importer
    // would silently coalesce them. First occurrence keeps the bare name;
    // subsequent get a "-2", "-3", … suffix.
    const tokenCounts = {}
    for (const step of form) {
        if (!step.token) continue
        const n = (tokenCounts[step.token] || 0) + 1
        tokenCounts[step.token] = n
        if (n > 1) step.token = `${step.token}-${n}`
    }

    return {
        id: 0,
        openWidgetIndex: -1,
        name: intent.name,
        templateId: 0,
        triggers: intent.triggers || [],
        share_status: false,
        share_link: '',
        stored_cookies: [],
        data: {
            allowConcurrencyDesktop: true,
            builderTemplateId: 0,
            context: [{context: 'url', url: intent.contextUrl || ''}],
            disallowConcurrencyCloud: false,
            form,
            headless: false,
            incognitoMode: false,
            injector: {injector: 'dom', magic_btn_status: true, selector: ''},
            mode: 'browser',
            storeCookies: false,
            templateId: 0,
            templateItem: {
                name: intent.name,
                description: intent.description || ''
            },
            templateMode: false,
            templateStarted: false,
            tokens: null,
            viewport: null
        }
    }
}

module.exports = {buildAxiom, buildStep, findWidget, loadVocabulary}

// ---- CLI ----
if (require.main === module) {
    const args = process.argv.slice(2)
    function flag(name) {
        const i = args.indexOf(`--${name}`)
        return i >= 0 && i + 1 < args.length ? args[i + 1] : null
    }

    if (args.includes('-h') || args.includes('--help')) {
        console.log(`build-axiom.js — produce a canonical AutomationTemplate JSON from a step-intent file

Usage:
  node build-axiom.js --intent path/to/intent.json --output path/to/axiom.json
  node build-axiom.js --intent intent.json                    # to stdout
  cat intent.json | node build-axiom.js --output axiom.json   # stdin → file
  cat intent.json | node build-axiom.js                       # stdin → stdout

Intent shape:
  {
    "name": "<automation name>",
    "description": "<optional summary>",
    "contextUrl": "<optional starting URL>",
    "triggers": [],
    "steps": [
      {"machineName": "WidgetDriverGoto", "values": {"Enter URL": "https://..."}},
      {"machineName": "WidgetDriverEnterText", "values": {"Select text field": "...", "Text": "..."}},
      ...
    ]
  }

The widget machineNames and param names come from references/action-vocabulary.json's widgetActionList.
`)
        process.exit(0)
    }

    const intentPath = flag('intent')
    const outputPath = flag('output')

    let intentRaw
    if (intentPath) {
        if (!existsSync(intentPath)) {
            console.error(`build-axiom: intent file not found: ${intentPath}`)
            process.exit(2)
        }
        intentRaw = readFileSync(intentPath, 'utf8')
    } else if (!process.stdin.isTTY) {
        intentRaw = readFileSync(0, 'utf8')
    } else {
        console.error('build-axiom: provide --intent <path> or pipe intent JSON on stdin')
        process.exit(2)
    }

    let intent
    try {
        intent = JSON.parse(intentRaw)
    } catch (e) {
        console.error(`build-axiom: intent file is not valid JSON — ${e.message}`)
        process.exit(1)
    }

    let result
    try {
        result = buildAxiom(intent)
    } catch (e) {
        console.error(`build-axiom: ${e.message}`)
        process.exit(1)
    }

    const out = JSON.stringify(result, null, 2) + '\n'
    if (outputPath) {
        writeFileSync(outputPath, out)
        console.log(`wrote ${outputPath}`)
    } else {
        process.stdout.write(out)
    }
}
