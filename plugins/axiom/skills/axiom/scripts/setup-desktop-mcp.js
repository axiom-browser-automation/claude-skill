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
 *   node setup-desktop-mcp.js resolve  [--platform linux|darwin|win32] [--arch x64|arm64]
 *   node setup-desktop-mcp.js download [--url <artifact-url>] [--dest <dir>]
 *   node setup-desktop-mcp.js extract  --deb <path> [--dest <dir>]        (Linux: dpkg-deb -x, no root)
 *   node setup-desktop-mcp.js register --sidecar <path-to-axiom-mcp>
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

const DOWNLOAD_INDEX_URL = 'https://axiom.ai/axiom_desktop/'
const DEFAULT_LAR_URL = 'https://lar.axiom.ai'

/**
 * Artifact suffix per platform/arch — only what Jenkins actually publishes to
 * the index today (Linux x86_64, macOS Apple Silicon, Windows x64; see
 * test/scripts/fixtures/axiom-desktop-index.html). Unknown combinations get
 * an explicit error listing what exists rather than a guess.
 */
const ARTIFACTS = {
    linux:  {x64: '_amd64.deb'},
    darwin: {arm64: '_aarch64.dmg'},
    win32:  {x64: '_x64-setup.exe'}
}

/** Distinct AxiomDesktop_* filenames linked from the (Apache-style) index page. */
function parseIndex(html) {
    const files = new Set()
    const re = /href="(AxiomDesktop_\d+\.\d+\.\d+_[^"/]+)"/g
    let m
    while ((m = re.exec(html)) !== null) files.add(m[1])
    return [...files]
}

function parseVersion(file) {
    const m = /^AxiomDesktop_(\d+)\.(\d+)\.(\d+)_/.exec(file)
    return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null
}

function compareSemver(a, b) {
    for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i]
    return 0
}

/**
 * Pick the newest published artifact for a platform. Pure — takes the index
 * HTML so it can be tested offline against a fixture.
 */
function resolveArtifact(html, platform = process.platform, arch = process.arch, indexUrl = DOWNLOAD_INDEX_URL) {
    const files = parseIndex(html)
    if (files.length === 0) return {ok: false, error: `no AxiomDesktop_* artifacts found at ${indexUrl}`}
    const suffix = ARTIFACTS[platform] && ARTIFACTS[platform][arch]
    if (!suffix) return {ok: false, error: `no published desktop-app build for ${platform}/${arch}`, available: files}
    const candidates = files.filter(f => f.endsWith(suffix) && parseVersion(f))
    if (candidates.length === 0) return {ok: false, error: `no ${suffix} artifact in the index`, available: files}
    candidates.sort((a, b) => compareSemver(parseVersion(a), parseVersion(b)))
    const file = candidates[candidates.length - 1]
    return {ok: true, file, version: parseVersion(file).join('.'), url: indexUrl + file, platform, arch}
}

/** AXIOM_API_BASE the sidecar should be registered with, or null when prod (the binary's baked default). */
function deriveApiBase(env = process.env) {
    const lar = (env.AXIOM_LAR_URL || '').trim().replace(/\/$/, '')
    if (!lar || lar === DEFAULT_LAR_URL) return null
    return `${lar}/api`
}

async function fetchIndex(indexUrl = DOWNLOAD_INDEX_URL, fetchImpl = fetch) {
    const res = await fetchImpl(indexUrl, {headers: {Accept: 'text/html'}})
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${indexUrl}`)
    return res.text()
}

async function download(url, destDir, fetchImpl = fetch) {
    const {pipeline} = require('stream/promises')
    const {Readable} = require('stream')
    const res = await fetchImpl(url)
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status} fetching ${url}`)
    fs.mkdirSync(destDir, {recursive: true})
    const dest = path.resolve(destDir, path.basename(new URL(url).pathname))
    await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(dest))
    return {dest, bytes: fs.statSync(dest).size}
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

function extractDeb(debPath, destDir) {
    if (process.platform !== 'linux') {
        return {ok: false, error: `extract is Linux-only (dpkg-deb); on ${process.platform} install the app and use its tray "Set up Claude MCP…"`}
    }
    if (!fs.existsSync(debPath)) return {ok: false, error: `no such file: ${debPath}`}
    fs.mkdirSync(destDir, {recursive: true})
    const r = spawnSync('dpkg-deb', ['-x', debPath, destDir], {encoding: 'utf8'})
    if (r.error) return {ok: false, error: `dpkg-deb not runnable: ${r.error.message}`}
    if (r.status !== 0) return {ok: false, error: `dpkg-deb failed (exit ${r.status}): ${(r.stderr || '').trim()}`}
    const sidecar = findSidecar(destDir)
    if (!sidecar) {
        return {ok: false, error: `extracted ${debPath} but it bundles no axiom-mcp sidecar — this desktop-app build predates the built-in MCP server; a newer release from https://axiom.ai/install-desktop-app is needed`}
    }
    try {
        fs.chmodSync(sidecar, 0o755)
    } catch (_) {
        // best effort — dpkg-deb normally preserves the mode
    }
    return {ok: true, sidecar, dest: destDir}
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

module.exports = {parseIndex, compareSemver, resolveArtifact, deriveApiBase, fetchIndex, download, extractDeb, findSidecar, register, DOWNLOAD_INDEX_URL, ARTIFACTS}

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
            const r = resolveArtifact(await fetchIndex(), flag(argv, 'platform') || process.platform, flag(argv, 'arch') || process.arch)
            emit(r)
            return r.ok ? 0 : 1
        }
        case 'download': {
            let url = flag(argv, 'url')
            if (!url) {
                const r = resolveArtifact(await fetchIndex())
                if (!r.ok) {
                    emit(r)
                    return 1
                }
                url = r.url
            }
            const d = await download(url, flag(argv, 'dest') || process.cwd())
            emit({ok: true, url, ...d})
            return 0
        }
        case 'extract': {
            const deb = flag(argv, 'deb')
            if (!deb) {
                emit({ok: false, error: '--deb <path> is required'})
                return 2
            }
            const r = extractDeb(deb, flag(argv, 'dest') || path.join(os.homedir(), '.axiom-desktop'))
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
  node setup-desktop-mcp.js resolve  [--platform linux|darwin|win32] [--arch x64|arm64]
  node setup-desktop-mcp.js download [--url <artifact-url>] [--dest <dir>]
  node setup-desktop-mcp.js extract  --deb <path> [--dest <dir>]
  AXIOM_API_KEY=... node setup-desktop-mcp.js register --sidecar <path-to-axiom-mcp>

Output (stdout, single-line JSON; exit code 0 only on ok), e.g.
  {"ok": true, "file": "AxiomDesktop_5.2.0_amd64.deb", "url": "https://axiom.ai/axiom_desktop/AxiomDesktop_5.2.0_amd64.deb"}
  {"ok": false, "error": "AXIOM_API_KEY is not set in the environment — …"}

Env:
  AXIOM_API_KEY   the user's API key; sent to the sidecar over stdin (never argv). Required by register.
  AXIOM_LAR_URL   base URL; a non-default value is forwarded to the registration as AXIOM_API_BASE.
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
