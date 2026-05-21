/**
 * RunAutomationWorkflow + scripts/run-axiom.js — fetchImpl-injected, no live HTTP.
 *
 * Drives the existing /v3/list-automations + /v4/trigger + /v3/run-data
 * endpoints. Covers happy paths, the trigger's queued + 503 fallback, the
 * VNC-URL password parser, the poll loop, and timeouts. Same stubFetch
 * pattern as the save-helper and signup tests.
 */

// @ts-expect-error — pure JS modules
import {listAutomations, triggerByName, getStatusByName, runAndWaitByName, parseVncPassword} from '../../plugins/axiom/skills/axiom/scripts/run-axiom.js'
// @ts-expect-error — pure JS module
import {RunAutomationWorkflow} from '../../plugins/axiom/skills/axiom/workflows/RunAutomationWorkflow.js'

const BASE = 'https://lar-test.axiom.ai'
const KEY = 'axm_test_key'
const VNC = 'https://vnc.axiom.ai/vnc_lite.html?host=v4-proxy-7-axiom-ai&port=443&autoconnect=true&password=Xy7abc&scale=local'

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

describe('parseVncPassword()', () => {
    test('extracts the password query param', () => {
        expect(parseVncPassword(VNC)).toBe('Xy7abc')
    })

    test('URL-decodes percent-encoded chars', () => {
        expect(parseVncPassword('https://x?password=a%2Bb%3Dc')).toBe('a+b=c')
    })

    test('returns null when absent', () => {
        expect(parseVncPassword('https://x?host=y')).toBeNull()
    })

    test('returns null for non-string input', () => {
        expect(parseVncPassword(null as any)).toBeNull()
    })
})

describe('listAutomations()', () => {
    test('POSTs key in body, returns names array', async () => {
        const {stub, calls} = stubFetch([
            {status: 200, body: {status: 'success', data: {names: ['scraper', 'lead-gen']}}}
        ])
        const result = await listAutomations({apiKey: KEY, baseUrl: BASE, fetchImpl: stub})
        expect(result).toEqual(['scraper', 'lead-gen'])
        expect(calls[0].url).toBe(`${BASE}/api/v3/list-automations`)
        expect(JSON.parse(calls[0].init.body)).toEqual({key: KEY})
    })

    test('returns empty array when server omits data.names', async () => {
        const {stub} = stubFetch([{status: 200, body: {status: 'success', data: {}}}])
        const result = await listAutomations({apiKey: KEY, baseUrl: BASE, fetchImpl: stub})
        expect(result).toEqual([])
    })

    test('401 invalid key bubbles up', async () => {
        const {stub} = stubFetch([{status: 401, body: {status: 'error', message: 'bad key'}}])
        await expect(listAutomations({apiKey: 'wrong', baseUrl: BASE, fetchImpl: stub}))
            .rejects.toThrow(/HTTP 401.*bad key/)
    })
})

describe('triggerByName()', () => {
    test('POSTs name in body with X-API-KEY header', async () => {
        const {stub, calls} = stubFetch([
            {status: 200, body: {'OPEN LINK IN BROWSER': VNC}}
        ])
        const result = await triggerByName({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, name: 'My Scraper'})
        expect(result.vncUrl).toBe(VNC)
        expect(result.podPassword).toBe('Xy7abc')
        expect(calls[0].url).toBe(`${BASE}/api/v4/trigger`)
        expect(calls[0].init.headers['X-API-KEY']).toBe(KEY)
        expect(JSON.parse(calls[0].init.body)).toEqual({name: 'My Scraper'})
    })

    test('forwards optional data / apiKeys / noWait', async () => {
        const {stub, calls} = stubFetch([{status: 200, body: {'OPEN LINK IN BROWSER': VNC}}])
        await triggerByName({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, name: 'X', data: [['a']], apiKeys: {openAI: 'sk-x'}, noWait: 'false'})
        const body = JSON.parse(calls[0].init.body)
        expect(body.data).toEqual([['a']])
        expect(body.apiKeys).toEqual({openAI: 'sk-x'})
        expect(body.noWait).toBe('false')
    })

    test('queued response surfaces as {queued: true}', async () => {
        const {stub} = stubFetch([{status: 200, body: {status: 'queued', message: 'no pods available'}}])
        const result = await triggerByName({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, name: 'X'})
        expect(result.queued).toBe(true)
        expect(result.message).toBe('no pods available')
    })

    test('503 from a full queue bubbles up', async () => {
        const {stub} = stubFetch([{status: 503, body: {status: 'error', message: 'queue full'}}])
        await expect(triggerByName({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, name: 'X'}))
            .rejects.toThrow(/HTTP 503.*queue full/)
    })

    test('missing name throws before fetch', async () => {
        const {stub, calls} = stubFetch([])
        await expect(triggerByName({apiKey: KEY, baseUrl: BASE, fetchImpl: stub} as any))
            .rejects.toThrow(/name is required/)
        expect(calls).toHaveLength(0)
    })
})

describe('getStatusByName()', () => {
    test('POSTs {key, name} and returns the response as-is', async () => {
        const {stub, calls} = stubFetch([
            {status: 200, body: {status: 'Running', data: {}}}
        ])
        const result = await getStatusByName({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, name: 'My Scraper'})
        expect(result.status).toBe('Running')
        expect(calls[0].url).toBe(`${BASE}/api/v3/run-data`)
        expect(JSON.parse(calls[0].init.body)).toEqual({key: KEY, name: 'My Scraper'})
    })

    test('Finished status with sheet data', async () => {
        const {stub} = stubFetch([{status: 200, body: {status: 'Finished', data: {abc: [['row1']]}}}])
        const result = await getStatusByName({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, name: 'X'})
        expect(result.status).toBe('Finished')
        expect(result.data.abc).toEqual([['row1']])
    })
})

describe('runAndWaitByName()', () => {
    const noSleep = async (_ms: number) => {}

    test('trigger → polls Running → Running → Finished', async () => {
        const {stub, calls} = stubFetch([
            {status: 200, body: {'OPEN LINK IN BROWSER': VNC}},                  // trigger
            {status: 200, body: {status: 'Running', data: {}}},                  // poll 1
            {status: 200, body: {status: 'Running', data: {}}},                  // poll 2
            {status: 200, body: {status: 'Finished', data: {sheetA: [['x']]}}}    // poll 3
        ])
        const final = await runAndWaitByName({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, name: 'X', sleep: noSleep, pollMs: 1, timeoutMs: 60_000})
        expect(final.finalStatus).toBe('Finished')
        expect(final.data.sheetA).toEqual([['x']])
        expect(calls).toHaveLength(4)
    })

    test('queued trigger returns {finalStatus: "queued"} without polling', async () => {
        const {stub, calls} = stubFetch([
            {status: 200, body: {status: 'queued', message: 'no pods'}}
        ])
        const final = await runAndWaitByName({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, name: 'X', sleep: noSleep, pollMs: 1, timeoutMs: 60_000})
        expect(final.finalStatus).toBe('queued')
        expect(calls).toHaveLength(1)
    })

    test('throws on timeout', async () => {
        const {stub} = stubFetch([
            {status: 200, body: {'OPEN LINK IN BROWSER': VNC}},
            {status: 200, body: {status: 'Running', data: {}}},
            {status: 200, body: {status: 'Running', data: {}}}
        ])
        await expect(runAndWaitByName({apiKey: KEY, baseUrl: BASE, fetchImpl: stub, name: 'X', sleep: noSleep, pollMs: 1, timeoutMs: 0}))
            .rejects.toThrow(/did not finish within 0ms/)
    })
})

describe('RunAutomationWorkflow.invoke()', () => {
    test('missing API key returns guidance, not an error', async () => {
        const result = await RunAutomationWorkflow.invoke({message: '', env: {}, opts: {mode: 'list'}})
        expect(result.response.message).toMatch(/AXIOM_API_KEY is required/)
        expect(result.debug.error).toBe('missing_api_key')
    })

    test('list mode produces a friendly message', async () => {
        const {stub} = stubFetch([{status: 200, body: {status: 'success', data: {names: ['a', 'b']}}}])
        const result = await RunAutomationWorkflow.invoke({
            message: '', env: {AXIOM_API_KEY: KEY, AXIOM_LAR_URL: BASE}, fetchImpl: stub,
            opts: {mode: 'list'}
        })
        expect(result.response.message).toMatch(/2 axiom\(s\)/)
        expect(result.response.data.names).toEqual(['a', 'b'])
    })

    test('trigger mode surfaces the VNC URL in the message', async () => {
        const {stub} = stubFetch([{status: 200, body: {'OPEN LINK IN BROWSER': VNC}}])
        const result = await RunAutomationWorkflow.invoke({
            message: '', env: {AXIOM_API_KEY: KEY, AXIOM_LAR_URL: BASE}, fetchImpl: stub,
            opts: {mode: 'trigger', name: 'Scraper'}
        })
        expect(result.response.message).toMatch(/Triggered "Scraper".*vnc\.axiom\.ai/)
        expect(result.response.data.podPassword).toBe('Xy7abc')
    })

    test('wait mode polls then returns finalStatus', async () => {
        const {stub} = stubFetch([
            {status: 200, body: {'OPEN LINK IN BROWSER': VNC}},
            {status: 200, body: {status: 'Finished', data: {}}}
        ])
        const result = await RunAutomationWorkflow.invoke({
            message: '', env: {AXIOM_API_KEY: KEY, AXIOM_LAR_URL: BASE}, fetchImpl: stub,
            opts: {mode: 'wait', name: 'X', sleep: async () => {}, pollMs: 1, timeoutMs: 60_000}
        })
        expect(result.response.message).toMatch(/finalStatus=Finished/)
    })

    test('server error caught and surfaced as message, not exception', async () => {
        const {stub} = stubFetch([{status: 401, body: {status: 'error', message: 'bad key'}}])
        const result = await RunAutomationWorkflow.invoke({
            message: '', env: {AXIOM_API_KEY: KEY, AXIOM_LAR_URL: BASE}, fetchImpl: stub,
            opts: {mode: 'trigger', name: 'X'}
        })
        expect(result.response.message).toMatch(/trigger failed/)
        expect(result.debug.error).toMatch(/HTTP 401/)
    })

    test('status mode notes the binary-status caveat in the message', async () => {
        const {stub} = stubFetch([{status: 200, body: {status: 'Finished', data: {}}}])
        const result = await RunAutomationWorkflow.invoke({
            message: '', env: {AXIOM_API_KEY: KEY, AXIOM_LAR_URL: BASE}, fetchImpl: stub,
            opts: {mode: 'status', name: 'X'}
        })
        expect(result.response.message).toMatch(/failure indistinguishable from success/)
    })
})
