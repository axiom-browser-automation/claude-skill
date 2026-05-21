/**
 * SignupWorkflow — user has no Axiom account or no API key; bootstrap them.
 *
 * Wraps scripts/signup-and-mint-key.js. The script is the source of truth for
 * the actual REST choreography (POST /api/user/create → /login → /key/create);
 * this workflow is the discovery + intent-matching shell around it.
 */

const {signupAndMintKey} = require('../scripts/signup-and-mint-key.js')

class SignupWorkflow {
    static key = 'signup'
    static description = 'User has no Axiom account or no API key — bootstrap them through signup, login, and key minting.'

    static getRoutes() {
        return [
            {
                key: SignupWorkflow.key,
                match: (msg) => /sign\s*me\s*up|don'?t have an account|no api key|(need|get me|want)\s+an?\s+((api\s*)?key|account)|create an account|onboard/i.test(msg),
                why: 'mentions signup / lack of account / lack of API key'
            }
        ]
    }

    /**
     * @param {import('./types').WorkflowInput} input
     * @returns {Promise<import('./types').WorkflowResult>}
     */
    static async invoke(input) {
        const start = Date.now()
        const opts = input.opts || {}
        const env = input.env || process.env

        const result = await signupAndMintKey({
            email: opts.email,
            password: opts.password || env.AXIOM_PASSWORD,
            name: opts.name,
            existing: opts.existing,
            checkOnly: opts.checkOnly,
            baseUrl: env.AXIOM_LAR_URL,
            fetchImpl: input.fetchImpl
        })

        return {
            response: {
                message: result.apiKey
                    ? `Minted API key for ${result.userEmail} (user id ${result.userId}). Persist it under AXIOM_API_KEY.`
                    : `Account check complete for ${result.userEmail}: hasExistingKey=${result.hasExistingKey}.`,
                data: result,
                nextSteps: result.apiKey
                    ? ['Write the API key to ~/.claude/settings.json env block', 'Export AXIOM_API_KEY in current shell', 'Continue to build_no_code or build_coded']
                    : ['User already has a key; ask them to paste it or pass --existing to mint a fresh one (which invalidates the old)']
            },
            debug: {route: SignupWorkflow.key, durationMs: Date.now() - start}
        }
    }
}

module.exports = {SignupWorkflow}
