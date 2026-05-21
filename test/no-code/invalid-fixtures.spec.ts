/**
 * Each fixture in test/no-code/fixtures/invalid/ MUST fail validation, and must surface an
 * AJV error whose `keyword` matches the suffix encoded in the filename.
 *
 * Filename convention:  `<description>.<expected-keyword>.json`
 *   e.g. missing-name.required.json  →  expect at least one error with keyword === 'required'
 *        unknown-machine-name.enum.json  →  expect keyword === 'enum'
 */
import {readdirSync, readFileSync} from 'node:fs'
import {join, resolve} from 'node:path'
import {validateAutomationTemplate} from '../shared/ajvFactory'

const INVALID_DIR = resolve(__dirname, 'fixtures', 'invalid')
const files = readdirSync(INVALID_DIR).filter(f => f.endsWith('.json'))

function expectedKeyword(filename: string): string {
    // foo.bar.required.json → 'required'
    const parts = filename.replace(/\.json$/, '').split('.')
    return parts[parts.length - 1]
}

describe('invalid no-code fixtures fail with the expected AJV keyword', () => {
    test.each(files)('%s', (file) => {
        const candidate = JSON.parse(readFileSync(join(INVALID_DIR, file), 'utf8'))
        const result = validateAutomationTemplate(candidate)
        const expected = expectedKeyword(file)

        expect(result.valid).toBe(false)
        expect(result.errors.length).toBeGreaterThan(0)

        const keywords = result.errors.map(e => e.keyword)
        if (!keywords.includes(expected)) {
            throw new Error(
                `Expected error with keyword "${expected}" but got: ${keywords.join(', ')}\n` +
                result.errors.map(e => `  ${e.path} [${e.keyword}] ${e.message}`).join('\n')
            )
        }
        expect(keywords).toContain(expected)
    })
})
