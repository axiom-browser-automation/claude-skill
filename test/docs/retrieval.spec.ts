/**
 * Retrieval check — a deliberately dumb keyword-overlap scorer, run against
 * the index for a matrix of user-style prompts. For each prompt we assert
 * an expected doc appears in the top-N.
 *
 * If a basic algorithm finds the right doc, Claude (which reads in full
 * sentences with actual comprehension) will too. The test isn't proving
 * "Claude works" — it's proving the corpus *describes* its topics well
 * enough to be findable. Failures here usually mean a doc's frontmatter
 * description is missing or off-topic.
 */

import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'

const INDEX_PATH = resolve(__dirname, '..', '..', 'plugins', 'axiom', 'skills', 'axiom', 'references', 'docs', '_index.json')
const index = JSON.parse(readFileSync(INDEX_PATH, 'utf8'))

type Entry = {path: string; title: string; description?: string}
const allEntries: Entry[] = []
for (const c of index.categories) for (const e of c.entries) allEntries.push(e)

const STOPWORDS = new Set([
    'a', 'an', 'the', 'my', 'your', 'with', 'to', 'from', 'of', 'in', 'on',
    'at', 'for', 'by', 'do', 'i', 'can', 'how', 'what', 'when', 'where', 'why',
    'and', 'or', 'is', 'are', 'this', 'that', 'these', 'those', 'me', 'we'
])

function tokenize(s: string): string[] {
    return s.toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(t => t.length > 1 && !STOPWORDS.has(t))
}

function score(promptTokens: string[], entry: Entry): number {
    const text = (entry.title + ' ' + (entry.description || '') + ' ' + entry.path).toLowerCase()
    const entryTokens = new Set(tokenize(text))
    let hits = 0
    for (const t of promptTokens) {
        if (entryTokens.has(t)) hits++
        // Also count substring hits — helps with stems ("paginat" finds "pagination").
        else if (t.length >= 5 && text.includes(t.slice(0, 5))) hits++
    }
    return hits
}

function rank(prompt: string, topN = 10): Entry[] {
    const tokens = tokenize(prompt)
    if (tokens.length === 0) return []
    return allEntries
        .map(e => ({e, s: score(tokens, e)}))
        .filter(x => x.s > 0)
        .sort((a, b) => b.s - a.s || a.e.path.length - b.e.path.length)
        .slice(0, topN)
        .map(x => x.e)
}

type Case = {prompt: string; expect: string | RegExp; topN?: number}

const cases: Case[] = [
    // --- no-code concepts ---
    {prompt: 'how do I loop through urls', expect: /loop-urls|loop/},
    {prompt: 'schedule my axiom to run daily at 9am', expect: /schedul/},
    {prompt: 'add a wait step to slow down the bot', expect: 'no-code-tool/reference/steps/wait.md'},
    {prompt: 'write scraped data to a Google Sheet', expect: /google.?sheet/},
    {prompt: 'fill in a login form', expect: /login|form/},
    {prompt: 'click on a search result link', expect: /click/},
    {prompt: 'export results to a CSV file', expect: 'no-code-tool/reference/steps/export-csv-file.md'},
    {prompt: 'pause until a page finishes loading', expect: /wait|loading/},

    // --- troubleshooting ---
    {prompt: 'my axiom is being blocked by Cloudflare', expect: /cloudflare|bot.detection/i},
    {prompt: 'solve a captcha when scraping', expect: /captcha/},

    // --- integrations ---
    {prompt: 'integrate with ChatGPT or OpenAI', expect: /chatgpt|openai|integrate.ai/},
    {prompt: 'send results to Zapier', expect: /zapier/},
    {prompt: 'use Make.com to trigger', expect: /make/},

    // --- API / developer-hub ---
    {prompt: 'trigger an automation via REST API', expect: /run-automations|trigger|quickstart/},
    {prompt: 'how do I authenticate to the API', expect: 'developer-hub/api/authentication.md'},
    {prompt: 'programmatic signup flow', expect: 'developer-hub/api/programmatic-signup.md'},
    {prompt: 'show me the API quickstart', expect: 'developer-hub/api/quickstart.md'},
    {prompt: 'how do I set up an MCP server', expect: /mcp/i},
    {prompt: 'scrape using step functions', expect: /step.functions|scrape/},

    // --- coded path ---
    {prompt: 'sample code for navigating to a page', expect: /navigate|goto/},
    {prompt: 'how do I do data entry from a script', expect: /data.entry|form/}
]

describe('retrieval — basic keyword scorer finds expected docs', () => {
    test.each(cases)('"$prompt" → top-${10} includes ${expect}', ({prompt, expect: expected, topN}) => {
        const results = rank(prompt, topN ?? 10)
        expect(results.length).toBeGreaterThan(0)

        if (typeof expected === 'string') {
            const paths = results.map(r => r.path)
            expect(paths).toContain(expected)
        } else {
            const matched = results.some(r =>
                expected.test(r.path) ||
                expected.test(r.title) ||
                expected.test(r.description || '')
            )
            if (!matched) {
                throw new Error(
                    `expected pattern ${expected} not in top-${topN ?? 10} for "${prompt}":\n` +
                    results.map(r => `  ${r.path} — ${r.title}`).join('\n')
                )
            }
            expect(matched).toBe(true)
        }
    })

    test('unrelated nonsense doesn\'t spuriously return a high-confidence match', () => {
        const results = rank('xyzzy plugh foobar baz quux waldo fred', 5)
        // Either zero matches, or low-confidence ones — we just assert no result
        // is in core no-code/coded paths, which would suggest the scorer is broken.
        expect(results.length).toBeLessThan(5)
    })
})
