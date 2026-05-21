/**
 * Every committed example in plugins/axiom/skills/axiom/examples/no-code/ MUST validate against the schema.
 * If one fails, the skill itself is broken — Claude reads these as few-shot references.
 */
import {readdirSync, readFileSync} from 'node:fs'
import {join, resolve} from 'node:path'
import {validateAutomationTemplate} from '../shared/ajvFactory'

const EXAMPLES_DIR = resolve(__dirname, '..', '..', 'plugins', 'axiom', 'skills', 'axiom', 'examples', 'no-code')

const files = readdirSync(EXAMPLES_DIR).filter(f => f.endsWith('.json'))

describe('skills/axiom/examples/no-code/*.json validates against AutomationTemplate schema', () => {
    test.each(files)('%s', (file) => {
        const candidate = JSON.parse(readFileSync(join(EXAMPLES_DIR, file), 'utf8'))
        const result = validateAutomationTemplate(candidate)
        if (!result.valid) {
            const errs = result.errors.map(e => `${e.path} [${e.keyword}] ${e.message}`).join('\n  ')
            throw new Error(`Validation failed for ${file}:\n  ${errs}`)
        }
        expect(result.valid).toBe(true)
        expect(result.errors).toEqual([])
    })
})
