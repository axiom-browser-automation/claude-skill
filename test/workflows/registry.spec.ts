/**
 * Workflow registry invariants:
 *  - Five workflows, in the documented routing order
 *  - Keys are unique
 *  - Every workflow has key + description + getRoutes
 *  - Every getRoutes() entry's key matches the workflow's own key
 */

// @ts-expect-error — pure JS module
import {WORKFLOWS, list, byKey, route} from '../../plugins/axiom/skills/axiom/workflows/WorkflowRegistry.js'

describe('WorkflowRegistry', () => {
    test('contains exactly the five workflows in routing order', () => {
        const keys = WORKFLOWS.map((W: any) => W.key)
        expect(keys).toEqual([
            'signup',
            'build_no_code',
            'build_coded',
            'run_automation',
            'handoff_to_extension'
        ])
    })

    test('keys are unique', () => {
        const keys = WORKFLOWS.map((W: any) => W.key)
        expect(new Set(keys).size).toBe(keys.length)
    })

    test('every workflow has key + description + getRoutes()', () => {
        for (const W of WORKFLOWS as any[]) {
            expect(typeof W.key).toBe('string')
            expect(W.key.length).toBeGreaterThan(0)
            expect(typeof W.description).toBe('string')
            expect(W.description.length).toBeGreaterThan(0)
            expect(typeof W.getRoutes).toBe('function')
            expect(typeof W.invoke).toBe('function')
        }
    })

    test('every route entry references its own workflow\'s key', () => {
        for (const W of WORKFLOWS as any[]) {
            for (const r of W.getRoutes()) {
                expect(r.key).toBe(W.key)
            }
        }
    })

    test('list() and byKey() round-trip', () => {
        const items = list()
        expect(items).toHaveLength(5)
        for (const item of items as any[]) {
            const found = byKey(item.key)
            expect(found).not.toBeNull()
            expect(found.key).toBe(item.key)
        }
    })

    test('byKey() returns null for unknown keys', () => {
        expect(byKey('does_not_exist')).toBeNull()
    })
})
