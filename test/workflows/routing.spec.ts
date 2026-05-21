/**
 * Pin routing precedence. The mapping (message → workflow key) is a
 * contract — changing it changes user-visible skill behaviour. Every
 * row here documents intent classification we've decided is correct.
 */

// @ts-expect-error — pure JS module
import {route} from '../../plugins/axiom/skills/axiom/workflows/WorkflowRegistry.js'

const cases: Array<[string, string]> = [
    // signup
    ["I don't have an account yet", 'signup'],
    ['Sign me up please', 'signup'],
    ['I need an API key', 'signup'],
    ['Get me a key', 'signup'],

    // build_no_code
    ['save this to my account', 'build_no_code'],
    ['build me an axiom that runs every day at 9am', 'build_no_code'],
    ['I want this in my dashboard', 'build_no_code'],
    ['set up a schedule', 'build_no_code'],

    // build_coded
    ['write me a node script that scrapes the page', 'build_coded'],
    ['I want a JavaScript file I can run from my CI', 'build_coded'],
    ['standalone script please', 'build_coded'],

    // run_automation
    ['run my Google Maps scraper', 'run_automation'],
    ['trigger the daily report axiom', 'run_automation'],
    ['kick off the lead-gen bot', 'run_automation'],
    ['start the automation', 'run_automation'],

    // handoff_to_extension
    ['install the chrome extension', 'handoff_to_extension'],
    ['I don\'t have the chrome extension yet', 'handoff_to_extension'],
    ['where can I find my saved axioms', 'handoff_to_extension'],
    ['open in the extension', 'handoff_to_extension']
]

describe('routing precedence', () => {
    test.each(cases)('%s → %s', (message, expectedKey) => {
        const hit = route(message)
        expect(hit).not.toBeNull()
        expect(hit.workflow.key).toBe(expectedKey)
    })

    test('unrelated input does not route', () => {
        expect(route('what is the meaning of life')).toBeNull()
    })
})
