/**
 * Regression bank for harvested Claude outputs (coded path).
 *
 * Each .js in test/coded/fixtures/claude-emitted/ has a sibling .expected.json:
 *   {"valid": true}                              for outputs we want to pin as known-good
 *   {"valid": false, "expectedCode": "..."}      for known-bad outputs we want to confirm we still catch
 *
 * Empty at first commit — populated as real Claude runs come in.
 */
import {readdirSync, readFileSync, existsSync} from 'node:fs'
import {join, resolve} from 'node:path'
import {validateCodedScript} from '../shared/astHelpers'

const DIR = resolve(__dirname, 'fixtures', 'claude-emitted')
const files = existsSync(DIR)
    ? readdirSync(DIR).filter(f => f.endsWith('.js'))
    : []

if (files.length === 0) {
    describe('claude-output regression bank (coded)', () => {
        test('empty — populate with real Claude outputs as they accumulate', () => {
            expect(true).toBe(true)
        })
    })
} else {
    describe('claude-output regression bank (coded)', () => {
        test.each(files)('%s', (file) => {
            const source = readFileSync(join(DIR, file), 'utf8')
            const expectedPath = join(DIR, file.replace(/\.js$/, '.expected.json'))
            if (!existsSync(expectedPath)) {
                throw new Error(`missing sibling expectation file: ${expectedPath}`)
            }
            const expected = JSON.parse(readFileSync(expectedPath, 'utf8'))
            const result = validateCodedScript(source)
            expect(result.valid).toBe(expected.valid)
            if (!expected.valid && expected.expectedCode) {
                const codes = result.errors.map((e: any) => e.code)
                expect(codes).toContain(expected.expectedCode)
            }
        })
    })
}
