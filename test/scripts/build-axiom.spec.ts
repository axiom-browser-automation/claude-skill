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
import {buildAxiom, buildStep, findWidget} from '../../plugins/axiom/skills/axiom/scripts/build-axiom.js'
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
