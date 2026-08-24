/**
 * setup-desktop-mcp.js — the pure parts (artifact resolution against the
 * published index, API-base derivation). The index fixture is a verbatim
 * copy of https://axiom.ai/axiom_desktop/ (2026-08-24); there is no
 * `latest` pointer upstream, so the semver pick IS the resolution logic.
 */

import * as fs from 'fs'
import * as path from 'path'

// @ts-expect-error — pure JS module
import {parseIndex, resolveArtifact, deriveApiBase, DOWNLOAD_INDEX_URL} from '../../plugins/axiom/skills/axiom/scripts/setup-desktop-mcp.js'

const INDEX_HTML = fs.readFileSync(path.join(__dirname, 'fixtures', 'axiom-desktop-index.html'), 'utf8')

describe('parseIndex()', () => {
    test('lists every AxiomDesktop_* artifact once, ignoring sort links and parent dir', () => {
        const files = parseIndex(INDEX_HTML)
        expect(files).toContain('AxiomDesktop_5.2.0_amd64.deb')
        expect(files).toContain('AxiomDesktop_5.2.0_aarch64.dmg')
        expect(files).toContain('AxiomDesktop_5.2.0_x64-setup.exe')
        expect(files.every((f: string) => f.startsWith('AxiomDesktop_'))).toBe(true)
        expect(new Set(files).size).toBe(files.length)
    })
})

describe('resolveArtifact()', () => {
    test('linux/x64 → newest .deb, with a full URL', () => {
        const r = resolveArtifact(INDEX_HTML, 'linux', 'x64')
        expect(r.ok).toBe(true)
        expect(r.file).toBe('AxiomDesktop_5.2.0_amd64.deb')
        expect(r.version).toBe('5.2.0')
        expect(r.url).toBe(DOWNLOAD_INDEX_URL + 'AxiomDesktop_5.2.0_amd64.deb')
    })

    test('darwin/arm64 → newest .dmg', () => {
        const r = resolveArtifact(INDEX_HTML, 'darwin', 'arm64')
        expect(r.ok).toBe(true)
        expect(r.file).toBe('AxiomDesktop_5.2.0_aarch64.dmg')
    })

    test('win32/x64 → newest -setup.exe', () => {
        const r = resolveArtifact(INDEX_HTML, 'win32', 'x64')
        expect(r.ok).toBe(true)
        expect(r.file).toBe('AxiomDesktop_5.2.0_x64-setup.exe')
    })

    test('sorts by semver, not lexically', () => {
        const html = '<a href="AxiomDesktop_0.9.0_amd64.deb">a</a><a href="AxiomDesktop_0.10.0_amd64.deb">b</a>'
        expect(resolveArtifact(html, 'linux', 'x64').file).toBe('AxiomDesktop_0.10.0_amd64.deb')
    })

    test('unpublished platform/arch → explicit error listing what exists', () => {
        const r = resolveArtifact(INDEX_HTML, 'darwin', 'x64')
        expect(r.ok).toBe(false)
        expect(r.error).toMatch(/darwin\/x64/)
        expect(r.available).toContain('AxiomDesktop_5.2.0_aarch64.dmg')
    })

    test('empty index → error, never a guess', () => {
        const r = resolveArtifact('<html></html>', 'linux', 'x64')
        expect(r.ok).toBe(false)
        expect(r.error).toMatch(/no AxiomDesktop_\* artifacts/)
    })
})

describe('deriveApiBase()', () => {
    test('unset or production AXIOM_LAR_URL → null (the sidecar bakes prod)', () => {
        expect(deriveApiBase({})).toBeNull()
        expect(deriveApiBase({AXIOM_LAR_URL: 'https://lar.axiom.ai'})).toBeNull()
        expect(deriveApiBase({AXIOM_LAR_URL: 'https://lar.axiom.ai/'})).toBeNull()
    })

    test('a dev LAR → its /api base', () => {
        expect(deriveApiBase({AXIOM_LAR_URL: 'https://lar-yaseer.axiom.ai'})).toBe('https://lar-yaseer.axiom.ai/api')
        expect(deriveApiBase({AXIOM_LAR_URL: 'https://lar-dev.axiom.ai/'})).toBe('https://lar-dev.axiom.ai/api')
    })
})
