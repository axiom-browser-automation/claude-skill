#!/usr/bin/env node
/**
 * CLI for the workflow registry.
 *
 * Subcommands:
 *   node workflows/index.js list                      → prints the registry as JSON
 *   node workflows/index.js dispatch --message "..."  → routes the message; prints the chosen key
 *   node workflows/index.js invoke <key> [opts-json]  → invokes a specific workflow
 *
 * Used by:
 *   - Tests (routing/registry assertions are easier via CLI than via require())
 *   - Power users who want to drive the skill without going through Claude
 *   - The future extension↔Claude live channel (see references/workflows/_architecture.md)
 */

const {list, byKey, route} = require('./WorkflowRegistry')

const args = process.argv.slice(2)
const cmd = args[0]

function flag(name) {
    const i = args.indexOf(`--${name}`)
    return i >= 0 && i + 1 < args.length ? args[i + 1] : null
}

async function main() {
    if (!cmd || cmd === '-h' || cmd === '--help') {
        usage()
        process.exit(cmd ? 0 : 2)
    }

    if (cmd === 'list') {
        console.log(JSON.stringify(list(), null, 2))
        return
    }

    if (cmd === 'dispatch') {
        const message = flag('message')
        if (!message) {
            console.error('--message is required')
            process.exit(2)
        }
        const hit = route(message)
        if (!hit) {
            console.log(JSON.stringify({matched: false, message}, null, 2))
            return
        }
        console.log(JSON.stringify({matched: true, key: hit.workflow.key, why: hit.route.why}, null, 2))
        return
    }

    if (cmd === 'invoke') {
        const key = args[1]
        if (!key) {
            console.error('workflow key is required: invoke <key> [opts-json]')
            process.exit(2)
        }
        const W = byKey(key)
        if (!W) {
            console.error(`unknown workflow: ${key}`)
            process.exit(2)
        }
        const optsJson = args[2]
        const opts = optsJson ? JSON.parse(optsJson) : {}
        const result = await W.invoke({message: '', env: process.env, opts})
        console.log(JSON.stringify(result, null, 2))
        return
    }

    console.error(`unknown command: ${cmd}`)
    usage()
    process.exit(2)
}

function usage() {
    console.log(`workflows/index.js — skill workflow CLI

Usage:
  node workflows/index.js list
  node workflows/index.js dispatch --message "user prompt"
  node workflows/index.js invoke <key> [opts-json]

See plugins/axiom/skills/axiom/references/workflows-index.md for context.
`)
}

main().catch(err => {
    console.error(`FAIL  ${err.message}`)
    process.exit(1)
})
