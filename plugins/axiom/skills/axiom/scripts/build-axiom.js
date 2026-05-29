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
 * @param {{machineName: string, values?: Object<string, any>, name?: string, token?: string}} stepIntent
 * @param {number} stepNumber  1-based
 * @param {object} [vocab]     injected for tests
 * @returns {object}           canonical step object
 */
function buildStep(stepIntent, stepNumber, vocab) {
    const widget = findWidget(stepIntent.machineName, vocab)
    if (!widget) {
        throw new Error(`build-axiom: unknown widget machineName "${stepIntent.machineName}". Check references/action-vocabulary.json's widgetActionList.`)
    }
    const values = stepIntent.values || {}

    // Sanity-check the caller didn't pass values for params the widget doesn't declare.
    // This catches typos like "URL" vs "Enter URL" that would otherwise silently no-op.
    const widgetParamNames = new Set((widget.params || []).map(p => p.name))
    for (const k of Object.keys(values)) {
        if (!widgetParamNames.has(k)) {
            throw new Error(
                `build-axiom: step "${stepIntent.machineName}" got a value for "${k}", but the widget's params are: ${[...widgetParamNames].map(n => `"${n}"`).join(', ')}. Check the param name (it's case-sensitive).`
            )
        }
    }

    return {
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
            const overrideValue = values[p.name]
            const value = overrideValue !== undefined
                ? overrideValue
                : (p.default_value !== undefined ? p.default_value : (p.value !== undefined ? p.value : ''))
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
        stepNumber: String(stepNumber),
        token: stepIntent.token || ''
    }
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
