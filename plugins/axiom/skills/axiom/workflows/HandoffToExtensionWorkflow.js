/**
 * HandoffToExtensionWorkflow — tell the user how to install the Chrome
 * extension so they can find and run their saved axioms.
 *
 * Pure guidance: the skill has no programmatic way to deep-link into the
 * extension (the only external-message channel today is the marketplace's
 * `install_template`, which is the wrong primitive for a user-owned task).
 * Adding an `open_axiom` external message to the extension is the proper
 * fix; until then the handoff is just a pointer.
 */

const AXIOM_URL = 'https://axiom.ai'
const CHROME_STORE_URL = 'https://chrome.google.com/webstore/detail/axiom-browser-automation/cpgamigjcbffkaiciiepndmonbfdimbb'

class HandoffToExtensionWorkflow {
    static key = 'handoff_to_extension'
    static description = 'Tell the user how to install the Axiom Chrome extension so they can find and run their saved axioms.'

    static getRoutes() {
        return [
            {
                key: HandoffToExtensionWorkflow.key,
                match: (msg) => /install (the )?(chrome )?extension|don'?t have (the )?(chrome )?extension|need (the )?(chrome )?extension|open in (the )?extension|where (do i|can i|to) (run|find)/i.test(msg),
                why: 'mentions installing / lacking / needing the Chrome extension, or asking where to run'
            }
        ]
    }

    static async invoke(input) {
        return {
            response: {
                message: `Your axioms run in the Axiom Chrome extension. Visit ${AXIOM_URL} to install it, then log in with the same email you used for your API key — your saved axioms will be listed in the dashboard.`,
                data: {websiteUrl: AXIOM_URL, chromeStoreUrl: CHROME_STORE_URL},
                nextSteps: [
                    `Open ${AXIOM_URL} in Chrome (or go directly to ${CHROME_STORE_URL})`,
                    'Click the install / "Add to Chrome" button',
                    'Sign in to the extension with the same email used when minting your API key',
                    'Your saved axioms will appear in the extension\'s dashboard'
                ]
            },
            debug: {route: HandoffToExtensionWorkflow.key}
        }
    }
}

module.exports = {HandoffToExtensionWorkflow, AXIOM_URL, CHROME_STORE_URL}
