# Agent notes — this repo is the canonical shared knowledge source

All agent-facing knowledge about the Axiom MCP tools and APIs has ONE
canonical home: `plugins/axiom/skills/axiom/references/` in this repo —
tool manuals under `tools/`, the `@axiom_ai/api` surface + method
allowlists, the action vocabulary, and the shared browser-automation
rules. Two audiences consume it:

- **Desktop Claude users** — via the axiom skill itself.
- **The OpenHands configure agent** — via GENERATED copies:
  `axiom_lar/resources/agent-tools/` (embedded into every agent
  conversation's system prompt) and the OpenHands sandbox image's
  `tools-*.md` + `AXIOM_AGENT_SKILL.md` (built from
  `AXIOM_AGENT_SKILL.template.md`, which pulls shared prose with
  `<!-- INCLUDE <references-path> -->` markers).

Rules when editing knowledge here:

- **Never edit a synced or generated copy** in the consumer repos (each
  carries a do-not-edit banner). Edit the canon here — or the sandbox
  template, for OpenHands-runtime-specific prose — then run
  `axiom_monorepo/tools/sync-agent-knowledge.sh` to regenerate every
  consumer. `--check` is the drift detector (non-zero on stale copies).
- **Content true for BOTH audiences belongs in `references/`**; only
  runtime-specific prose stays in an actor file or template. The desktop
  skill's account-setup/key-minting content must NEVER flow to the
  OpenHands agent (its credential is an injected job-scoped secret).
- **A canon edit has deploy costs**: lar deploy (new conversations embed
  it; parked warm slots self-invalidate via prompt_hash) and a sandbox
  image rebake for on-disk copies. Batch edits; bump the version in
  `package.json` and add a CHANGELOG entry — consumers pin to it.
- `references/action-vocabulary.json` is also bundled into axiom_mcp's
  `list_actions` tool: treat its schema as an API.
- Agent precedence, by design: job brief > actor skill > tool manuals.
  Brief-level policy (never-invent user values, ask-on-ambiguity) lives in
  `axiom_lar` `AgentJobBrief`, not here.
