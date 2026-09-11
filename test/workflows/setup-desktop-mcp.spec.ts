/**
 * SetupDesktopMcpWorkflow — guidance for installing the desktop app and
 * registering its MCP server (the skill's "MCP mode" upgrade).
 *
 * Same shape as the handoff spec: pin the message/data/nextSteps contract
 * and the routing-regex coverage. The negative rows matter most — this is
 * the LAST workflow in the registry, and its trigger must not swallow build
 * ("set up a bot") or extension-install prompts.
 */

// @ts-expect-error — pure JS module
import {SetupDesktopMcpWorkflow, DOWNLOAD_INDEX_URL, INSTALL_PAGE_URL} from '../../plugins/axiom/skills/axiom/workflows/SetupDesktopMcpWorkflow.js'

describe('SetupDesktopMcpWorkflow.invoke()', () => {
    test('returns a message pointing at the install page and the tray setup', async () => {
        const result = await SetupDesktopMcpWorkflow.invoke({message: ''})
        expect(result.response.message).toContain(INSTALL_PAGE_URL)
        expect(result.response.message).toMatch(/Set up Claude MCP/)
        expect(result.response.message).toMatch(/mcp__axiom__/)
    })

    test('returns nextSteps covering download, register, and restart', async () => {
        const result = await SetupDesktopMcpWorkflow.invoke({message: ''})
        const joined = result.response.nextSteps.join(' | ')
        expect(joined).toContain(INSTALL_PAGE_URL)
        expect(joined).toContain(DOWNLOAD_INDEX_URL)
        expect(joined).toMatch(/setup-desktop-mcp\.js register/)
        expect(joined).toMatch(/Restart Claude Code/)
    })

    test('never suggests passing the key as an argument', async () => {
        const result = await SetupDesktopMcpWorkflow.invoke({message: ''})
        const all = [result.response.message, ...result.response.nextSteps].join(' ')
        expect(all).not.toMatch(/--key/)
        expect(all).toMatch(/stdin/)
    })

    test('attaches the canonical URLs and script path to response.data', async () => {
        const result = await SetupDesktopMcpWorkflow.invoke({message: ''})
        expect(result.response.data.downloadIndexUrl).toBe(DOWNLOAD_INDEX_URL)
        expect(result.response.data.installPageUrl).toBe(INSTALL_PAGE_URL)
        expect(result.response.data.setupScript).toBe('scripts/setup-desktop-mcp.js')
        expect(Object.keys(result.response.data.platformNotes).sort()).toEqual(['darwin', 'linux', 'win32'])
    })

    test('debug field records the route key', async () => {
        const result = await SetupDesktopMcpWorkflow.invoke({message: ''})
        expect(result.debug.route).toBe('setup_desktop_mcp')
    })

    test('does not accept or react to opts (the guidance is universal)', async () => {
        const withOpts = await SetupDesktopMcpWorkflow.invoke({message: '', opts: {platform: 'win32'}})
        const withoutOpts = await SetupDesktopMcpWorkflow.invoke({message: ''})
        expect(withOpts.response.message).toBe(withoutOpts.response.message)
    })
})

describe('SetupDesktopMcpWorkflow.getRoutes()', () => {
    const routes = SetupDesktopMcpWorkflow.getRoutes()
    const matcher = routes[0].match

    test.each([
        ['set up the desktop app', true],
        ['setup the axiom desktop app', true],
        ['install the axiom mcp server', true],
        ['download the desktop app', true],
        ['enable the mcp', true],
        ['configure the MCP server for claude', true],
        ['connect claude to axiom', true],
        ['install the chrome extension', false],
        ['I want to sign up', false],
        ['set up a bot that scrapes prices', false],
        ['use mcp to scrape this page', false],
        ['build me an axiom that scrapes a page', false]
    ])('match("%s") → %s', (msg, expected) => {
        expect(matcher(msg)).toBe(expected)
    })
})
