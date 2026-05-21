/**
 * Tests for skills/axiom/scripts/save-to-axiom-lar.js
 *
 * Uses dependency injection (fetchImpl) instead of intercepting native fetch — Node 22's fetch
 * is undici-based and nock 13 doesn't see it. Stubbing fetch directly is simpler anyway.
 */
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'

// @ts-expect-error — pure JS module, no .d.ts
import {saveAutomation, buildRequestBody} from '../../plugins/axiom/skills/axiom/scripts/save-to-axiom-lar.js'

const BASE = 'https://lar-test.axiom.ai'
const API_KEY = 'axm_test_key_value_for_mocked_request_only'

const VALID_TEMPLATE = JSON.parse(
    readFileSync(
        resolve(__dirname, '..', '..', 'plugins', 'axiom', 'skills', 'axiom', 'examples', 'no-code', 'visit-example.json'),
        'utf8'
    )
)

/**
 * Returns a tuple of [stub, captured]: pass `stub` as `fetchImpl`, inspect `captured.url`,
 * `captured.init`, and `captured.body` after the call.
 */
function makeStubFetch(status: number, jsonBody: any) {
    const captured: any = {}
    const stub = async (url: string, init: any) => {
        captured.url = url
        captured.init = init
        captured.body = init && init.body ? JSON.parse(init.body) : null
        return {
            ok: status >= 200 && status < 300,
            status,
            json: async () => jsonBody
        }
    }
    return [stub, captured] as const
}

describe('saveAutomation()', () => {
    test('POSTs to /api/v4/automation with X-API-KEY and returns data on 200', async () => {
        const [stub, captured] = makeStubFetch(200, {
            status: 'success',
            data: {id: 999, name: 'Visit example.com'}
        })

        const data = await saveAutomation({
            template: VALID_TEMPLATE,
            apiKey: API_KEY,
            baseUrl: BASE,
            fetchImpl: stub
        })

        expect(data.id).toBe(999)
        expect(captured.url).toBe(`${BASE}/api/v4/automation`)
        expect(captured.init.method).toBe('POST')
        expect(captured.init.headers['X-API-KEY']).toBe(API_KEY)
        expect(captured.init.headers['Content-Type']).toBe('application/json')
        expect(captured.body.name).toBe('Visit example.com')
        expect(captured.body.data).toEqual(VALID_TEMPLATE.data)
        expect(captured.body.triggers).toEqual([])
        // No id present on a create.
        expect(captured.body.id).toBeUndefined()
    })

    test('includes id on the wire when updating', async () => {
        const [stub, captured] = makeStubFetch(200, {status: 'success', data: {id: 42, name: 'Visit example.com'}})
        const tpl = {...VALID_TEMPLATE, id: 42}
        await saveAutomation({template: tpl, apiKey: API_KEY, baseUrl: BASE, fetchImpl: stub})
        expect(captured.body.id).toBe(42)
    })

    test('refuses to send an invalid template (no name) — does NOT call fetch', async () => {
        const [stub, captured] = makeStubFetch(200, {})
        const broken = {...VALID_TEMPLATE}
        delete (broken as any).name

        await expect(saveAutomation({template: broken, apiKey: API_KEY, baseUrl: BASE, fetchImpl: stub}))
            .rejects.toThrow(/failed schema validation/)
        expect(captured.url).toBeUndefined()    // stub never called
    })

    test('rejects when apiKey is missing', async () => {
        const [stub, captured] = makeStubFetch(200, {})
        await expect(saveAutomation({template: VALID_TEMPLATE, apiKey: '', baseUrl: BASE, fetchImpl: stub}))
            .rejects.toThrow(/apiKey is required/)
        expect(captured.url).toBeUndefined()
    })

    test('propagates a 401 with the server message', async () => {
        const [stub] = makeStubFetch(401, {
            status: 'error',
            message: 'Unable to authenticate, please check your API key and try again.'
        })

        await expect(saveAutomation({template: VALID_TEMPLATE, apiKey: 'bogus', baseUrl: BASE, fetchImpl: stub}))
            .rejects.toThrow(/HTTP 401.*check your API key/)
    })

    test('propagates a 400 missing-name error from the server (server-side validation)', async () => {
        // The skill's validator allows empty string for name (it's still a string), so this
        // exercises the server's check rather than the client's.
        const broken = {...VALID_TEMPLATE, name: ''}
        const [stub] = makeStubFetch(400, {status: 'error', message: 'The "name" field is required.'})

        await expect(saveAutomation({template: broken, apiKey: API_KEY, baseUrl: BASE, fetchImpl: stub}))
            .rejects.toThrow(/HTTP 400.*"name" field is required/)
    })
})

describe('buildRequestBody()', () => {
    test('passes data through unmodified and defaults triggers/stored_cookies', () => {
        const body = buildRequestBody(VALID_TEMPLATE)
        expect(body.data).toEqual(VALID_TEMPLATE.data)
        expect(body.triggers).toEqual([])
        expect(body.stored_cookies).toEqual([])
        expect(body.id).toBeUndefined()
    })

    test('omits id when 0 (template default for new) but includes when positive', () => {
        expect(buildRequestBody({...VALID_TEMPLATE, id: 0}).id).toBeUndefined()
        expect(buildRequestBody({...VALID_TEMPLATE, id: 7}).id).toBe(7)
    })
})
