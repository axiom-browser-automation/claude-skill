#!/usr/bin/env node
/**
 * validate-coded.js
 *
 * Parse a Claude-emitted @axiom_ai/api script with acorn and enforce:
 *  1. Method allowlist — only methods in axiom-api-method-allowlist.json may be called on AxiomApi instances.
 *  2. No private callees — _-prefixed methods are blocked.
 *  3. Import surface — only `'@axiom_ai/api'` allowed for the SDK; no subpath escapes.
 *  4. Lifecycle — every browserOpen() must have a matching browserClose() reachable in a finally block.
 *  5. No hardcoded tokens — string literals to `new AxiomApi(...)` are rejected; require process.env.
 *  6. Syntactic soundness — acorn must parse without errors.
 *
 *   node validate-coded.js path/to/script.js
 *
 * Exit 0 on pass; 1 on validation failure; 2 on usage error.
 */

const {readFileSync, existsSync} = require('node:fs')
const {resolve} = require('node:path')
const acorn = require('acorn')
const walk = require('acorn-walk')

const ALLOWLIST_PATH = resolve(__dirname, '..', 'references', 'axiom-api-method-allowlist.json')
const BLOCKLIST_PATH = resolve(__dirname, '..', 'references', 'axiom-api-method-blocklist.json')

const ALLOWLIST = loadMethodList(ALLOWLIST_PATH)
const BLOCKLIST = loadMethodList(BLOCKLIST_PATH)

function loadMethodList(path) {
    const j = JSON.parse(readFileSync(path, 'utf8'))
    const out = new Set()
    for (const [key, val] of Object.entries(j)) {
        if (key.startsWith('_')) continue        // skip metadata keys
        if (Array.isArray(val)) val.forEach(m => out.add(m))
    }
    return out
}

const SDK_IMPORT = '@axiom_ai/api'

/**
 * @param {string} source
 * @returns {{valid: boolean, errors: Array<{code: string, message: string, loc?: any}>}}
 */
function validateCodedScript(source) {
    const errors = []
    let ast
    try {
        ast = acorn.parse(source, {
            ecmaVersion: 'latest',
            sourceType: 'module',
            allowAwaitOutsideFunction: true,
            locations: true
        })
    } catch (e) {
        return {valid: false, errors: [{code: 'PARSE_ERROR', message: `acorn could not parse: ${e.message}`}]}
    }

    // Track local identifiers that are AxiomApi instances.
    const axiomInstances = new Set()
    // Sessions opened — checked against finally blocks at the end.
    const sessionsOpened = []

    walk.ancestor(ast, {
        ImportDeclaration(node) {
            const src = node.source.value
            if (src === SDK_IMPORT) return
            if (typeof src === 'string' && src.startsWith('@axiom_ai/api/')) {
                errors.push({
                    code: 'DISALLOWED_IMPORT',
                    message: `import from '${src}' — only '${SDK_IMPORT}' is allowed`,
                    loc: node.loc
                })
            }
        },

        NewExpression(node) {
            if (node.callee.type !== 'Identifier' || node.callee.name !== 'AxiomApi') return
            const arg = node.arguments[0]
            if (!arg) {
                errors.push({code: 'MISSING_TOKEN_ARG', message: 'new AxiomApi() called without a token', loc: node.loc})
                return
            }
            if (arg.type === 'Literal' && typeof arg.value === 'string') {
                const v = arg.value
                if (v.startsWith('npm_') || /^[A-Za-z0-9_-]{20,}$/.test(v)) {
                    errors.push({
                        code: 'HARDCODED_TOKEN',
                        message: 'new AxiomApi() called with a literal token-like string — use process.env.<NAME> instead',
                        loc: node.loc
                    })
                }
            }
        },

        VariableDeclarator(node) {
            if (node.id && node.id.type === 'Identifier' &&
                node.init && node.init.type === 'NewExpression' &&
                node.init.callee && node.init.callee.type === 'Identifier' &&
                node.init.callee.name === 'AxiomApi') {
                axiomInstances.add(node.id.name)
            }
        },

        AwaitExpression(node, ancestors) {
            const inner = node.argument
            if (!inner || inner.type !== 'CallExpression') return
            checkCall(inner, ancestors)
        },

        CallExpression(node, ancestors) {
            const parent = ancestors[ancestors.length - 2]
            if (parent && parent.type === 'AwaitExpression' && parent.argument === node) return
            checkCall(node, ancestors)
        }
    })

    function checkCall(call, ancestors) {
        const callee = call.callee
        if (!callee || callee.type !== 'MemberExpression') return
        const obj = callee.object
        const prop = callee.property
        if (!obj || obj.type !== 'Identifier' || !prop || prop.type !== 'Identifier') return

        const isInstance = axiomInstances.has(obj.name)
        const looksLikeAxiom = /^(axiom|ax|api)$/i.test(obj.name)
        if (!isInstance && !looksLikeAxiom) return

        const method = prop.name

        if (method.startsWith('_')) {
            errors.push({
                code: 'PRIVATE_METHOD',
                message: `private method ${obj.name}.${method}() — _-prefixed methods are internal`,
                loc: call.loc
            })
            return
        }

        if (BLOCKLIST.has(method)) {
            errors.push({
                code: 'INTERNAL_METHOD',
                message: `${obj.name}.${method}() is internal — call a named step method instead (see axiom-api-surface.md)`,
                loc: call.loc
            })
            return
        }

        if (!ALLOWLIST.has(method)) {
            errors.push({
                code: 'UNKNOWN_METHOD',
                message: `${obj.name}.${method}() is not a method on the AxiomApi surface`,
                loc: call.loc
            })
            return
        }

        if (method === 'browserOpen') {
            const enclosingFn = ancestors.slice().reverse().find(a =>
                a.type === 'FunctionDeclaration' || a.type === 'FunctionExpression' || a.type === 'ArrowFunctionExpression'
            )
            sessionsOpened.push({instance: obj.name, fn: enclosingFn, openLoc: call.loc})
        }
    }

    // Lifecycle: every browserOpen() needs a matching browserClose() in a finally block.
    for (const {instance, fn, openLoc} of sessionsOpened) {
        if (!fn) {
            errors.push({code: 'MISSING_LIFECYCLE', message: 'browserOpen() at module top-level — wrap in a function with try/finally', loc: openLoc})
            continue
        }
        if (!hasMatchingCloseInFinally(fn, instance)) {
            errors.push({
                code: 'MISSING_LIFECYCLE',
                message: `${instance}.browserOpen() not followed by ${instance}.browserClose() in a finally block`,
                loc: openLoc
            })
        }
    }

    return {valid: errors.length === 0, errors}
}

function hasMatchingCloseInFinally(fnNode, instanceName) {
    let found = false
    walk.simple(fnNode, {
        TryStatement(node) {
            if (!node.finalizer) return
            walk.simple(node.finalizer, {
                CallExpression(call) {
                    const c = call.callee
                    if (!c || c.type !== 'MemberExpression') return
                    if (!c.object || c.object.type !== 'Identifier') return
                    if (c.object.name !== instanceName) return
                    if (!c.property || c.property.type !== 'Identifier') return
                    if (c.property.name === 'browserClose') found = true
                }
            })
        }
    })
    return found
}

module.exports = {validateCodedScript}

// CLI mode
if (require.main === module) {
    const file = process.argv[2]
    if (!file) {
        console.error('usage: validate-coded.js <path-to-script.js>')
        process.exit(2)
    }
    if (!existsSync(file)) {
        console.error(`file not found: ${file}`)
        process.exit(2)
    }
    const src = readFileSync(file, 'utf8')
    const result = validateCodedScript(src)
    if (result.valid) {
        console.log(`OK  ${file} — passes coded-axiom validator`)
        process.exit(0)
    } else {
        console.error(`FAIL  ${file}`)
        for (const err of result.errors) {
            const at = err.loc && err.loc.start ? ` (line ${err.loc.start.line})` : ''
            console.error(`  [${err.code}]${at}  ${err.message}`)
        }
        process.exit(1)
    }
}
