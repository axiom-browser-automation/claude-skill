/**
 * Every committed example in plugins/axiom/skills/axiom/examples/coded/ MUST pass the AST validator.
 */
import {readdirSync, readFileSync} from 'node:fs'
import {join, resolve} from 'node:path'
import {validateCodedScript} from '../shared/astHelpers'

const EXAMPLES_DIR = resolve(__dirname, '..', '..', 'plugins', 'axiom', 'skills', 'axiom', 'examples', 'coded')
const files = readdirSync(EXAMPLES_DIR).filter(f => f.endsWith('.js'))

describe('plugins/axiom/skills/axiom/examples/coded/*.js passes the coded validator', () => {
    test.each(files)('%s', (file) => {
        const source = readFileSync(join(EXAMPLES_DIR, file), 'utf8')
        const result = validateCodedScript(source)
        if (!result.valid) {
            const errs = result.errors.map((e: any) => `[${e.code}] ${e.message}`).join('\n  ')
            throw new Error(`Validation failed for ${file}:\n  ${errs}`)
        }
        expect(result.valid).toBe(true)
        expect(result.errors).toEqual([])
    })
})
