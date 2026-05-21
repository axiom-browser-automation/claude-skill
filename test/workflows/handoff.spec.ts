/**
 * HandoffToExtensionWorkflow — pure install guidance.
 *
 * No URL parameter, no spawn, no deep-link. The workflow returns a static
 * message pointing the user at https://axiom.ai. Tests pin the message
 * shape and the routing-regex coverage so changes to the install copy
 * don't silently drift away from the intent.
 */

// @ts-expect-error — pure JS module
import {HandoffToExtensionWorkflow, AXIOM_URL, CHROME_STORE_URL} from '../../plugins/axiom/skills/axiom/workflows/HandoffToExtensionWorkflow.js'

describe('HandoffToExtensionWorkflow.invoke()', () => {
    test('returns a message pointing at axiom.ai', async () => {
        const result = await HandoffToExtensionWorkflow.invoke({message: ''})
        expect(result.response.message).toContain(AXIOM_URL)
        expect(result.response.message).toMatch(/Chrome extension/)
    })

    test('returns nextSteps with both axiom.ai and the Chrome store URL', async () => {
        const result = await HandoffToExtensionWorkflow.invoke({message: ''})
        expect(result.response.nextSteps).toBeDefined()
        const joined = result.response.nextSteps.join(' | ')
        expect(joined).toContain(AXIOM_URL)
        expect(joined).toContain(CHROME_STORE_URL)
    })

    test('attaches the canonical URLs to response.data', async () => {
        const result = await HandoffToExtensionWorkflow.invoke({message: ''})
        expect(result.response.data.websiteUrl).toBe(AXIOM_URL)
        expect(result.response.data.chromeStoreUrl).toBe(CHROME_STORE_URL)
    })

    test('debug field records the route key', async () => {
        const result = await HandoffToExtensionWorkflow.invoke({message: ''})
        expect(result.debug.route).toBe('handoff_to_extension')
    })

    test('does not accept or react to opts (the guidance is universal)', async () => {
        const withOpts = await HandoffToExtensionWorkflow.invoke({message: '', opts: {id: 999, open: true}})
        const withoutOpts = await HandoffToExtensionWorkflow.invoke({message: ''})
        expect(withOpts.response.message).toBe(withoutOpts.response.message)
    })
})

describe('HandoffToExtensionWorkflow.getRoutes()', () => {
    const routes = HandoffToExtensionWorkflow.getRoutes()
    const matcher = routes[0].match

    test.each([
        ['install the chrome extension', true],
        ['install the extension', true],
        ['I need to install the chrome extension', true],
        ['I don\'t have the chrome extension yet', true],
        ['I need the chrome extension', true],
        ['open in the extension', true],
        ['where do I run my axioms?', true],
        ['where can I find my saved axioms', true],
        ['build me an axiom that scrapes a page', false],
        ['I want to sign up', false]
    ])('match("%s") → %s', (msg, expected) => {
        expect(matcher(msg)).toBe(expected)
    })
})
