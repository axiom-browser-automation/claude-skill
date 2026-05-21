# No-code vs coded — how to decide

Two output paths. Pick before producing anything. If the user's intent is ambiguous, ask one clarifying question rather than guessing.

## Pick no-code (JSON) when the user

- Talks about an "axiom" they want to **save** or have running in their account.
- Mentions **scheduling** ("every day at 9am", "every Monday", "every hour").
- Wants something a non-developer teammate could see, edit, or run.
- Uses dashboard language ("in my Axiom account", "from the builder", "set up a bot").
- Wants webhook / Zapier / Make integration triggers.
- Is going to share the automation with someone who isn't a developer.

**Output:** An `AutomationTemplate` JSON file conforming to [`automation-template-schema.json`](./automation-template-schema.json). Validate it with `npm run validate:no-code -- path/to/file.json` before declaring done.

## Pick coded (JavaScript) when the user

- Says "script", "code", or names a language (Node, TypeScript, JavaScript).
- Wants the automation to live in their own repo / service / CI.
- Needs to react dynamically to outputs ("if it scrapes more than 10, do X").
- Will compose Axiom calls with non-Axiom logic (sheet writes, queue jobs, downstream API calls).
- Mentions running from a specific event (cron job they own, webhook handler they own, queue consumer).
- Wants tight feedback loops while developing.

**Output:** A Node script that imports `@axiom_ai/api`. See [`axiom-api-surface.md`](./axiom-api-surface.md) for the method list. Validate with `npm run validate:coded -- path/to/file.js` before declaring done.

## Ambiguous? Ask.

Default decision tree for ambiguous prompts:

1. If they mention a schedule → no-code.
2. If they mention a language or "script" → coded.
3. Otherwise, ask: *"Would you like this saved as a no-code axiom in your Axiom account (schedulable, shareable, runs in the dashboard), or as a Node script you can run from your own code?"*

Don't decide both. Produce one artifact per request.

## Examples

| User prompt | Path |
|---|---|
| "Scrape every product on this page" | Ask — could be either. |
| "Build me a bot that scrapes prices daily" | **No-code.** "Daily" implies a saved scheduled axiom. |
| "Give me a Node script that scrapes prices" | **Coded.** "Node script" is explicit. |
| "I want to save an axiom that logs into X and downloads the latest report" | **No-code.** "Save" + dashboard verb. |
| "From my CI job I need to launch an Axiom session and scrape" | **Coded.** "From my CI" rules out the dashboard. |
| "Set up an axiom that runs every Monday morning" | **No-code.** Schedule. |
