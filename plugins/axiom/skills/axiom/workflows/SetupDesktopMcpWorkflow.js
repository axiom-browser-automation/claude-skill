/**
 * SetupDesktopMcpWorkflow — walk the user through installing the Axiom
 * desktop app and registering its built-in MCP server with Claude.
 *
 * The desktop app bundles the `axiom-mcp` stdio server as a sidecar binary.
 * Registering it is what switches this skill into "MCP mode" (SKILL.md
 * Step 0.5): the mcp__axiom__* tools give live selector probing, one-call
 * save, and runs. Without it the skill keeps working exactly as before —
 * the setup is an upgrade, never a requirement.
 *
 * Guidance-shaped like HandoffToExtensionWorkflow. The mechanics live in
 * scripts/setup-desktop-mcp.js, which Claude drives step by step where a
 * CLI can do the whole job (Linux) and quotes from where the install is a
 * GUI affair (macOS / Windows → the app's tray "Set up Claude MCP…", which
 * takes the API key in its own key field).
 */

const DOWNLOAD_INDEX_URL = 'https://axiom.ai/axiom_desktop/'
const INSTALL_PAGE_URL = 'https://axiom.ai/install-desktop-app'

// Both halves must be present: a setup-ish verb AND the desktop app / MCP as
// its object. "set up a bot" and "use mcp to scrape" must not land here.
const SETUP_VERB = /set\s*-?\s*up|install|download|configure|enable|register|connect/i
const SETUP_TARGET = /desktop\s*app|\bmcp\b/i

class SetupDesktopMcpWorkflow {
    static key = 'setup_desktop_mcp'
    static description = 'Install the Axiom desktop app and register its built-in MCP server with Claude, so the skill gains live-browser, save, and run tools (MCP mode).'

    static getRoutes() {
        return [
            {
                key: SetupDesktopMcpWorkflow.key,
                match: (msg) => (SETUP_TARGET.test(msg) && SETUP_VERB.test(msg)) || /connect claude to axiom/i.test(msg),
                why: 'mentions setting up / installing the desktop app or the Axiom MCP server'
            }
        ]
    }

    static async invoke(input) {
        return {
            response: {
                message: `The Axiom desktop app ships a built-in MCP server. Once it's registered, new Claude sessions gain the mcp__axiom__* tools — live browser probing, one-call save, and runs. Download the app from ${INSTALL_PAGE_URL}, then register the MCP server: on Linux the skill's setup-desktop-mcp.js script can do the whole thing (download, extract the axiom-mcp sidecar, register); on macOS / Windows install the app, open its tray menu → "Set up Claude MCP…" and paste your API key into the key field. Restart Claude Code afterwards — the tools appear in a new session.`,
                data: {
                    downloadIndexUrl: DOWNLOAD_INDEX_URL,
                    installPageUrl: INSTALL_PAGE_URL,
                    setupScript: 'scripts/setup-desktop-mcp.js',
                    platformNotes: {
                        linux: 'fully automatable — resolve → download → extract → register; the MCP server needs no GUI install',
                        darwin: 'install the .dmg by hand, then tray menu → "Set up Claude MCP…" (the app\'s API-key entry)',
                        win32: 'install the -setup.exe (or .msi) by hand, then tray menu → "Set up Claude MCP…" (the app\'s API-key entry)'
                    }
                },
                nextSteps: [
                    `Download the desktop app from ${INSTALL_PAGE_URL} (artifact index: ${DOWNLOAD_INDEX_URL})`,
                    'Install it — on Linux the skill can instead extract the bundled axiom-mcp sidecar straight from the .deb',
                    'Register the MCP server: Linux → node scripts/setup-desktop-mcp.js register --sidecar <path> (the key is read from AXIOM_API_KEY and sent over stdin, never argv); macOS / Windows → tray menu → "Set up Claude MCP…", paste the API key',
                    'Restart Claude Code (or reconnect via /mcp) — the mcp__axiom__* tools only appear in a new session'
                ]
            },
            debug: {route: SetupDesktopMcpWorkflow.key}
        }
    }
}

module.exports = {SetupDesktopMcpWorkflow, DOWNLOAD_INDEX_URL, INSTALL_PAGE_URL}
