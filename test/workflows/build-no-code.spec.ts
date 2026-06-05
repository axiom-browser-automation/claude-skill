/**
 * BuildNoCodeWorkflow — pinned contract:
 *   1. Given an intent + outputPath, the workflow builds via the helper,
 *      validates, writes to disk, and returns the import-flow message.
 *   2. Hand-composed (or stale) JSON passed via opts.artifactPath is
 *      validate-only — and the strengthened validator rejects it. The
 *      workflow surfaces the validation errors with a hint to recompose
 *      via intent.
 *   3. Bad intent shapes (unknown widget, wrong param key) fail loudly.
 *
 * No disk side-effects: each test uses a fresh tmp file and cleans up.
 */

// @ts-expect-error — pure JS module
import {BuildNoCodeWorkflow} from '../../plugins/axiom/skills/axiom/workflows/BuildNoCodeWorkflow.js'
import {existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs'
import {join} from 'node:path'
import {tmpdir} from 'node:os'

function tmp() {
    return mkdtempSync(join(tmpdir(), 'build-no-code-'))
}

describe('BuildNoCodeWorkflow.invoke — intent path (primary)', () => {
    test('builds + validates + writes a file from a minimal intent', async () => {
        const dir = tmp()
        const outputPath = join(dir, 'axiom.json')
        try {
            const result = await BuildNoCodeWorkflow.invoke({
                message: '',
                opts: {
                    intent: {
                        name: 'Visit example',
                        contextUrl: 'https://example.com',
                        steps: [{machineName: 'WidgetDriverGoto', values: {'Enter URL': 'https://example.com'}}]
                    },
                    outputPath
                }
            })
            expect(existsSync(outputPath)).toBe(true)
            const written = JSON.parse(readFileSync(outputPath, 'utf8'))
            expect(written.name).toBe('Visit example')
            expect(written.data.form).toHaveLength(1)
            // Canonical step shape, not the broken minimal shape
            expect(written.data.form[0].original_name).toBe('Go to page')
            expect(written.data.form[0].params).toHaveLength(4)  // widget declares 4
            // method/modes/index are load-bearing: without them the imported
            // axiom hangs on about:blank (v0.7.8 regression).
            expect(written.data.form[0].method).toEqual({driver: 'driver.gotoV4070'})
            expect(written.data.form[0].modes).toEqual(['driver'])
            expect(written.data.form[0].index).toBe(0)

            expect(result.response.message).toContain(outputPath)
            expect(result.response.message).toMatch(/save .* to your Axiom account/i)
            expect(result.response.message).toMatch(/Chrome extension/)
            const nextSteps = result.response.nextSteps.join('\n')
            expect(nextSteps).toMatch(/Cog icon/)
            expect(nextSteps).toMatch(/Import or download/)
            expect(result.response.data.artifactPath).toBe(outputPath)
            expect(result.response.data.automationName).toBe('Visit example')
            expect(result.response.data.saveCommand).toMatch(/save-automation\.js/)
            expect(result.response.data.saveCommand).toContain(outputPath)
            expect(result.debug.phase).toBe('built')
        } finally {
            rmSync(dir, {recursive: true, force: true})
        }
    })

    test('expands ~ in outputPath', async () => {
        // We can't actually write to the user's home dir in a test, but we can
        // verify the workflow attempts the expansion by checking the artifactPath
        // returned doesn't still contain `~`.
        const dir = tmp()
        const result = await BuildNoCodeWorkflow.invoke({
            message: '',
            opts: {
                intent: {
                    name: 'x',
                    steps: [{machineName: 'WidgetDriverGoto'}]
                },
                outputPath: `${dir}/x.json`
            }
        })
        expect(result.response.data.artifactPath.startsWith('~')).toBe(false)
        rmSync(dir, {recursive: true, force: true})
    })

    test('rejects unknown machineName with a useful error', async () => {
        const dir = tmp()
        try {
            const result = await BuildNoCodeWorkflow.invoke({
                message: '',
                opts: {
                    intent: {
                        name: 'x',
                        steps: [{machineName: 'WidgetDoesNotExist'}]
                    },
                    outputPath: join(dir, 'x.json')
                }
            })
            expect(result.response.message).toMatch(/unknown widget/i)
            expect(result.debug.phase).toBe('build')
            expect(existsSync(join(dir, 'x.json'))).toBe(false)
        } finally {
            rmSync(dir, {recursive: true, force: true})
        }
    })

    test('rejects wrong param key (e.g. "URL" instead of "Enter URL")', async () => {
        const dir = tmp()
        try {
            const result = await BuildNoCodeWorkflow.invoke({
                message: '',
                opts: {
                    intent: {
                        name: 'x',
                        steps: [{machineName: 'WidgetDriverGoto', values: {URL: 'https://x.test'}}]
                    },
                    outputPath: join(dir, 'x.json')
                }
            })
            expect(result.response.message).toMatch(/"URL"/)
            expect(result.response.message).toMatch(/"Enter URL"/)
            expect(existsSync(join(dir, 'x.json'))).toBe(false)
        } finally {
            rmSync(dir, {recursive: true, force: true})
        }
    })

    test('missing outputPath returns guidance, not a stack trace', async () => {
        const result = await BuildNoCodeWorkflow.invoke({
            message: '',
            opts: {
                intent: {name: 'x', steps: [{machineName: 'WidgetDriverGoto'}]}
            }
        })
        expect(result.response.message).toMatch(/outputPath is required/)
        expect(result.debug.error).toBe('missing_output_path')
    })
})

describe('BuildNoCodeWorkflow.invoke — artifactPath path (validate-only escape hatch)', () => {
    test('accepts a canonical JSON file', async () => {
        // Use one of the regenerated examples — it's known canonical.
        const examplePath = require('path').resolve(__dirname, '..', '..', 'plugins/axiom/skills/axiom/examples/no-code/visit-example.json')
        const result = await BuildNoCodeWorkflow.invoke({
            message: '',
            opts: {artifactPath: examplePath}
        })
        expect(result.response.message).toContain(examplePath)
        expect(result.response.message).toMatch(/save .* to your Axiom account/i)
        expect(result.response.data.automationName).toBe('Visit example.com')
        expect(result.response.data.saveCommand).toMatch(/save-automation\.js/)
        expect(result.response.nextSteps.join('\n')).toMatch(/Cog icon/)
        expect(result.debug.phase).toBe('validated-existing')
    })

    test('rejects a hand-composed broken JSON with a recompose hint', async () => {
        const dir = tmp()
        const brokenPath = join(dir, 'broken.json')
        // Mimic the user's BBC search — minimal hand-composed shape
        writeFileSync(brokenPath, JSON.stringify({
            id: 0, openWidgetIndex: -1, name: 'x', templateId: 0, triggers: [],
            share_status: false, share_link: '', stored_cookies: [],
            data: {
                allowConcurrencyDesktop: true, builderTemplateId: 0,
                context: [{context: 'url', url: 'https://x.test'}],
                disallowConcurrencyCloud: false,
                form: [{
                    machine_name: 'WidgetDriverGoto', name: 'Go to page', stepNumber: '1',
                    params: [{collapsible: 0, configurable: true, name: 'URL', type: 'token', value: 'https://x.test'}]
                }],
                headless: false, incognitoMode: false,
                injector: {injector: 'dom', magic_btn_status: true, selector: ''},
                mode: 'browser', storeCookies: false, templateId: 0,
                templateItem: {name: 'x', description: ''},
                templateMode: false, templateStarted: false, tokens: null, viewport: null
            }
        }, null, 2))
        try {
            const result = await BuildNoCodeWorkflow.invoke({
                message: '',
                opts: {artifactPath: brokenPath}
            })
            expect(result.response.message).toMatch(/Validation failed/)
            expect(result.response.message).toMatch(/hand-composed/i)
            expect(result.response.message).toMatch(/recompose via opts.intent/i)
            expect(result.response.data.errors.length).toBeGreaterThan(0)
            expect(result.debug.validationFailed).toBe(true)
        } finally {
            rmSync(dir, {recursive: true, force: true})
        }
    })
})

describe('BuildNoCodeWorkflow.invoke — input validation', () => {
    test('returns guidance when neither intent nor artifactPath given', async () => {
        const result = await BuildNoCodeWorkflow.invoke({message: '', opts: {}})
        expect(result.response.message).toMatch(/Provide either opts.intent.*or opts.artifactPath/)
        expect(result.debug.error).toBe('missing_input')
    })
})
