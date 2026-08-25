/**
 * setup-desktop-mcp.js — the pure parts (artifact resolution against the
 * published index, API-base derivation). The index fixture is a verbatim
 * copy of https://axiom.ai/axiom_desktop/ (2026-08-24); there is no
 * `latest` pointer upstream, so the semver pick IS the resolution logic.
 */

import * as fs from 'fs'
import * as path from 'path'

// @ts-expect-error — pure JS module
import {parseIndex, resolveArtifact, deriveApiBase, indexUrlFrom, DOWNLOAD_INDEX_URL} from '../../plugins/axiom/skills/axiom/scripts/setup-desktop-mcp.js'

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

describe('release-candidate index (https://site.axiom.ai/axiom_desktop/rc/)', () => {
    // Builds since the display-name change are "Axiom Desktop_<ver>_…" — URL-encoded in hrefs.
    const RC_HTML = '<a href="Axiom%20Desktop_5.2.0_aarch64.dmg">a</a><a href="Axiom%20Desktop_5.2.0_amd64.AppImage">b</a><a href="Axiom%20Desktop_5.2.0_amd64.deb">c</a>'
    const RC_INDEX = 'https://site.axiom.ai/axiom_desktop/rc/'

    test('parses the URL-encoded "Axiom Desktop_" naming alongside the classic one', () => {
        expect(parseIndex(RC_HTML)).toEqual(['Axiom%20Desktop_5.2.0_aarch64.dmg', 'Axiom%20Desktop_5.2.0_amd64.AppImage', 'Axiom%20Desktop_5.2.0_amd64.deb'])
        expect(parseIndex('<a href="Axiom Desktop_5.3.0_amd64.deb">x</a><a href="AxiomDesktop_5.2.0_amd64.deb">y</a>')).toHaveLength(2)
    })

    test('resolves against the RC index and builds the encoded URL + decoded name', () => {
        const r = resolveArtifact(RC_HTML, 'linux', 'x64', RC_INDEX)
        expect(r.ok).toBe(true)
        expect(r.url).toBe(RC_INDEX + 'Axiom%20Desktop_5.2.0_amd64.deb')
        expect(r.name).toBe('Axiom Desktop_5.2.0_amd64.deb')
        expect(r.version).toBe('5.2.0')
        expect(r.index).toBe(RC_INDEX)
        expect(resolveArtifact(RC_HTML, 'darwin', 'arm64', RC_INDEX).file).toBe('Axiom%20Desktop_5.2.0_aarch64.dmg')
    })

    test('no Windows build in the RC → explicit error, not a guess', () => {
        expect(resolveArtifact(RC_HTML, 'win32', 'x64', RC_INDEX).ok).toBe(false)
    })

    test('indexUrlFrom(): --index wins, then AXIOM_DESKTOP_INDEX_URL, then the published index; trailing slash normalised', () => {
        expect(indexUrlFrom(null, {})).toBe(DOWNLOAD_INDEX_URL)
        expect(indexUrlFrom(null, {AXIOM_DESKTOP_INDEX_URL: 'https://site.axiom.ai/axiom_desktop/rc'})).toBe(RC_INDEX)
        expect(indexUrlFrom('https://example.test/idx/', {AXIOM_DESKTOP_INDEX_URL: RC_INDEX})).toBe('https://example.test/idx/')
    })
})
