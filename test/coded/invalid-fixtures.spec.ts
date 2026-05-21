/**
 * Each fixture in test/coded/fixtures/invalid/ MUST fail validation with the error code encoded in
 * its filename.
 *
 *   <description>.<EXPECTED_CODE>.js
 *     e.g. phantom-method.UNKNOWN_METHOD.js  →  expect at least one error with code === 'UNKNOWN_METHOD'
 */
import {readdirSync, readFileSync} from 'node:fs'
import {join, resolve} from 'node:path'
import {validateCodedScript} from '../shared/astHelpers'

const INVALID_DIR = resolve(__dirname, 'fixtures', 'invalid')
const files = readdirSync(INVALID_DIR).filter(f => f.endsWith('.js'))

function expectedCode(filename: string): string {
    const parts = filename.replace(/\.js$/, '').split('.')
    return parts[parts.length - 1]
}

describe('invalid coded fixtures fail with the expected error code', () => {
    test.each(files)('%s', (file) => {
        const source = readFileSync(join(INVALID_DIR, file), 'utf8')
        const result = validateCodedScript(source)
        const expected = expectedCode(file)

        expect(result.valid).toBe(false)
        expect(result.errors.length).toBeGreaterThan(0)

        const codes = result.errors.map((e: any) => e.code)
        if (!codes.includes(expected)) {
            throw new Error(
                `Expected error code "${expected}" but got: ${codes.join(', ')}\n` +
                result.errors.map((e: any) => `  [${e.code}] ${e.message}`).join('\n')
            )
        }
        expect(codes).toContain(expected)
    })
})
