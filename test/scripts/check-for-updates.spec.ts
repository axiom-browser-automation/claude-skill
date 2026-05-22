/**
 * check-for-updates.js — semver math + output shape + silent-on-error contract.
 *
 * All primitives are exported pure functions; no real network calls anywhere
 * in this spec.
 */

// @ts-expect-error — pure JS module
import {compareSemver, formatOutput, readLocalVersion, fetchRemoteVersion} from '../../plugins/axiom/skills/axiom/scripts/check-for-updates.js'

describe('compareSemver', () => {
    test.each([
        ['0.7.1', '0.7.2', -1],
        ['0.7.2', '0.7.1', 1],
        ['0.7.1', '0.7.1', 0],
        ['0.10.0', '0.9.9', 1],    // critical: numeric, not stringwise
        ['1.0.0', '0.99.99', 1],
        ['0.7', '0.7.1', -1],       // shorter is treated as missing-zero
        ['0.7.0', '0.7', 0]
    ])('compareSemver(%s, %s) === %i', (a, b, expected) => {
        expect(compareSemver(a, b)).toBe(expected)
    })

    test('returns 0 for malformed input rather than throwing', () => {
        expect(compareSemver('garbage', '0.7.1')).toBe(0)
        expect(compareSemver(null as any, '0.7.1')).toBe(0)
        expect(compareSemver('0.7.1', undefined as any)).toBe(0)
    })
})

describe('formatOutput', () => {
    test('emits the UPDATE_AVAILABLE line only when remote > local', () => {
        expect(formatOutput('0.7.1', '0.7.2')).toBe('UPDATE_AVAILABLE current=0.7.1 latest=0.7.2')
    })

    test('silent when equal', () => {
        expect(formatOutput('0.7.1', '0.7.1')).toBe('')
    })

    test('silent when local > remote (dev machine)', () => {
        expect(formatOutput('0.8.0', '0.7.2')).toBe('')
    })

    test('silent when either side is null', () => {
        expect(formatOutput(null, '0.7.2')).toBe('')
        expect(formatOutput('0.7.1', null)).toBe('')
        expect(formatOutput(null, null)).toBe('')
    })
})

describe('readLocalVersion', () => {
    test('reads from plugin.json walked up from the script path', () => {
        const v = readLocalVersion()
        expect(v).toMatch(/^\d+\.\d+\.\d+/)
    })

    test('honours LOCAL_VERSION_OVERRIDE env', () => {
        expect(readLocalVersion({env: {LOCAL_VERSION_OVERRIDE: '9.9.9'}})).toBe('9.9.9')
    })

    test('returns null when no plugin.json found in the walked tree', () => {
        const fakeExists = () => false
        const v = readLocalVersion({startDir: '/tmp/does-not-exist', existsImpl: fakeExists, env: {}})
        expect(v).toBeNull()
    })
})

describe('fetchRemoteVersion', () => {
    test('honours REMOTE_VERSION_OVERRIDE env', () => {
        expect(fetchRemoteVersion({env: {REMOTE_VERSION_OVERRIDE: '0.7.2'}})).toBe('0.7.2')
    })

    test('returns the version field when gh succeeds', () => {
        const fakeExec = (cmd: string) => {
            if (cmd === 'gh') return JSON.stringify({version: '0.7.2', name: 'axiom'})
            throw new Error('curl should not be called when gh succeeds')
        }
        expect(fetchRemoteVersion({execImpl: fakeExec as any, env: {}})).toBe('0.7.2')
    })

    test('falls back to curl when gh fails', () => {
        const fakeExec = (cmd: string) => {
            if (cmd === 'gh') throw new Error('gh not installed')
            if (cmd === 'curl') return JSON.stringify({version: '0.7.5'})
            throw new Error('unexpected command')
        }
        expect(fetchRemoteVersion({execImpl: fakeExec as any, env: {}})).toBe('0.7.5')
    })

    test('returns null silently when both gh and curl fail', () => {
        const fakeExec = () => { throw new Error('no network') }
        expect(fetchRemoteVersion({execImpl: fakeExec as any, env: {}})).toBeNull()
    })

    test('returns null when remote returns malformed JSON', () => {
        const fakeExec = (cmd: string) => {
            if (cmd === 'gh') return 'this is not json'
            if (cmd === 'curl') return 'also not json'
            throw new Error('boom')
        }
        expect(fetchRemoteVersion({execImpl: fakeExec as any, env: {}})).toBeNull()
    })

    test('returns null when remote JSON lacks a version field', () => {
        const fakeExec = () => JSON.stringify({name: 'axiom'})
        expect(fetchRemoteVersion({execImpl: fakeExec as any, env: {}})).toBeNull()
    })
})
