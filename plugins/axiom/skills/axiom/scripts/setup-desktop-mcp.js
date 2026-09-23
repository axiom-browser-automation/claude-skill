#!/usr/bin/env node
/**
 * setup-desktop-mcp.js
 *
 * The CLI-automatable leg of "install the Axiom desktop app + register its
 * MCP server with Claude" (SKILL.md Step 0.5). The desktop app bundles the
 * `axiom-mcp` stdio server as a sidecar binary whose own `setup` CLI
 * (`axiom-mcp setup save-key`, `setup status`, …) is the exact code path the
 * app's tray "Set up Claude MCP…" drives — registering through this script
 * and through the GUI are equivalent.
 *
 *   node setup-desktop-mcp.js resolve  [--platform linux|darwin|win32] [--arch x64|arm64] [--index <url>]
 *   node setup-desktop-mcp.js download [--url <artifact-url>] [--dest <dir>] [--index <url>]
 *   node setup-desktop-mcp.js extract  --appimage <path> | --deb <path> [--dest <dir>]   (Linux, no root)
 *   node setup-desktop-mcp.js register --sidecar <path-to-axiom-mcp>
 *   node setup-desktop-mcp.js verify
 *
 * `verify` compares redacted fingerprints of the key in ~/.claude/settings.json,
 * the process env, and the MCP client config (~/.claude.json) — the split-key /
 * rotation hazard behind "MCP tools answer 401". It never prints the key.
 *
 * Resolution reads the release manifest the desktop release writes next to the
 * installers: `latest.json` in the live download folder (https://axiom.ai/desktop_app/,
 * the default), or `manifest.json` in a staging folder such as the release candidates
 * at https://site.axiom.ai/axiom_desktop/rc/ (`--index <url>` / AXIOM_DESKTOP_INDEX_URL).
 * The manifest names one installer per platform with its sha256; the live Linux
 * installer is the AppImage (the .deb is built but not promoted to the live folder),
 * so `extract` takes an AppImage — `--appimage-extract` needs no FUSE and no root —
 * and still accepts a .deb from a staging folder.
 *
 * Every subcommand prints a single-line JSON result on stdout and exits 0
 * only on `{ok: true}` — the same contract as save-automation.js.
 *
 * Key handling: `register` reads AXIOM_API_KEY from the environment and
 * writes it to the sidecar's stdin. There is deliberately no --key flag —
 * argv is visible to `ps` and would land in the conversation transcript.
 * A non-default AXIOM_LAR_URL is forwarded as AXIOM_API_BASE so a dev-LAR
 * setup registers the matching backend in the client config's env block.
 */

const fs = require('fs')
const os = require('os')
const path = require('path')
const {spawn, spawnSync} = require('child_process')

const DOWNLOAD_INDEX_URL = 'https://axiom.ai/desktop_app/'
const DEFAULT_LAR_URL = 'https://lar.axiom.ai'

/** Manifest file names, tried in order: the live folder writes latest.json, a staging folder manifest.json. */
const MANIFEST_NAMES = ['latest.json', 'manifest.json']

/**
 * Manifest platform key per Node platform/arch — the keys the desktop release
 * writes (ci/jenkins-release-rc.sh in axiom_desktop). Unknown combinations get an
 * explicit error listing what the manifest offers rather than a guess.
 */
const PLATFORM_KEYS = {
    linux:  {x64: 'linux-x86_64'},
    darwin: {arm64: 'darwin-arm64', x64: 'darwin-x86_64'},
    win32:  {x64: 'windows-x86_64'}
}

/** Resolve the index to use: --index flag, then AXIOM_DESKTOP_INDEX_URL, then the published releases. */
function indexUrlFrom(flagValue, env = process.env) {
    const raw = flagValue || env.AXIOM_DESKTOP_INDEX_URL || DOWNLOAD_INDEX_URL
    return raw.endsWith('/') ? raw : raw + '/'
}

function compareSemver(a, b) {
    for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i]
    return 0
}

/** The manifest's entries as {key, file, url, sha256}; a manifest without `platforms` is empty. */
function parseManifest(manifest) {
    const platforms = manifest && typeof manifest === 'object' && manifest.platforms && typeof manifest.platforms === 'object' ? manifest.platforms : {}
    return Object.entries(platforms)
        .filter(([, v]) => v && typeof v === 'object' && typeof v.file === 'string')
        .map(([key, v]) => ({key, file: v.file, url: v.url, sha256: v.sha256}))
}

/**
 * Pick the installer for a platform from a release manifest. Pure — takes the
 * parsed manifest so it can be tested offline against the fixtures.
 */
function resolveArtifact(manifest, platform = process.platform, arch = process.arch, indexUrl = DOWNLOAD_INDEX_URL) {
    const entries = parseManifest(manifest)
    if (entries.length === 0) return {ok: false, error: `no installers listed in the release manifest at ${indexUrl}`}
    const key = PLATFORM_KEYS[platform] && PLATFORM_KEYS[platform][arch]
    const available = entries.map(e => `${e.key}: ${e.file}`)
    if (!key) return {ok: false, error: `no published desktop-app build for ${platform}/${arch}`, available}
    const hit = entries.find(e => e.key === key)
    if (!hit) return {ok: false, error: `the manifest at ${indexUrl} has no ${key} installer`, available}
    const url = hit.url || indexUrl + encodeURIComponent(hit.file)
    return {
        ok: true,
        file: hit.file,
        version: typeof manifest.version === 'string' ? manifest.version : null,
        url,
        sha256: hit.sha256 || null,
        staging: manifest.staging === true,
        platform,
        arch,
        index: indexUrl
    }
}

/** AXIOM_API_BASE the sidecar should be registered with, or null when prod (the binary's baked default). */
function deriveApiBase(env = process.env) {
    const lar = (env.AXIOM_LAR_URL || '').trim().replace(/\/$/, '')
    if (!lar || lar === DEFAULT_LAR_URL) return null
    return `${lar}/api`
}

/** The release manifest under an index URL: latest.json (live folder), else manifest.json (staging). */
async function fetchManifest(indexUrl = DOWNLOAD_INDEX_URL, fetchImpl = fetch) {
    const tried = []
    for (const name of MANIFEST_NAMES) {
        const url = indexUrl + name
        const res = await fetchImpl(url, {headers: {Accept: 'application/json'}})
        if (res.ok) return res.json()
        tried.push(`${name} → HTTP ${res.status}`)
    }
    throw new Error(`no release manifest at ${indexUrl} (${tried.join(', ')})`)
}

function sha256Of(file) {
    const {createHash} = require('crypto')
    const h = createHash('sha256')
    h.update(fs.readFileSync(file))
    return h.digest('hex')
}

async function download(url, destDir, fetchImpl = fetch, expectedSha256 = null) {
    const {pipeline} = require('stream/promises')
    const {Readable} = require('stream')
    const res = await fetchImpl(url)
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status} fetching ${url}`)
    fs.mkdirSync(destDir, {recursive: true})
    // Local name: decoded, with spaces dashed so the path is shell-friendly.
    const dest = path.resolve(destDir, decodeURIComponent(path.basename(new URL(url).pathname)).replace(/\s+/g, '-'))
    await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(dest))
    const result = {dest, bytes: fs.statSync(dest).size}
    if (expectedSha256) {
        const actual = sha256Of(dest)
        if (actual !== expectedSha256) throw new Error(`checksum mismatch for ${dest}: manifest says ${expectedSha256}, got ${actual}`)
        result.sha256 = actual
    }
    return result
}

function findSidecar(root) {
    const stack = [root]
    while (stack.length) {
        const dir = stack.pop()
        let entries
        try {
            entries = fs.readdirSync(dir, {withFileTypes: true})
        } catch (_) {
            continue
        }
        for (const e of entries) {
            const p = path.join(dir, e.name)
            if (e.isDirectory()) stack.push(p)
            else if (e.name === 'axiom-mcp' || e.name === 'axiom-mcp.exe') return p
        }
    }
    return null
}

function extractedSidecar(source, destDir) {
    const sidecar = findSidecar(destDir)
    if (!sidecar) {
        return {ok: false, error: `extracted ${source} but it bundles no axiom-mcp sidecar — this desktop-app build predates the built-in MCP server; a newer release from https://axiom.ai/install-desktop-app is needed`}
    }
    try {
        fs.chmodSync(sidecar, 0o755)
    } catch (_) {
        // best effort — the extractors normally preserve the mode
    }
    return {ok: true, sidecar, dest: destDir}
}

/** Unpack an AppImage with its own `--appimage-extract` (no FUSE, no root); the tree lands in <dest>/squashfs-root. */
function extractAppImage(appImagePath, destDir) {
    if (process.platform !== 'linux') {
        return {ok: false, error: `extract is Linux-only; on ${process.platform} install the app and use its tray "Set up Claude MCP…"`}
    }
    if (!fs.existsSync(appImagePath)) return {ok: false, error: `no such file: ${appImagePath}`}
    fs.mkdirSync(destDir, {recursive: true})
    const file = path.resolve(appImagePath)
    try {
        fs.chmodSync(file, 0o755)
    } catch (_) {
        // reported by the spawn below if it matters
    }
    const r = spawnSync(file, ['--appimage-extract'], {cwd: destDir, encoding: 'utf8', env: {...process.env, APPIMAGE_EXTRACT_AND_RUN: '1'}})
    if (r.error) return {ok: false, error: `couldn't run ${file} --appimage-extract: ${r.error.message} (a noexec mount? copy the AppImage somewhere executable)`}
    if (r.status !== 0) return {ok: false, error: `--appimage-extract failed (exit ${r.status}): ${(r.stderr || r.stdout || '').trim().slice(-400)}`}
    return extractedSidecar(appImagePath, destDir)
}

/** Unpack a .deb (staging folders still ship one) with dpkg-deb -x, no root. */
function extractDeb(debPath, destDir) {
    if (process.platform !== 'linux') {
        return {ok: false, error: `extract is Linux-only (dpkg-deb); on ${process.platform} install the app and use its tray "Set up Claude MCP…"`}
    }
    if (!fs.existsSync(debPath)) return {ok: false, error: `no such file: ${debPath}`}
    fs.mkdirSync(destDir, {recursive: true})
    const r = spawnSync('dpkg-deb', ['-x', debPath, destDir], {encoding: 'utf8'})
    if (r.error) return {ok: false, error: `dpkg-deb not runnable: ${r.error.message}`}
    if (r.status !== 0) return {ok: false, error: `dpkg-deb failed (exit ${r.status}): ${(r.stderr || '').trim()}`}
    return extractedSidecar(debPath, destDir)
}

/** Pick the extractor by file name: .AppImage or .deb. */
function extractBundle(bundlePath, destDir) {
    if (/\.appimage$/i.test(bundlePath)) return extractAppImage(bundlePath, destDir)
    if (/\.deb$/i.test(bundlePath)) return extractDeb(bundlePath, destDir)
    return {ok: false, error: `don't know how to extract ${bundlePath} — expected an .AppImage (the published Linux installer) or a .deb`}
}

/**
 * Run `<sidecar> setup save-key --json` with the key on stdin. The sidecar's
 * JSON (which files were written, whether Claude Code registered, the
 * key-redacted `claude mcp add` hint when the CLI is absent) is relayed as-is.
 */
function register(sidecarPath, env = process.env) {
    return new Promise(resolve => {
        const key = (env.AXIOM_API_KEY || '').trim()
        if (!key) {
            return resolve({ok: false, error: 'AXIOM_API_KEY is not set in the environment — finish Step 0 first (the key is never accepted as an argument)'})
        }
        if (!sidecarPath || !fs.existsSync(sidecarPath)) return resolve({ok: false, error: `no such sidecar: ${sidecarPath}`})

        const childEnv = {...env}
        const apiBase = deriveApiBase(env)
        if (apiBase && !childEnv.AXIOM_API_BASE) childEnv.AXIOM_API_BASE = apiBase

        let child
        try {
            child = spawn(sidecarPath, ['setup', 'save-key', '--json'], {env: childEnv, stdio: ['pipe', 'pipe', 'pipe']})
        } catch (err) {
            return resolve({ok: false, error: `couldn't run ${sidecarPath}: ${err.message}`})
        }
        let stdout = ''
        let stderr = ''
        child.stdout.on('data', d => { stdout += d })
        child.stderr.on('data', d => { stderr += d })
        child.on('error', err => resolve({ok: false, error: `couldn't run ${sidecarPath}: ${err.message}`}))
        child.on('close', code => {
            let payload = null
            try {
                payload = JSON.parse(stdout.trim().split('\n').pop())
            } catch (_) {
                payload = null
            }
            if (payload && typeof payload === 'object') {
                resolve({...payload, ok: payload.ok !== false && code === 0, exitCode: code, apiBase: apiBase || undefined})
            } else {
                resolve({ok: code === 0, exitCode: code, error: code === 0 ? undefined : (stderr || stdout || `exit ${code}`).trim()})
            }
        })
        child.stdin.on('error', () => { /* sidecar exited before reading — reported via close */ })
        child.stdin.end(key + '\n')
    })
}

/** "axm_…(len 24)" — enough for a human to compare keys without ever seeing one. */
function keyFingerprint(key) {
    const k = (key || '').trim()
    if (!k) return null
    return `${k.slice(0, 4)}…(len ${k.length})`
}

function readJsonSafe(p) {
    try {
        return JSON.parse(fs.readFileSync(p, 'utf8'))
    } catch (_) {
        return null
    }
}

/**
 * Compare every place the key lives: the canonical source (settings.json env
 * block), the process env (what the skill's scripts use right now), and the
 * delivery copy the MCP server is actually launched with (~/.claude.json,
 * written by `register` / the app's tray setup). A mismatch is the usual cause
 * of "MCP tools answer 401": a key was minted or re-pasted after registration.
 */
function verifyKeys({home = os.homedir(), env = process.env} = {}) {
    const settingsJson = readJsonSafe(path.join(home, '.claude', 'settings.json'))
    const claudeJson = readJsonSafe(path.join(home, '.claude.json'))
    const keys = {
        settings: (settingsJson && settingsJson.env && settingsJson.env.AXIOM_API_KEY) || null,
        processEnv: env.AXIOM_API_KEY || null,
        mcpConfig: (claudeJson && claudeJson.mcpServers && claudeJson.mcpServers.axiom && claudeJson.mcpServers.axiom.env && claudeJson.mcpServers.axiom.env.AXIOM_API_KEY) || null
    }
    const fingerprints = {}
    for (const [name, k] of Object.entries(keys)) fingerprints[name] = keyFingerprint(k)
    const present = Object.values(keys).filter(Boolean).map(k => k.trim())
    const mismatch = new Set(present).size > 1
    const registered = Boolean(keys.mcpConfig)
    const result = {ok: !mismatch && registered, registered, mismatch, fingerprints}
    if (!registered) {
        result.error = 'no axiom MCP server registered for Claude Code (~/.claude.json has no mcpServers.axiom) — run the register subcommand or the app\'s tray "Set up Claude MCP…"'
    } else if (mismatch) {
        result.error = 'the keys disagree — the MCP server was registered with a different key than the one in use (minting a key rotates it and silently breaks the registered copy). Re-run register (or the tray setup) with the current key, then restart Claude Code.'
    }
    return result
}

module.exports = {parseManifest, compareSemver, resolveArtifact, deriveApiBase, indexUrlFrom, fetchManifest, download, extractBundle, extractAppImage, extractDeb, findSidecar, register, keyFingerprint, verifyKeys, DOWNLOAD_INDEX_URL, MANIFEST_NAMES, PLATFORM_KEYS}

// ---- CLI ----
function flag(args, name) {
    const i = args.indexOf(`--${name}`)
    return i >= 0 && i + 1 < args.length ? args[i + 1] : null
}

function emit(result) {
    console.log(JSON.stringify(result))
}

async function main(argv) {
    const cmd = argv[0]
    if (!cmd || cmd === '-h' || cmd === '--help') {
        usage()
        return cmd ? 0 : 2
    }
    if (argv.includes('--key')) {
        emit({ok: false, error: '--key is not accepted: export AXIOM_API_KEY instead, so the key never touches argv or the transcript'})
        return 2
    }

    switch (cmd) {
        case 'resolve': {
            const index = indexUrlFrom(flag(argv, 'index'))
            const r = resolveArtifact(await fetchManifest(index), flag(argv, 'platform') || process.platform, flag(argv, 'arch') || process.arch, index)
            emit(r)
            return r.ok ? 0 : 1
        }
        case 'download': {
            let url = flag(argv, 'url')
            let sha256 = null
            if (!url) {
                const index = indexUrlFrom(flag(argv, 'index'))
                const r = resolveArtifact(await fetchManifest(index), process.platform, process.arch, index)
                if (!r.ok) {
                    emit(r)
                    return 1
                }
                url = r.url
                sha256 = r.sha256
            }
            const d = await download(url, flag(argv, 'dest') || process.cwd(), fetch, sha256)
            emit({ok: true, url, ...d})
            return 0
        }
        case 'extract': {
            const bundle = flag(argv, 'appimage') || flag(argv, 'deb')
            if (!bundle) {
                emit({ok: false, error: '--appimage <path> (or --deb <path>) is required'})
                return 2
            }
            const r = extractBundle(bundle, flag(argv, 'dest') || path.join(os.homedir(), '.axiom-desktop'))
            emit(r)
            return r.ok ? 0 : 1
        }
        case 'verify': {
            const r = verifyKeys()
            emit(r)
            return r.ok ? 0 : 1
        }
        case 'register': {
            const sidecar = flag(argv, 'sidecar')
            if (!sidecar) {
                emit({ok: false, error: '--sidecar <path-to-axiom-mcp> is required'})
                return 2
            }
            const r = await register(sidecar)
            emit(r)
            return r.ok ? 0 : 1
        }
        default:
            emit({ok: false, error: `unknown command: ${cmd}`})
            usage()
            return 2
    }
}

function usage() {
    console.error(`setup-desktop-mcp.js — install the Axiom desktop app's MCP server and register it with Claude

Usage:
  node setup-desktop-mcp.js resolve  [--platform linux|darwin|win32] [--arch x64|arm64] [--index <url>]
  node setup-desktop-mcp.js download [--url <artifact-url>] [--dest <dir>] [--index <url>]
  node setup-desktop-mcp.js extract  --appimage <path> | --deb <path> [--dest <dir>]
  AXIOM_API_KEY=... node setup-desktop-mcp.js register --sidecar <path-to-axiom-mcp>
  node setup-desktop-mcp.js verify

Output (stdout, single-line JSON; exit code 0 only on ok), e.g.
  {"ok": true, "file": "axiom-desktop-linux-5.2.0.AppImage", "url": "https://axiom.ai/desktop_app/axiom-desktop-linux-5.2.0.AppImage", "sha256": "…"}
  {"ok": false, "error": "AXIOM_API_KEY is not set in the environment — …"}

Env:
  AXIOM_API_KEY             the user's API key; sent to the sidecar over stdin (never argv). Required by register.
  AXIOM_LAR_URL             base URL; a non-default value is forwarded to the registration as AXIOM_API_BASE.
  AXIOM_DESKTOP_INDEX_URL   folder whose release manifest resolve/download read: latest.json, else manifest.json
                            (default https://axiom.ai/desktop_app/; release candidates: https://site.axiom.ai/axiom_desktop/rc/). --index wins.
`)
}

if (require.main === module) {
    main(process.argv.slice(2))
        .then(code => process.exit(code))
        .catch(err => {
            emit({ok: false, error: err.message})
            process.exit(1)
        })
}
