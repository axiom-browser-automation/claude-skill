/**
 * Structural invariants for the docs index.
 *
 * If any of these fail, the corpus is internally inconsistent (orphan files,
 * dangling references, missing frontmatter). Claude can't compensate for the
 * shape being wrong — these are the "skill is shipped broken" sentinels.
 */

import {readFileSync, readdirSync, statSync, existsSync} from 'node:fs'
import {join, resolve, relative} from 'node:path'

const DOCS_ROOT = resolve(__dirname, '..', '..', 'plugins', 'axiom', 'skills', 'axiom', 'references', 'docs')
const INDEX_PATH = join(DOCS_ROOT, '_index.json')

const index = JSON.parse(readFileSync(INDEX_PATH, 'utf8'))

function walkMd(dir: string): string[] {
    const out: string[] = []
    for (const name of readdirSync(dir)) {
        const full = join(dir, name)
        if (statSync(full).isDirectory()) out.push(...walkMd(full))
        else if (name.endsWith('.md')) out.push(full)
    }
    return out
}

describe('docs/_index.json — structural invariants', () => {
    test('parses and has the expected top-level fields', () => {
        expect(index._sourceCommit).toMatch(/^[0-9a-f]{7,40}$|^unknown$/)
        expect(typeof index.totalDocs).toBe('number')
        expect(Array.isArray(index.categories)).toBe(true)
    })

    test('totalDocs is in a sane range (200-1000)', () => {
        expect(index.totalDocs).toBeGreaterThan(200)
        expect(index.totalDocs).toBeLessThan(1000)
    })

    test('totalDocs equals the sum of entries across all categories', () => {
        const sum = index.categories.reduce((acc: number, c: any) => acc + c.entries.length, 0)
        expect(sum).toBe(index.totalDocs)
    })

    test('totalDocs equals the actual .md file count on disk', () => {
        const onDisk = walkMd(DOCS_ROOT).length
        expect(onDisk).toBe(index.totalDocs)
    })

    test('every category has a unique key', () => {
        const keys = index.categories.map((c: any) => c.key)
        expect(new Set(keys).size).toBe(keys.length)
    })

    test('every category has at least one entry', () => {
        for (const c of index.categories) {
            expect(c.entries.length).toBeGreaterThan(0)
        }
    })

    test('every entry has a non-empty title', () => {
        const offenders: string[] = []
        for (const c of index.categories) {
            for (const e of c.entries) {
                if (!e.title || typeof e.title !== 'string') offenders.push(e.path)
            }
        }
        expect(offenders).toEqual([])
    })

    test('every entry.path resolves to an existing file on disk', () => {
        const missing: string[] = []
        for (const c of index.categories) {
            for (const e of c.entries) {
                if (!existsSync(join(DOCS_ROOT, e.path))) missing.push(e.path)
            }
        }
        expect(missing).toEqual([])
    })

    test('no orphan .md files — every file on disk is indexed', () => {
        const onDisk = new Set(walkMd(DOCS_ROOT).map(p => relative(DOCS_ROOT, p).replace(/\\/g, '/')))
        const indexed = new Set<string>()
        for (const c of index.categories) {
            for (const e of c.entries) indexed.add(e.path)
        }
        const orphans = [...onDisk].filter(p => !indexed.has(p))
        expect(orphans).toEqual([])
    })

    test('the corpus covers ≥35 categories — proves it isn\'t one big pile', () => {
        expect(index.categories.length).toBeGreaterThanOrEqual(35)
    })

    test('≥80% of entries have a non-empty description (frontmatter coverage)', () => {
        let withDesc = 0
        let total = 0
        for (const c of index.categories) {
            for (const e of c.entries) {
                total++
                if (e.description && e.description.length > 0) withDesc++
            }
        }
        const rate = withDesc / total
        expect(rate).toBeGreaterThanOrEqual(0.8)
    })
})
