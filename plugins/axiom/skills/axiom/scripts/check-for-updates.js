#!/usr/bin/env node
/**
 * check-for-updates.js
 *
 * Best-effort upstream version probe. SKILL.md Step −1 runs this once per
 * conversation; if a newer version is published on `main`, the script
 * prints a single machine-readable line that Claude surfaces to the user
 * as an update prompt. On any failure — missing tools, network down,
 * non-zero remote response — the script exits 0 with no output so the
 * conversation isn't interrupted.
 *
 * Output contract (stdout):
 *   UPDATE_AVAILABLE current=<semver> latest=<semver>
 *
 *   …or nothing at all.
 *
 * Env overrides (mostly for testing):
 *   LOCAL_VERSION_OVERRIDE   — pretend the installed version is this
 *   REMOTE_VERSION_OVERRIDE  — short-circuit the remote fetch with this value
 *   GITHUB_TOKEN             — used by the curl fallback if set
 *
 * Exit code: always 0.
 */

const {readFileSync, existsSync} = require('node:fs')
const {execFileSync} = require('node:child_process')
const {resolve, dirname} = require('node:path')

const REMOTE_OWNER = 'axiom-browser-automation'
const REMOTE_REPO = 'claude-skill'
const REMOTE_BRANCH = 'main'
const REMOTE_PATH = 'plugins/axiom/.claude-plugin/plugin.json'
const TIMEOUT_MS = 5000

/**
 * Read the locally-installed plugin version. Walks up from the script's own
 * dir to find `.claude-plugin/plugin.json`. Returns null if it can't.
 *
 * @param {object} [opts]
 * @param {string} [opts.startDir]              base path; defaults to __dirname
 * @param {Function} [opts.readFileImpl]        readFileSync override for tests
 * @param {Function} [opts.existsImpl]          existsSync override for tests
 * @param {Object<string,string>} [opts.env]    env vars (honours LOCAL_VERSION_OVERRIDE)
 * @returns {string|null}
 */
function readLocalVersion(opts = {}) {
    const env = opts.env || process.env
    if (env.LOCAL_VERSION_OVERRIDE) return env.LOCAL_VERSION_OVERRIDE
    const startDir = opts.startDir || __dirname
    const readImpl = opts.readFileImpl || readFileSync
    const existsImpl = opts.existsImpl || existsSync

    // Walk up to 6 levels looking for plugin.json under .claude-plugin/.
    let dir = startDir
    for (let i = 0; i < 6; i++) {
        const candidate = resolve(dir, '..', '.claude-plugin', 'plugin.json')
        if (existsImpl(candidate)) {
            try {
                const parsed = JSON.parse(readImpl(candidate, 'utf8'))
                return parsed.version || null
            } catch (_) {
                return null
            }
        }
        const parent = dirname(dir)
        if (parent === dir) break
        dir = parent
    }
    return null
}

/**
 * Fetch the remote plugin.json's version field. Tries `gh` first (best for
 * authed private-repo access), then unauthenticated curl (works once the
 * repo is public OR if GITHUB_TOKEN is set). Honours REMOTE_VERSION_OVERRIDE
 * for tests so we don't make network calls in the suite.
 *
 * @param {object} [opts]
 * @param {Function} [opts.execImpl]   execFileSync override for tests
 * @param {Object<string,string>} [opts.env]
 * @param {number} [opts.timeoutMs]
 * @returns {string|null}
 */
function fetchRemoteVersion(opts = {}) {
    const env = opts.env || process.env
    if (env.REMOTE_VERSION_OVERRIDE) return env.REMOTE_VERSION_OVERRIDE

    const exec = opts.execImpl || execFileSync
    const timeout = opts.timeoutMs || TIMEOUT_MS

    // Attempt 1: gh CLI. Uses the user's existing gh auth — works for private repos.
    try {
        const out = exec('gh', [
            'api',
            `repos/${REMOTE_OWNER}/${REMOTE_REPO}/contents/${REMOTE_PATH}`,
            '-H', 'Accept: application/vnd.github.raw',
            '--method', 'GET'
        ], {timeout, stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8'})
        const parsed = JSON.parse(out)
        if (parsed && parsed.version) return parsed.version
    } catch (_) { /* fall through */ }

    // Attempt 2: curl against the public raw URL. Pass a token if one is set.
    try {
        const url = `https://raw.githubusercontent.com/${REMOTE_OWNER}/${REMOTE_REPO}/${REMOTE_BRANCH}/${REMOTE_PATH}`
        const args = ['-fsSL', '--max-time', String(Math.floor(timeout / 1000))]
        if (env.GITHUB_TOKEN) {
            args.push('-H', `Authorization: Bearer ${env.GITHUB_TOKEN}`)
        }
        args.push(url)
        const out = exec('curl', args, {timeout, stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8'})
        const parsed = JSON.parse(out)
        if (parsed && parsed.version) return parsed.version
    } catch (_) { /* fall through */ }

    return null
}

/**
 * Numeric semver comparison. Returns -1 if a<b, 0 if equal, 1 if a>b.
 * Treats invalid input as equal (so we don't raise false alarms on
 * pre-release tags or unexpected shapes).
 *
 * @param {string} a
 * @param {string} b
 * @returns {-1|0|1}
 */
function compareSemver(a, b) {
    const parse = (s) => {
        if (typeof s !== 'string') return null
        const parts = s.split('.').map(p => parseInt(p, 10))
        if (parts.length === 0 || parts.some(n => Number.isNaN(n))) return null
        return parts
    }
    const ax = parse(a)
    const bx = parse(b)
    if (!ax || !bx) return 0
    const len = Math.max(ax.length, bx.length)
    for (let i = 0; i < len; i++) {
        const aPart = ax[i] || 0
        const bPart = bx[i] || 0
        if (aPart < bPart) return -1
        if (aPart > bPart) return 1
    }
    return 0
}

/**
 * Build the user-visible message. Empty string when no update is warranted.
 *
 * @param {string|null} current
 * @param {string|null} latest
 * @returns {string}
 */
function formatOutput(current, latest) {
    if (!current || !latest) return ''
    if (compareSemver(current, latest) < 0) {
        return `UPDATE_AVAILABLE current=${current} latest=${latest}`
    }
    return ''
}

module.exports = {readLocalVersion, fetchRemoteVersion, compareSemver, formatOutput}

if (require.main === module) {
    const current = readLocalVersion()
    const latest = fetchRemoteVersion()
    const msg = formatOutput(current, latest)
    if (msg) console.log(msg)
    process.exit(0)
}
