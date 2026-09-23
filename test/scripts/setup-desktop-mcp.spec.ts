/**
 * setup-desktop-mcp.js — the pure parts (installer resolution from the release
 * manifest, API-base derivation, key verification). The fixtures are verbatim
 * copies of https://axiom.ai/desktop_app/latest.json (the promoted release) and
 * https://axiom.ai/axiom_desktop/rc/manifest.json (a staged release candidate)
 * taken 2026-09-23; the manifest names one installer per platform, so there is
 * no semver pick — the manifest IS the resolution.
 */
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
// @ts-expect-error — pure JS module
import {parseManifest, resolveArtifact, deriveApiBase, indexUrlFrom, keyFingerprint, verifyKeys, DOWNLOAD_INDEX_URL, MANIFEST_NAMES} from '../../plugins/axiom/skills/axiom/scripts/setup-desktop-mcp.js'

const LATEST = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'desktop-latest.json'), 'utf8'))
const RC = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'desktop-rc-manifest.json'), 'utf8'))
const RC_INDEX = 'https://site.axiom.ai/axiom_desktop/rc/'

describe('parseManifest()', () => {
    test('one entry per platform key, each with file, url and sha256', () => {
        const entries = parseManifest(LATEST)
        expect(entries.map((e: {key: string}) => e.key).sort()).toEqual(['darwin-arm64', 'darwin-x86_64', 'linux-x86_64', 'windows-x86_64'])
        for (const e of entries) {
            expect(e.file).toMatch(/^axiom-desktop-/)
            expect(e.url).toBe(`https://axiom.ai/desktop_app/${e.file}`)
            expect(e.sha256).toMatch(/^[0-9a-f]{64}$/)
        }
    })
    test('a manifest without platforms is empty, never a throw', () => {
        expect(parseManifest({})).toEqual([])
        expect(parseManifest(null)).toEqual([])
        expect(parseManifest({platforms: {bad: 'x'}})).toEqual([])
    })
})

describe('resolveArtifact()', () => {
    test('linux/x64 → the AppImage (the live folder carries no .deb)', () => {
        const r = resolveArtifact(LATEST, 'linux', 'x64')
        expect(r.ok).toBe(true)
        expect(r.file).toBe('axiom-desktop-linux-5.2.0.AppImage')
        expect(r.url).toBe(DOWNLOAD_INDEX_URL + 'axiom-desktop-linux-5.2.0.AppImage')
        expect(r.version).toBe('5.2.0')
        expect(r.sha256).toMatch(/^[0-9a-f]{64}$/)
        expect(r.staging).toBe(false)
    })
    test('both Mac builds and Windows resolve', () => {
        expect(resolveArtifact(LATEST, 'darwin', 'arm64').file).toBe('axiom-desktop-mac-5.2.0.dmg')
        expect(resolveArtifact(LATEST, 'darwin', 'x64').file).toBe('axiom-desktop-mac-intel-5.2.0.dmg')
        expect(resolveArtifact(LATEST, 'win32', 'x64').file).toBe('axiom-desktop-win-5.2.0.exe')
    })
    test('unpublished platform/arch → explicit error listing what exists', () => {
        const r = resolveArtifact(LATEST, 'linux', 'arm64')
        expect(r.ok).toBe(false)
        expect(r.error).toMatch(/linux\/arm64/)
        expect(r.available.join(' ')).toContain('linux-x86_64: axiom-desktop-linux-5.2.0.AppImage')
    })
    test('empty manifest → error, never a guess', () => {
        const r = resolveArtifact({version: '9.9.9', platforms: {}}, 'linux', 'x64')
        expect(r.ok).toBe(false)
        expect(r.error).toMatch(/no installers listed/)
    })
    test('a manifest entry without a url gets one built from the index', () => {
        const r = resolveArtifact({version: '1.0.0', platforms: {'linux-x86_64': {file: 'Axiom Desktop_1.0.0_amd64.AppImage'}}}, 'linux', 'x64', RC_INDEX)
        expect(r.url).toBe(RC_INDEX + 'Axiom%20Desktop_1.0.0_amd64.AppImage')
        expect(r.sha256).toBeNull()
    })
})

describe('release-candidate folder (https://site.axiom.ai/axiom_desktop/rc/manifest.json)', () => {
    test('resolves the staged AppImage with its encoded URL and flags staging', () => {
        const r = resolveArtifact(RC, 'linux', 'x64', RC_INDEX)
        expect(r.ok).toBe(true)
        expect(r.file).toBe('Axiom Desktop_5.2.0_amd64.AppImage')
        expect(r.url).toBe('https://axiom.ai/axiom_desktop/rc/Axiom%20Desktop_5.2.0_amd64.AppImage')
        expect(r.staging).toBe(true)
        expect(r.index).toBe(RC_INDEX)
    })
    test('the staged .deb is listed but never the Linux pick', () => {
        expect(parseManifest(RC).map((e: {key: string}) => e.key)).toContain('linux-deb')
        expect(resolveArtifact(RC, 'linux', 'x64', RC_INDEX).file).toMatch(/\.AppImage$/)
    })
    test('manifest names: the live folder first, then a staging folder', () => {
        expect(MANIFEST_NAMES).toEqual(['latest.json', 'manifest.json'])
    })
    test('indexUrlFrom(): --index wins, then AXIOM_DESKTOP_INDEX_URL, then the published folder; trailing slash normalised', () => {
        expect(indexUrlFrom(null, {})).toBe(DOWNLOAD_INDEX_URL)
        expect(DOWNLOAD_INDEX_URL).toBe('https://axiom.ai/desktop_app/')
        expect(indexUrlFrom(null, {AXIOM_DESKTOP_INDEX_URL: 'https://site.axiom.ai/axiom_desktop/rc'})).toBe(RC_INDEX)
        expect(indexUrlFrom('https://example.test/idx/', {AXIOM_DESKTOP_INDEX_URL: RC_INDEX})).toBe('https://example.test/idx/')
    })
})

describe('deriveApiBase()', () => {
    test('unset or production AXIOM_LAR_URL → null (the sidecar bakes prod)', () => {
        expect(deriveApiBase({})).toBeNull()
        expect(deriveApiBase({AXIOM_LAR_URL: 'https://lar.axiom.ai'})).toBeNull()
        expect(deriveApiBase({AXIOM_LAR_URL: 'https://lar.axiom.ai/'})).toBeNull()
    })

    test('a dev LAR → its /api base', () => {
        expect(deriveApiBase({AXIOM_LAR_URL: 'https://lar-staging.example.com'})).toBe('https://lar-staging.example.com/api')
        expect(deriveApiBase({AXIOM_LAR_URL: 'https://lar-dev.example.com/'})).toBe('https://lar-dev.example.com/api')
    })
})

describe('key verification (the split-key / rotation hazard behind MCP 401s)', () => {
    function fakeHome(settingsKey: string | null, mcpKey: string | null): string {
        const home = fs.mkdtempSync(path.join(os.tmpdir(), 'axiom-verify-'))
        fs.mkdirSync(path.join(home, '.claude'), {recursive: true})
        if (settingsKey !== null) {
            fs.writeFileSync(path.join(home, '.claude', 'settings.json'), JSON.stringify({env: {AXIOM_API_KEY: settingsKey}}))
        }
        if (mcpKey !== null) {
            fs.writeFileSync(path.join(home, '.claude.json'), JSON.stringify({mcpServers: {axiom: {command: 'x', env: {AXIOM_API_KEY: mcpKey}}}}))
        } else {
            fs.writeFileSync(path.join(home, '.claude.json'), JSON.stringify({mcpServers: {}}))
        }
        return home
    }

    test('keyFingerprint never exposes the key', () => {
        expect(keyFingerprint('axm_abcdefghijklmnopqrst')).toBe('axm_…(len 24)')
        expect(keyFingerprint('  axm_short  ')).toBe('axm_…(len 9)')
        expect(keyFingerprint('')).toBeNull()
        expect(keyFingerprint(undefined)).toBeNull()
    })

    test('all sources agree → ok', () => {
        const k = 'axm_abcdefghijklmnopqrst'
        const r = verifyKeys({home: fakeHome(k, k), env: {AXIOM_API_KEY: k}})
        expect(r).toMatchObject({ok: true, registered: true, mismatch: false})
        expect(JSON.stringify(r)).not.toContain(k)
    })

    test('MCP holds a different (rotated) key → mismatch, remediation names re-register', () => {
        const r = verifyKeys({home: fakeHome('axm_new_keyaaaaaaaaaaaaa', 'axm_old_keybbbbbbbbbbbbb'), env: {}})
        expect(r.ok).toBe(false)
        expect(r.mismatch).toBe(true)
        expect(r.error).toMatch(/rotates|Re-run register/i)
        expect(JSON.stringify(r)).not.toMatch(/axm_new_keyaaaaaaaaaaaaa|axm_old_keybbbbbbbbbbbbb/)
    })

    test('no MCP registration → ok:false, registered:false', () => {
        const r = verifyKeys({home: fakeHome('axm_new_keyaaaaaaaaaaaaa', null), env: {}})
        expect(r).toMatchObject({ok: false, registered: false})
        expect(r.error).toMatch(/register/i)
    })
})
