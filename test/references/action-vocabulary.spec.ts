import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(__dirname, '../..')
const SOURCE = resolve(ROOT, '../axiom_mcp/axiom_builder_ir/schema/IR/IntermediateRepresentation.ts')

// The vocabulary is generated from the widget catalogue axiom_mcp ships, so a
// builder-ir pin bump there silently invalidates this file — agents then author
// widgets compile_ir rejects, or never learn about new ones. Only the monorepo
// checkout has that source beside us; a standalone clone skips.
const whenSourcePresent = existsSync(SOURCE) ? describe : describe.skip

whenSourcePresent('action-vocabulary.json', () => {
    test('is in sync with the builder-ir axiom_mcp ships (npm run build:vocabulary)', () => {
        try {
            execFileSync('node', ['tools/build-action-vocabulary.js', '--check'], { cwd: ROOT, encoding: 'utf8' })
        } catch (err: any) {
            throw new Error(String(err.stderr || err.stdout || err.message))
        }
    })
})
