/**
 * Regression bank for harvested Claude outputs.
 *
 * Each .json in test/no-code/fixtures/claude-emitted/ has a sibling .expected.json describing the
 * expected validation outcome. Format:
 *   {"valid": true}                            for outputs we want to pin as known-good
 *   {"valid": false, "expectedKeyword": "..."}  for known-bad outputs we want to confirm we still catch
 *
 * The directory is empty at first commit — populated as real Claude runs come in.
 */
import {readdirSync, readFileSync, existsSync} from 'node:fs'
import {join, resolve} from 'node:path'
import {validateAutomationTemplate} from '../shared/ajvFactory'

const DIR = resolve(__dirname, 'fixtures', 'claude-emitted')
const files = existsSync(DIR)
    ? readdirSync(DIR).filter(f => f.endsWith('.json') && !f.endsWith('.expected.json'))
    : []

if (files.length === 0) {
    describe('claude-output regression bank', () => {
        test('empty — populate with real Claude outputs as they accumulate', () => {
            expect(true).toBe(true)
        })
    })
} else {
    describe('claude-output regression bank', () => {
        test.each(files)('%s', (file) => {
            const candidate = JSON.parse(readFileSync(join(DIR, file), 'utf8'))
            const expectedPath = join(DIR, file.replace(/\.json$/, '.expected.json'))
            if (!existsSync(expectedPath)) {
                throw new Error(`missing sibling expectation file: ${expectedPath}`)
            }
            const expected = JSON.parse(readFileSync(expectedPath, 'utf8'))
            const result = validateAutomationTemplate(candidate)
            expect(result.valid).toBe(expected.valid)
            if (!expected.valid && expected.expectedKeyword) {
                const keywords = result.errors.map(e => e.keyword)
                expect(keywords).toContain(expected.expectedKeyword)
            }
        })
    })
}
