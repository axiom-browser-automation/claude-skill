#!/usr/bin/env node
'use strict'

/**
 * Regenerate references/action-vocabulary.json from a builder-ir checkout.
 *
 *   node tools/build-action-vocabulary.js [--source <builder-ir dir>] [--check]
 *
 * The vocabulary must describe the widgets agents can ACTUALLY author, which is
 * whatever `axiom_mcp` ships: its nested `axiom_builder_ir` submodule (the
 * default source below), not the sibling checkout of the same repo. When the
 * two disagree, an agent authors a step the compiler then rejects as unknown.
 *
 * --check exits 1 and names the drifting widgets without writing.
 */

const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const REPO_ROOT = path.resolve(__dirname, '..')
const DEFAULT_SOURCE = path.resolve(REPO_ROOT, '../axiom_mcp/axiom_builder_ir')
const TARGET = path.join(REPO_ROOT, 'plugins/axiom/skills/axiom/references/action-vocabulary.json')

const argv = process.argv.slice(2)
const check = argv.includes('--check')
const sourceArg = argv.indexOf('--source')
const sourceDir = sourceArg !== -1 ? path.resolve(argv[sourceArg + 1]) : DEFAULT_SOURCE
const sourceFile = path.join(sourceDir, 'schema/IR/IntermediateRepresentation.ts')

/**
 * The two lists are written in different styles in the same file — one JSON-ish
 * with quoted keys, one TS-idiomatic with bare keys and single quotes — so the
 * bracket-matched slice is evaluated as a JS literal rather than JSON-parsed.
 * They are pure data in a file from our own repo; nothing here is user input.
 */
function extractArray(src, name) {
  const marker = `export const ${name}: ActionDefinition[] = [`
  const start = src.indexOf(marker)
  if (start === -1) throw new Error(`${name} not found in ${sourceFile}`)
  const open = start + marker.length - 1
  let depth = 0
  for (let i = open; i < src.length; i++) {
    const ch = src[i]
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch
      i++
      while (i < src.length && src[i] !== quote) {
        if (src[i] === '\\') i++
        i++
      }
      continue
    }
    if (ch === '/' && src[i + 1] === '/') {
      i = src.indexOf('\n', i)
      if (i === -1) break
      continue
    }
    if (ch === '/' && src[i + 1] === '*') {
      i = src.indexOf('*/', i) + 1
      continue
    }
    if (ch === '[') depth++
    else if (ch === ']' && --depth === 0) {
      // eslint-disable-next-line no-new-func
      return new Function(`return ${src.slice(open, i + 1)}`)()
    }
  }
  throw new Error(`unterminated ${name} in ${sourceFile}`)
}

function sourceCommit(dir) {
  try {
    return execFileSync('git', ['-C', dir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
  } catch {
    return 'unknown'
  }
}

function names(list) {
  return new Set(list.map((a) => a.machineName).filter(Boolean))
}

if (!fs.existsSync(sourceFile)) {
  console.error(`No builder-ir source at ${sourceFile}\nPass --source <dir> pointing at the axiom_builder_ir checkout axiom_mcp ships.`)
  process.exit(1)
}

const src = fs.readFileSync(sourceFile, 'utf8')
const current = fs.existsSync(TARGET) ? JSON.parse(fs.readFileSync(TARGET, 'utf8')) : { baseActionList: [], widgetActionList: [] }

/**
 * Fields this file adds on top of the source — `isLooping`/`afterLoopUpdate` on
 * the loop widgets, which builder-ir does not carry and build-axiom.js reads.
 * The source wins for everything it defines; only keys it has no opinion on
 * survive a regeneration.
 */
function carryCuratedFields(list, previous) {
  const key = (e) => `${e.machineName || ''}|${e.action || ''}`
  const before = new Map(previous.map((e) => [key(e), e]))
  const carried = []
  for (const entry of list) {
    const old = before.get(key(entry))
    if (!old) continue
    for (const field of Object.keys(old)) {
      if (field in entry) continue
      entry[field] = old[field]
      carried.push(`${entry.machineName || entry.action}.${field}`)
    }
  }
  return carried
}

const generated = {
  _sourceCommit: sourceCommit(sourceDir),
  baseActionList: extractArray(src, 'baseActionList'),
  widgetActionList: extractArray(src, 'widgetActionList'),
}
const carried = [
  ...carryCuratedFields(generated.baseActionList, current.baseActionList || []),
  ...carryCuratedFields(generated.widgetActionList, current.widgetActionList || []),
]
const json = JSON.stringify(generated, null, 2) + '\n'
const before = names([...current.baseActionList, ...current.widgetActionList])
const after = names([...generated.baseActionList, ...generated.widgetActionList])
const removed = [...before].filter((n) => !after.has(n)).sort()
const added = [...after].filter((n) => !before.has(n)).sort()

if (check) {
  if (fs.readFileSync(TARGET, 'utf8') === json) {
    console.log('action-vocabulary.json is in sync')
    process.exit(0)
  }
  console.error('action-vocabulary.json has drifted from the shipped builder-ir')
  if (removed.length) console.error(`  documented but NOT authorable: ${removed.join(', ')}`)
  if (added.length) console.error(`  authorable but NOT documented: ${added.join(', ')}`)
  console.error('Regenerate with: node tools/build-action-vocabulary.js')
  process.exit(1)
}

fs.writeFileSync(TARGET, json)
console.log(`wrote ${path.relative(REPO_ROOT, TARGET)} from ${generated._sourceCommit.slice(0, 7)}`)
if (removed.length) console.log(`  removed (not authorable): ${removed.join(', ')}`)
if (added.length) console.log(`  added (now documented): ${added.join(', ')}`)
if (carried.length) console.log(`  kept this file's own fields: ${carried.join(', ')}`)
