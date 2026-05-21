/**
 * Coverage tests — specific high-value docs are present in the corpus with
 * sensible metadata.
 *
 * These are pinning tests: if the source repo restructures or renames a doc,
 * the matching case here breaks, and we update both. Each case names a
 * concept that's load-bearing for either the no-code or coded path.
 *
 * Doesn't test retrieval quality — see retrieval.spec.ts for that.
 */

import {readFileSync} from 'node:fs'
import {resolve, join} from 'node:path'

const INDEX_PATH = resolve(__dirname, '..', '..', 'plugins', 'axiom', 'skills', 'axiom', 'references', 'docs', '_index.json')
const index = JSON.parse(readFileSync(INDEX_PATH, 'utf8'))

type Entry = {path: string; title: string; description?: string}
const allEntries: Entry[] = []
for (const c of index.categories) for (const e of c.entries) allEntries.push(e)

function entryAt(path: string): Entry | undefined {
    return allEntries.find(e => e.path === path)
}

function entriesMatching(predicate: (e: Entry) => boolean): Entry[] {
    return allEntries.filter(predicate)
}

describe('docs corpus covers core no-code step references', () => {
    const expectedSteps = [
        'wait',
        'click-element',
        'click-multiple-elements',
        'integrate-ai',
        'export-csv-file',
        'date-picker',
        'date-time',
        'download-file-from-url'
    ]

    test.each(expectedSteps)('step reference "%s" is indexed', (slug) => {
        const found = entryAt(`no-code-tool/reference/steps/${slug}.md`)
        expect(found).toBeDefined()
        expect(found!.title).toMatch(/.+/)
    })

    test('the steps category has 50+ entries — the step library is comprehensive', () => {
        const cat = index.categories.find((c: any) => c.key === 'no-code-tool/reference/steps')
        expect(cat).toBeDefined()
        expect(cat.entries.length).toBeGreaterThanOrEqual(50)
    })
})

describe('docs corpus covers integrations', () => {
    const expectedIntegrations = [
        ['google-sheets', /google sheet/i],
        ['zapier', /zapier/i],
        ['make', /make/i],
        ['chatgpt', /chatgpt|openai/i],
        ['gemini', /gemini/i],
        ['puppeteer', /puppeteer/i]
    ] as const

    test.each(expectedIntegrations)('%s integration is indexed with a matching description', (slug, descRegex) => {
        const found = entryAt(`no-code-tool/integrations/${slug}.md`)
        expect(found).toBeDefined()
        expect(found!.title + ' ' + (found!.description || '')).toMatch(descRegex)
    })
})

describe('docs corpus covers troubleshooting', () => {
    test('errors/steps has multiple files (per step-category breakdown)', () => {
        const cat = index.categories.find((c: any) => c.key === 'no-code-tool/troubleshooting/errors/steps')
        expect(cat).toBeDefined()
        expect(cat.entries.length).toBeGreaterThanOrEqual(5)
    })

    test('Cloudflare / bot-detection bypass is covered somewhere', () => {
        const matches = entriesMatching(e => /cloudflare|bot.detect/i.test(e.title + ' ' + (e.description || '')))
        expect(matches.length).toBeGreaterThan(0)
    })

    test('debug guidance is indexed', () => {
        const matches = entriesMatching(e => /debug/i.test(e.title))
        expect(matches.length).toBeGreaterThan(0)
    })
})

describe('docs corpus covers developer-hub / API', () => {
    const requiredApiDocs = [
        'developer-hub/api/quickstart.md',
        'developer-hub/api/authentication.md',
        'developer-hub/api/programmatic-signup.md'
    ]

    test.each(requiredApiDocs)('API doc "%s" is indexed', (path) => {
        const found = entryAt(path)
        expect(found).toBeDefined()
        expect(found!.description).toMatch(/.+/)
    })

    test('step-functions category has 15+ entries (coded path reference)', () => {
        const cat = index.categories.find((c: any) => c.key === 'developer-hub/api/step-functions')
        expect(cat).toBeDefined()
        expect(cat.entries.length).toBeGreaterThanOrEqual(15)
    })

    test('MCP docs are present (Claude/Cursor integration)', () => {
        const cat = index.categories.find((c: any) => c.key === 'developer-hub/api/mcp')
        expect(cat).toBeDefined()
        expect(cat.entries.length).toBeGreaterThanOrEqual(3)
    })
})

describe('docs corpus covers core concepts', () => {
    const expectedConcepts: Array<[string, RegExp]> = [
        ['no-code-tool/how-it-works/loop.md', /loop/i],
        ['no-code-tool/how-it-works/logic.md', /logic|conditional/i],
        ['no-code-tool/how-it-works/javascript.md', /javascript/i],
        ['no-code-tool/how-it-works/integrate-ai.md', /ai/i]
    ]

    test.each(expectedConcepts)('concept "%s" is indexed with a matching title/description', (path, contentRegex) => {
        const found = entryAt(path)
        expect(found).toBeDefined()
        expect(found!.title + ' ' + (found!.description || '')).toMatch(contentRegex)
    })

    test('schedule-and-run has multiple files', () => {
        const cat = index.categories.find((c: any) => c.key === 'no-code-tool/how-it-works/schedule-and-run')
        expect(cat).toBeDefined()
        expect(cat.entries.length).toBeGreaterThanOrEqual(3)
    })
})

describe('docs corpus covers triggers (webhook, schedule, manual)', () => {
    test('webhook triggers are covered', () => {
        const matches = entriesMatching(e => /webhook/i.test(e.title + ' ' + (e.description || '')))
        expect(matches.length).toBeGreaterThanOrEqual(3)
    })

    test('scheduled runs are covered', () => {
        const matches = entriesMatching(e => /schedul/i.test(e.title + ' ' + (e.description || '')))
        expect(matches.length).toBeGreaterThanOrEqual(3)
    })
})
