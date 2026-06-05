/**
 * scripts/save-automation.js — fetchImpl-injected, no live HTTP.
 *
 * POST /api/v4/automation. Same stubFetch pattern as run-axiom + signup.
 * Errors return tagged {ok: false, error, status?} instead of throwing —
 * the workflow uses the tag to fall back to the manual-import flow.
 */

// @ts-expect-error — pure JS module
import {saveAutomation, readTemplate} from '../../plugins/axiom/skills/axiom/scripts/save-automation.js'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'

const BASE = 'https://lar-test.axiom.ai'
const KEY = 'axm_test_key'

type StubResponse = {status: number, body?: any, bodyText?: string}
type FetchCall = {url: string, init: any}

function stubFetch(responses: StubResponse[]) {
    const calls: FetchCall[] = []
    let i = 0
    const stub = async (url: string, init: any) => {
        if (i >= responses.length) throw new Error(`unexpected fetch #${i + 1} to ${url}`)
        const r = responses[i++]
        calls.push({url, init: init || {}})
        const text = r.bodyText !== undefined ? r.bodyText : JSON.stringify(r.body)
        return {
            ok: r.status >= 200 && r.status < 300,
            status: r.status,
            json: async () => JSON.parse(text)
        }
    }
    return {stub, calls}
}

const minimalTemplate = {
    name: 'My Axiom',
    data: {context: [{context: 'url', url: 'https://example.com'}], form: []},
    triggers: [],
    stored_cookies: []
}

const successResponse = {
    status: 'success',
    data: {id: 4242, name: 'My Axiom', organization_id: 1, creator_id: 7, type: 'default', status: 'active', color: '#ffffff', favourite: false}
}

describe('saveAutomation()', () => {
    test('POSTs to /api/v4/automation with X-API-KEY + forwards core fields', async () => {
        const {stub, calls} = stubFetch([{status: 200, body: successResponse}])
        const result = await saveAutomation({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, template: minimalTemplate})

        expect(result.ok).toBe(true)
        expect(result.id).toBe(4242)
        expect(result.name).toBe('My Axiom')

        expect(calls[0].url).toBe(`${BASE}/api/v4/automation`)
        expect(calls[0].init.method).toBe('POST')
        expect(calls[0].init.headers['X-API-KEY']).toBe(KEY)
        expect(calls[0].init.headers['Content-Type']).toBe('application/json')

        const body = JSON.parse(calls[0].init.body)
        expect(body.name).toBe('My Axiom')
        expect(body.data).toEqual(minimalTemplate.data)
        expect(body.triggers).toEqual([])
        expect(body.stored_cookies).toEqual([])
    })

    test('forwards optional top-level fields when present on the template', async () => {
        const {stub, calls} = stubFetch([{status: 200, body: successResponse}])
        const tpl = {
            ...minimalTemplate,
            organization_id: 42,
            type: 'scheduled',
            status: 'active',
            color: '#ff00ff',
            favourite: true,
            triggers: [{name: 'Daily', type: 'recursive', time_criteria: 86400, interval_type: 'seconds'}],
            stored_cookies: [{url: 'https://example.com', cookies: []}]
        }
        await saveAutomation({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, template: tpl})

        const body = JSON.parse(calls[0].init.body)
        expect(body.organization_id).toBe(42)
        expect(body.type).toBe('scheduled')
        expect(body.status).toBe('active')
        expect(body.color).toBe('#ff00ff')
        expect(body.favourite).toBe(true)
        expect(body.triggers).toEqual(tpl.triggers)
        expect(body.stored_cookies).toEqual(tpl.stored_cookies)
    })

    test('strips trailing slash from baseUrl', async () => {
        const {stub, calls} = stubFetch([{status: 200, body: successResponse}])
        await saveAutomation({apiKey: KEY, baseUrl: `${BASE}/`, fetchImpl: stub, template: minimalTemplate})
        expect(calls[0].url).toBe(`${BASE}/api/v4/automation`)
    })

    test('401 → ok:false, error "API key invalid or expired"', async () => {
        const {stub} = stubFetch([{status: 401, body: {status: 'error', message: 'bad key'}}])
        const result = await saveAutomation({apiKey: 'wrong', baseUrl: BASE, fetchImpl: stub, template: minimalTemplate})
        expect(result.ok).toBe(false)
        expect(result.error).toBe('API key invalid or expired')
        expect(result.status).toBe(401)
    })

    test('403 → ok:false, surfaces the server message (e.g. Pro subscription required)', async () => {
        const {stub} = stubFetch([{status: 403, body: {status: 'error', message: 'You must have a pro subscription or higher to use this API.'}}])
        const result = await saveAutomation({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, template: minimalTemplate})
        expect(result.ok).toBe(false)
        expect(result.status).toBe(403)
        expect(result.error).toMatch(/pro subscription/i)
    })

    test('404 → ok:false, error "endpoint not deployed on this LAR yet"', async () => {
        const {stub} = stubFetch([{status: 404, body: {}}])
        const result = await saveAutomation({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, template: minimalTemplate})
        expect(result.ok).toBe(false)
        expect(result.status).toBe(404)
        expect(result.error).toMatch(/not deployed/i)
    })

    test('5xx → ok:false, surfaces server message', async () => {
        const {stub} = stubFetch([{status: 500, body: {status: 'error', message: 'database is down'}}])
        const result = await saveAutomation({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, template: minimalTemplate})
        expect(result.ok).toBe(false)
        expect(result.status).toBe(500)
        expect(result.error).toBe('database is down')
    })

    test('network error → ok:false, error mentions reachability', async () => {
        const stub = async () => { throw new Error('ECONNREFUSED 127.0.0.1:443') }
        const result = await saveAutomation({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, template: minimalTemplate})
        expect(result.ok).toBe(false)
        expect(result.error).toMatch(/couldn't reach/i)
        expect(result.error).toMatch(/ECONNREFUSED/)
    })

    test('non-JSON body → ok:false with clear error', async () => {
        const {stub} = stubFetch([{status: 502, bodyText: '<html>bad gateway</html>'}])
        const result = await saveAutomation({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, template: minimalTemplate})
        expect(result.ok).toBe(false)
        expect(result.error).toMatch(/non-JSON/i)
        expect(result.status).toBe(502)
    })

    test('unexpected success-shape (missing id) → ok:false', async () => {
        const {stub} = stubFetch([{status: 200, body: {status: 'success', data: {name: 'X'}}}])
        const result = await saveAutomation({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, template: minimalTemplate})
        expect(result.ok).toBe(false)
        expect(result.error).toMatch(/unexpected response shape/i)
    })

    test('missing apiKey → ok:false, no fetch', async () => {
        const {stub, calls} = stubFetch([])
        const result = await saveAutomation({apiKey: '', baseUrl: BASE, fetchImpl: stub, template: minimalTemplate} as any)
        expect(result.ok).toBe(false)
        expect(result.error).toMatch(/AXIOM_API_KEY/)
        expect(calls).toHaveLength(0)
    })

    test('missing template.name → ok:false, no fetch', async () => {
        const {stub, calls} = stubFetch([])
        const result = await saveAutomation({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, template: {data: {}} as any})
        expect(result.ok).toBe(false)
        expect(result.error).toMatch(/template\.name is required/)
        expect(calls).toHaveLength(0)
    })

    test('missing template → ok:false, no fetch', async () => {
        const {stub, calls} = stubFetch([])
        const result = await saveAutomation({apiKey: KEY, baseUrl: BASE, fetchImpl: stub} as any)
        expect(result.ok).toBe(false)
        expect(result.error).toMatch(/template is required/)
        expect(calls).toHaveLength(0)
    })

    test('defaults triggers + stored_cookies to [] when absent on the template', async () => {
        const {stub, calls} = stubFetch([{status: 200, body: successResponse}])
        await saveAutomation({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, template: {name: 'X', data: {}}})
        const body = JSON.parse(calls[0].init.body)
        expect(body.triggers).toEqual([])
        expect(body.stored_cookies).toEqual([])
    })
})

describe('readTemplate()', () => {
    let tmp: string

    beforeEach(() => {
        tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'save-automation-test-'))
    })

    afterEach(() => {
        fs.rmSync(tmp, {recursive: true, force: true})
    })

    test('reads + parses a valid JSON file', () => {
        const p = path.join(tmp, 'a.json')
        fs.writeFileSync(p, JSON.stringify({name: 'X', data: {}}))
        const result = readTemplate(p)
        expect(result.ok).toBe(true)
        expect(result.template).toEqual({name: 'X', data: {}})
    })

    test('missing file → ok:false', () => {
        const result = readTemplate(path.join(tmp, 'nope.json'))
        expect(result.ok).toBe(false)
        expect(result.error).toMatch(/couldn't read/i)
    })

    test('invalid JSON → ok:false', () => {
        const p = path.join(tmp, 'bad.json')
        fs.writeFileSync(p, '{not: valid json')
        const result = readTemplate(p)
        expect(result.ok).toBe(false)
        expect(result.error).toMatch(/parse/i)
    })
})
