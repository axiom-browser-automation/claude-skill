/**
 * build-axiom.js — canonical-step construction from intent JSONs.
 *
 * The helper exists because hand-composing the full canonical step shape
 * (with all params, including the ones the user doesn't care about) is
 * exactly the failure mode this whole 0.7.4 release is about. These tests
 * pin the helper's contract: it always emits the full widget shape, with
 * the caller's `values` overriding only the `value` field of named params.
 */

// @ts-expect-error — pure JS module
import {buildAxiom, buildStep, findWidget, formatTokenRefValue, coerceTokenValue} from '../../plugins/axiom/skills/axiom/scripts/build-axiom.js'
// @ts-expect-error — pure JS module
import {validateAutomationTemplate} from '../../plugins/axiom/skills/axiom/scripts/validate-no-code.js'

describe('findWidget', () => {
    test('resolves a known widget', () => {
        const w = findWidget('WidgetDriverGoto')
        expect(w).not.toBeNull()
        expect(w.machineName).toBe('WidgetDriverGoto')
        expect(w.params).toBeDefined()
    })

    test('returns null for an unknown widget', () => {
        expect(findWidget('WidgetDoesNotExist')).toBeNull()
    })
})

describe('buildStep', () => {
    test('clones every param from the widget definition', () => {
        const step = buildStep({machineName: 'WidgetDriverGoto'}, 1)
        const widget = findWidget('WidgetDriverGoto')
        expect(step.params).toHaveLength(widget.params.length)
        expect(step.params.map((p: any) => p.name)).toEqual(widget.params.map((p: any) => p.name))
    })

    test('populates step-level required fields (original_name, machine_name, name, stepNumber)', () => {
        const step = buildStep({machineName: 'WidgetDriverGoto'}, 1)
        expect(step.machine_name).toBe('WidgetDriverGoto')
        expect(step.original_name).toBe('Go to page')
        expect(step.name).toBe('Go to page')
        expect(step.stepNumber).toBe('1')
        expect(step.description).toMatch(/go to a new page/i)
        expect(step.hasErrors).toBe(false)
        expect(step.token).toBe('')
        expect(step.metadata).toBe('')
        // method/modes/index drive the extension's runner — without them an
        // imported axiom hangs on about:blank (v0.7.8 regression).
        expect(step.method).toEqual({driver: 'driver.gotoV4070'})
        expect(step.modes).toEqual(['driver'])
        expect(step.index).toBe(0)
        expect(buildStep({machineName: 'WidgetDriverGoto'}, 3).index).toBe(2)
    })

    test('overrides only the named param\'s value, leaves others at default', () => {
        const step = buildStep({machineName: 'WidgetDriverGoto', values: {'Enter URL': 'https://x.test'}}, 1)
        const enterUrl = step.params.find((p: any) => p.name === 'Enter URL')
        const storeCookie = step.params.find((p: any) => p.name === 'Store Cookie')
        expect(enterUrl.value).toBe('https://x.test')
        // The other 3 params keep their widget-declared defaults
        expect(storeCookie.value).toBe(false)
    })

    test('preserves param metadata (type, description, default_value)', () => {
        const step = buildStep({machineName: 'WidgetDriverGoto', values: {'Enter URL': 'https://x.test'}}, 1)
        const p = step.params.find((p: any) => p.name === 'Enter URL')
        expect(p.type).toBe('current_url')
        expect(Array.isArray(p.description)).toBe(true)
        expect(p.description.length).toBeGreaterThan(0)
        expect(p.default_value).toBeDefined()
    })

    test('throws with a useful message when machineName is unknown', () => {
        expect(() => buildStep({machineName: 'WidgetMadeUp'}, 1)).toThrow(/unknown widget/)
    })

    test('throws when caller passes a value for a param the widget doesn\'t have', () => {
        // This is the exact bug Claude hit — calling the param "URL" instead of "Enter URL".
        expect(() => buildStep({machineName: 'WidgetDriverGoto', values: {URL: 'https://x.test'}}, 1))
            .toThrow(/got a value for "URL".*"Enter URL"/)
    })

    test('sets stepNumber as a string per the canonical schema', () => {
        expect(buildStep({machineName: 'WidgetDriverGoto'}, 1).stepNumber).toBe('1')
        expect(buildStep({machineName: 'WidgetDriverGoto'}, 7).stepNumber).toBe('7')
    })

    test('lets the caller override name (display label)', () => {
        const step = buildStep({machineName: 'WidgetDriverGoto', name: 'Open BBC'}, 1)
        expect(step.name).toBe('Open BBC')
        expect(step.original_name).toBe('Go to page')  // canonical name unchanged
    })

    test('falls back to the widget\'s canonical token when the caller omits one', () => {
        // 49 of 95 widgets define an output token in the vocabulary — without
        // this fallback, "Get Data" steps imported with token="" and produced
        // no referenceable output (v0.7.9 regression).
        expect(buildStep({machineName: 'WidgetDriverSmartScraper'}, 1).token).toBe('scrape-data')
        expect(buildStep({machineName: 'WidgetDriverScrapeLinks'}, 1).token).toBe('link-data')
        // Widgets without a vocab token (sinks like Goto) stay empty.
        expect(buildStep({machineName: 'WidgetDriverGoto'}, 1).token).toBe('')
    })

    test('caller-supplied token wins over the vocab default', () => {
        const step = buildStep({machineName: 'WidgetDriverSmartScraper', token: 'products'}, 1)
        expect(step.token).toBe('products')
    })

    // ── tokenRefs — value shape per runtime semantics (axiom_lib/ExecutorJson) ─
    //
    // Runtime dispatch in axiom_lib/lib/execution/ExecutorJson.ts#buildTokenReplacedParamList:
    //   token_list, merge_token             → tokenReplaceArray  (newline-separated string)
    //   everything else                     → tokenReplaceString (single bracketed string)
    //
    test('tokenRefs emits a bare "[name]" string for bot_token (string-path type)', () => {
        const step = buildStep({
            machineName: 'WidgetBotCreate',
            tokenRefs: { 'Loop through data': 'google-sheet-data' },
        }, 3)
        const p = step.params.find((x: any) => x.name === 'Loop through data')
        expect(p.type).toBe('bot_token')
        expect(p.value).toBe('[google-sheet-data]')
    })

    test('tokenRefs emits a bare "[name]" string for token (Continue.Data to check)', () => {
        const step = buildStep({
            machineName: 'WidgetContinue',
            tokenRefs: { 'Data to check': 'scrape-data' },
        }, 2)
        const p = step.params.find((x: any) => x.name === 'Data to check')
        expect(p.type).toBe('token')
        expect(p.value).toBe('[scrape-data]')
    })

    test('tokenRefs emits a bare "[name]" string for write_google_sheet_token (Sheet writer DATA)', () => {
        const step = buildStep({
            machineName: 'WidgetWriteGoogleSheet',
            tokenRefs: { DATA: 'scrape-data' },
        }, 2)
        const p = step.params.find((x: any) => x.name === 'DATA')
        expect(p.type).toBe('write_google_sheet_token')
        expect(p.value).toBe('[scrape-data]')
    })

    test('tokenRefs against a string-path type rejects multi-token arrays', () => {
        // token, bot_token, write_*_token, merge_token_list — all single-slot.
        // Passing 2+ refs should throw so the caller fixes their intent.
        expect(() => buildStep({
            machineName: 'WidgetContinue',
            tokenRefs: { 'Data to check': ['a', 'b'] },
        }, 1)).toThrow(/at most one token reference/)
    })

    test('tokenRefs wins over values when both target the same token-typed param', () => {
        const step = buildStep({
            machineName: 'WidgetBotCreate',
            values: { 'Loop through data': [] },
            tokenRefs: { 'Loop through data': 'links' },
        }, 1)
        const p = step.params.find((x: any) => x.name === 'Loop through data')
        expect(p.value).toBe('[links]')
    })

    test('tokenRefs rejects a param that is not a token-typed param', () => {
        // Goto's "Enter URL" is type=current_url, not a token type — should throw.
        expect(() => buildStep({
            machineName: 'WidgetDriverGoto',
            tokenRefs: { 'Enter URL': 'some-token' },
        }, 1)).toThrow(/not a token-typed param/)
    })

    test('tokenRefs rejects an unknown param name (same as values)', () => {
        expect(() => buildStep({
            machineName: 'WidgetBotCreate',
            tokenRefs: { 'No Such Param': 'foo' },
        }, 1)).toThrow(/got a tokenRef for "No Such Param"/)
    })

    // ── values-path defensive coercion ────────────────────────────────────
    // For callers that bypass tokenRefs and write `values: { DATA: [...] }`
    // directly with the legacy array shape, build-axiom unwraps to the
    // runtime-correct shape. Belt-and-braces against re-imports of
    // pre-v0.8.3 axioms.
    test('values: legacy array shape unwraps to string for write_google_sheet_token', () => {
        const step = buildStep({
            machineName: 'WidgetWriteGoogleSheet',
            values: { DATA: ['[scrape-data]'] },
        }, 2)
        const p = step.params.find((x: any) => x.name === 'DATA')
        expect(p.value).toBe('[scrape-data]')
    })

    test('values: legacy array shape unwraps to string for bot_token', () => {
        const step = buildStep({
            machineName: 'WidgetBotCreate',
            values: { 'Loop through data': ['[google-sheet-data]'] },
        }, 3)
        const p = step.params.find((x: any) => x.name === 'Loop through data')
        expect(p.value).toBe('[google-sheet-data]')
    })

    test('values: a non-token-shaped array on a token param passes through (caller intent honoured)', () => {
        const step = buildStep({
            machineName: 'WidgetWriteGoogleSheet',
            values: { DATA: ['not-a-token-just-a-string'] },
        }, 2)
        const p = step.params.find((x: any) => x.name === 'DATA')
        // Doesn't look like bracketed token refs → leave alone, let the
        // validator / runtime complain. We don't silently mangle user data.
        expect(p.value).toEqual(['not-a-token-just-a-string'])
    })

    // ── formatTokenRefValue + coerceTokenValue — direct helper coverage ───
    // No widget in the current vocab uses `token_list` or `merge_token`, but
    // the runtime branches on those types, so we test the helper directly to
    // pin the newline-separated shape contract for whenever they're added.
    test('formatTokenRefValue: newline-separated string for token_list multi-ref', () => {
        expect(formatTokenRefValue('token_list', ['a', 'b', 'c'])).toBe('[a]\n[b]\n[c]')
    })

    test('formatTokenRefValue: single-ref for token_list still produces just "[name]"', () => {
        expect(formatTokenRefValue('token_list', ['solo'])).toBe('[solo]')
    })

    test('formatTokenRefValue: newline-separated string for merge_token', () => {
        expect(formatTokenRefValue('merge_token', ['rows-a', 'rows-b'])).toBe('[rows-a]\n[rows-b]')
    })

    test('formatTokenRefValue: empty refs → empty string for string-path types', () => {
        expect(formatTokenRefValue('bot_token', [])).toBe('')
    })

    test('coerceTokenValue: ["[a]","[b]"] on token_list joins with newline', () => {
        expect(coerceTokenValue('token_list', ['[a]', '[b]'])).toBe('[a]\n[b]')
    })

    test('coerceTokenValue: ["[a]"] on bot_token unwraps to "[a]"', () => {
        expect(coerceTokenValue('bot_token', ['[a]'])).toBe('[a]')
    })

    test('coerceTokenValue: already-correct string passes through untouched', () => {
        expect(coerceTokenValue('write_google_sheet_token', '[scrape-data]')).toBe('[scrape-data]')
    })

    test('coerceTokenValue: non-token-typed param is left untouched', () => {
        // Don't accidentally mangle smart_selector arrays etc.
        expect(coerceTokenValue('smart_selector', [{selector: 'h1'}])).toEqual([{selector: 'h1'}])
    })

    // ── Sub-step labels for loop bodies ──────────────────────────────────
    test('caller can override stepNumber (used by loop body sub-step labels like "3.1")', () => {
        const step = buildStep({
            machineName: 'WidgetDriverGoto',
            stepNumber: '3.1',
        }, 3)
        expect(step.stepNumber).toBe('3.1')
    })

    // ── isLooping / afterLoopUpdate top-level flags ──────────────────────
    test('WidgetBotCreate carries isLooping + afterLoopUpdate flags from vocab', () => {
        const step = buildStep({machineName: 'WidgetBotCreate'}, 1)
        expect(step.isLooping).toBe(true)
        expect(step.afterLoopUpdate).toBe(true)
    })

    test('WidgetBotComplete does NOT carry isLooping (only the start widget does)', () => {
        const step = buildStep({machineName: 'WidgetBotComplete'}, 1)
        expect(step.isLooping).toBeUndefined()
        expect(step.afterLoopUpdate).toBeUndefined()
    })

    // ── smart_selector multi-column normalisation (P2) ──────────────────
    test('smart_selector array of {selector, resultType} columns gets UI defaults filled in', () => {
        const step = buildStep({
            machineName: 'WidgetDriverSmartScraper',
            values: {
                'Select': [
                    { selector: 'article.product_pod h3 a',     resultType: 'textContent' },
                    { selector: 'article.product_pod .price_color' }, // resultType omitted → default
                ],
            },
        }, 1)
        const p = step.params.find((x: any) => x.name === 'Select')
        expect(p.type).toBe('smart_selector')
        expect(p.value).toEqual([
            { selector: 'article.product_pod h3 a',      resultType: 'textContent', selectedElements: [], rejectedElements: [] },
            { selector: 'article.product_pod .price_color', resultType: 'textContent', selectedElements: [], rejectedElements: [] },
        ])
    })

    test('smart_selector string value (legacy single-selector form) passes through unchanged', () => {
        const step = buildStep({
            machineName: 'WidgetDriverSmartScraper',
            values: { 'Select': 'article.product_pod' },
        }, 1)
        const p = step.params.find((x: any) => x.name === 'Select')
        expect(p.value).toBe('article.product_pod')
    })

    test('smart_selector preserves pre-populated selectedElements/rejectedElements (UI-built values)', () => {
        const richValue = [{
            selector: 'h3 a',
            resultType: 'textContent',
            selectedElements: [{some: 'fingerprint'}],
            rejectedElements: [{other: 'fingerprint'}],
        }]
        const step = buildStep({
            machineName: 'WidgetDriverSmartScraper',
            values: { 'Select': richValue },
        }, 1)
        const p = step.params.find((x: any) => x.name === 'Select')
        expect(p.value[0].selectedElements).toEqual([{some: 'fingerprint'}])
        expect(p.value[0].rejectedElements).toEqual([{other: 'fingerprint'}])
    })
})

describe('buildAxiom', () => {
    const minimalIntent = {
        name: 'Visit example.com',
        contextUrl: 'https://example.com',
        steps: [{machineName: 'WidgetDriverGoto', values: {'Enter URL': 'https://example.com'}}]
    }

    test('produces a top-level AutomationTemplate envelope', () => {
        const a = buildAxiom(minimalIntent)
        expect(a.id).toBe(0)
        expect(a.openWidgetIndex).toBe(-1)
        expect(a.name).toBe('Visit example.com')
        expect(a.templateId).toBe(0)
        expect(a.triggers).toEqual([])
        expect(a.share_status).toBe(false)
        expect(a.share_link).toBe('')
        expect(a.stored_cookies).toEqual([])
    })

    test('produces the right data envelope', () => {
        const a = buildAxiom(minimalIntent)
        expect(a.data.mode).toBe('browser')
        expect(a.data.context).toEqual([{context: 'url', url: 'https://example.com'}])
        expect(a.data.form).toHaveLength(1)
        expect(a.data.templateItem.name).toBe('Visit example.com')
    })

    test('forwards triggers when provided', () => {
        const withTriggers = {...minimalIntent, triggers: [{name: 'Daily', type: 'recursive', status: 'active', time_criteria: 86400, interval_type: 'seconds', starting_time: '2026-05-22 09:00:00+00'}]}
        const a = buildAxiom(withTriggers)
        expect(a.triggers).toHaveLength(1)
        expect(a.triggers[0].name).toBe('Daily')
    })

    test('numbers steps starting at 1', () => {
        const intent = {
            name: 'Multi',
            steps: [
                {machineName: 'WidgetDriverGoto', values: {'Enter URL': 'https://x.test'}},
                {machineName: 'WidgetDriverClick', values: {Select: 'button'}}
            ]
        }
        const a = buildAxiom(intent)
        expect(a.data.form[0].stepNumber).toBe('1')
        expect(a.data.form[1].stepNumber).toBe('2')
    })

    test('deduplicates collisions when multiple steps inherit the same vocab token', () => {
        const a = buildAxiom({
            name: 'Two scrapes',
            steps: [
                {machineName: 'WidgetDriverGoto', values: {'Enter URL': 'https://x.test'}},
                {machineName: 'WidgetDriverSmartScraper'},
                {machineName: 'WidgetDriverSmartScraper'},
                {machineName: 'WidgetDriverSmartScraper'}
            ]
        })
        expect(a.data.form[0].token).toBe('')                 // Goto: no vocab token
        expect(a.data.form[1].token).toBe('scrape-data')
        expect(a.data.form[2].token).toBe('scrape-data-2')
        expect(a.data.form[3].token).toBe('scrape-data-3')
    })

    test('rejects intent without a name', () => {
        expect(() => buildAxiom({steps: [{machineName: 'WidgetDriverGoto'}]} as any)).toThrow(/name is required/)
    })

    test('rejects intent without steps', () => {
        expect(() => buildAxiom({name: 'x'} as any)).toThrow(/steps must be a non-empty array/)
        expect(() => buildAxiom({name: 'x', steps: []} as any)).toThrow(/steps must be a non-empty array/)
    })
})

describe('integration: helper output passes the strengthened validator', () => {
    test('a multi-step intent produces a validation-clean axiom', () => {
        const a = buildAxiom({
            name: 'BBC search for harry kane',
            contextUrl: 'https://www.bbc.co.uk',
            steps: [
                {machineName: 'WidgetDriverGoto', values: {'Enter URL': 'https://www.bbc.co.uk'}},
                {machineName: 'WidgetDriverEnterText', values: {'Select text field': 'input[type="search"]', Text: 'harry kane'}},
                {machineName: 'WidgetDriverClick', values: {Select: 'button[type="submit"]'}}
            ]
        })
        const result = validateAutomationTemplate(a)
        if (!result.valid) {
            const dump = result.errors.map((e: any) => `${e.path} [${e.keyword}] ${e.message}`).join('\n  ')
            throw new Error(`expected helper output to validate, got:\n  ${dump}`)
        }
        expect(result.valid).toBe(true)
    })
})
