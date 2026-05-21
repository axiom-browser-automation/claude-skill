/**
 * Tests for scripts/signup-and-mint-key.js
 *
 * Uses dependency-injected fetch (matches the save-helper test pattern) — no live HTTP calls,
 * deterministic, fast. Covers create-then-login, --existing (skip create), --check-only,
 * email_exists fallback, disposable-email rejection, null-return-on-login (bad creds),
 * "blocked" string return on locked accounts, missing password, and missing name.
 */

// @ts-expect-error — pure JS module, no .d.ts
import {signupAndMintKey} from '../../plugins/axiom/skills/axiom/scripts/signup-and-mint-key.js'

const BASE = 'https://lar-test.axiom.ai'
const EMAIL = 'tester@axiom.example'
const PASSWORD = 'pa$$w0rd!shoutout'
const NAME = 'Test User'

type FetchCall = {url: string, init: any, body: any}

/**
 * Build a stub fetch that returns a queue of pre-canned responses, in order.
 *
 * Response shape: `{status, body}` or `{status, bodyRaw}`.
 *   `body` is the deserialized JS value — stub JSON-encodes it for transport.
 *     - `body: null`       → response body is `"null"` (parses back to `null`)
 *     - `body: "blocked"`  → response body is `"\"blocked\""` (parses back to the string `"blocked"`)
 *     - `body: {id: 1}`    → response body is `"{\"id\":1}"`
 *   `bodyRaw` is sent as-is (for testing non-JSON error pages).
 */
function stubFetch(responses: Array<{status: number, body?: any, bodyRaw?: string}>) {
    const calls: FetchCall[] = []
    let i = 0
    const stub = async (url: string, init: any) => {
        if (i >= responses.length) {
            throw new Error(`stub fetch called more times than expected — call #${i + 1} to ${url}`)
        }
        const r = responses[i++]
        calls.push({
            url,
            init,
            body: init && init.body ? JSON.parse(init.body) : null
        })
        const bodyText = r.bodyRaw !== undefined ? r.bodyRaw : JSON.stringify(r.body)
        return {
            ok: r.status >= 200 && r.status < 300,
            status: r.status,
            text: async () => bodyText
        }
    }
    return {stub, calls}
}

describe('signupAndMintKey() — happy paths', () => {
    test('new account: create → login → mint key, in that order', async () => {
        const {stub, calls} = stubFetch([
            // Real success response from /create is the User model — includes a `status: 'created'`
            // column on the User row that is NOT an error indicator. The helper must
            // distinguish success (has `id`) from error (only `status`, no `id`).
            {status: 200, body: {id: 12345, name: NAME, email: EMAIL, status: 'created'}},        // /create
            {status: 200, body: {id: 12345, email: EMAIL, token: 'jwt-here'}},                    // /login
            {status: 200, body: {token: 'axm_minted_key'}}                                         // /key/create
        ])

        const result = await signupAndMintKey({
            email: EMAIL, password: PASSWORD, name: NAME, baseUrl: BASE, fetchImpl: stub
        })

        expect(result.apiKey).toBe('axm_minted_key')
        expect(result.userId).toBe(12345)
        expect(result.userEmail).toBe(EMAIL)

        expect(calls).toHaveLength(3)
        expect(calls[0].url).toBe(`${BASE}/api/user/create`)
        expect(calls[0].body.name).toBe(NAME)
        expect(calls[0].body.email).toBe(EMAIL)
        expect(calls[0].body.password).toBe(PASSWORD)
        expect(calls[0].body.campaign).toBe('claude-skill')

        expect(calls[1].url).toBe(`${BASE}/api/user/login`)
        expect(calls[1].body).toEqual({email: EMAIL, password: PASSWORD})

        expect(calls[2].url).toBe(`${BASE}/api/user/key/create`)
        expect(calls[2].init.headers['Authorization']).toBe('Bearer jwt-here')
    })

    test('--existing: skips /create, runs login + key mint only', async () => {
        const {stub, calls} = stubFetch([
            {status: 200, body: {id: 99, email: EMAIL, token: 'jwt-here'}},                       // /login
            {status: 200, body: {token: 'axm_existing_key'}}                                       // /key/create
        ])

        const result = await signupAndMintKey({
            email: EMAIL, password: PASSWORD, existing: true, baseUrl: BASE, fetchImpl: stub
        })

        expect(result.apiKey).toBe('axm_existing_key')
        expect(calls).toHaveLength(2)
        expect(calls[0].url).toBe(`${BASE}/api/user/login`)
        expect(calls[1].url).toBe(`${BASE}/api/user/key/create`)
    })

    test('--check-only: returns hasExistingKey without minting', async () => {
        const {stub, calls} = stubFetch([
            {status: 200, body: {id: 5, email: EMAIL, token: 'jwt-here'}},                        // /login
            {status: 200, body: {result: true}}                                                    // /key/has-existing
        ])

        const result = await signupAndMintKey({
            email: EMAIL, password: PASSWORD, existing: true, checkOnly: true,
            baseUrl: BASE, fetchImpl: stub
        })

        expect(result.hasExistingKey).toBe(true)
        expect(result.apiKey).toBeUndefined()
        expect(calls).toHaveLength(2)
        expect(calls[1].url).toBe(`${BASE}/api/user/key/has-existing`)
    })

    test('regression: User model status="created" on success is NOT treated as an error', async () => {
        // This caught a real bug in the first live smoke. The User model has a
        // `status` DB column that holds 'created' after signup. Naive code that checks for
        // `response.status` as an error signal will misinterpret this as a failure.
        const {stub} = stubFetch([
            {status: 200, body: {id: 999, name: NAME, email: EMAIL, status: 'created'}},
            {status: 200, body: {id: 999, email: EMAIL, token: 'jwt-here'}},
            {status: 200, body: {token: 'axm_should_succeed'}}
        ])

        const result = await signupAndMintKey({
            email: EMAIL, password: PASSWORD, name: NAME, baseUrl: BASE, fetchImpl: stub
        })

        expect(result.apiKey).toBe('axm_should_succeed')
        expect(result.userId).toBe(999)
    })

    test('email_exists on /create → automatically falls back to login + mint', async () => {
        const {stub, calls} = stubFetch([
            {status: 200, body: {status: 'email_exists'}},                                         // /create
            {status: 200, body: {id: 7, email: EMAIL, token: 'jwt-here'}},                        // /login
            {status: 200, body: {token: 'axm_after_fallback'}}                                     // /key/create
        ])

        const result = await signupAndMintKey({
            email: EMAIL, password: PASSWORD, name: NAME, baseUrl: BASE, fetchImpl: stub
        })

        expect(result.apiKey).toBe('axm_after_fallback')
        expect(calls).toHaveLength(3)
    })
})

describe('signupAndMintKey() — failure modes', () => {
    test('disposable email on /create → throws with clear message', async () => {
        const {stub} = stubFetch([
            {status: 200, body: {status: 'To prevent abuse of our free plan, please do not register with an anonymous email provider.'}}
        ])

        await expect(signupAndMintKey({
            email: 'throwaway@mailinator.com', password: PASSWORD, name: NAME, baseUrl: BASE, fetchImpl: stub
        })).rejects.toThrow(/disposable email/)
    })

    test('login returns null (bad password) → throws "invalid credentials"', async () => {
        const {stub} = stubFetch([
            {status: 200, body: {id: 1, email: EMAIL}},                                            // /create
            {status: 200, body: null}                                                              // /login returns null
        ])

        await expect(signupAndMintKey({
            email: EMAIL, password: 'wrong', name: NAME, baseUrl: BASE, fetchImpl: stub
        })).rejects.toThrow(/invalid credentials/)
    })

    test('login returns the string "blocked" → throws "account locked"', async () => {
        const {stub} = stubFetch([
            {status: 200, body: {id: 1, email: EMAIL}},                                            // /create
            {status: 200, body: 'blocked'}                                                         // /login
        ])

        await expect(signupAndMintKey({
            email: EMAIL, password: PASSWORD, name: NAME, baseUrl: BASE, fetchImpl: stub
        })).rejects.toThrow(/account locked/)
    })

    test('missing password → throws before any fetch call', async () => {
        const {stub, calls} = stubFetch([])

        await expect(signupAndMintKey({
            email: EMAIL, password: '', name: NAME, baseUrl: BASE, fetchImpl: stub
        })).rejects.toThrow(/AXIOM_PASSWORD is required/)
        expect(calls).toHaveLength(0)
    })

    test('missing name on new-account flow → throws before any fetch call', async () => {
        const {stub, calls} = stubFetch([])

        await expect(signupAndMintKey({
            email: EMAIL, password: PASSWORD, baseUrl: BASE, fetchImpl: stub
        })).rejects.toThrow(/name is required/)
        expect(calls).toHaveLength(0)
    })

    test('non-JSON error page from server → throws with parseable context', async () => {
        const {stub} = stubFetch([
            {status: 500, bodyRaw: '<!doctype html><html>server error</html>'}                     // /create returns HTML 500
        ])

        await expect(signupAndMintKey({
            email: EMAIL, password: PASSWORD, name: NAME, baseUrl: BASE, fetchImpl: stub
        })).rejects.toThrow(/non-JSON response/)
    })
})
