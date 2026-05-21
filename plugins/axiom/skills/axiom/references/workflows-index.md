# Skill workflow index

The skill exposes **five workflows** — discrete capabilities Claude routes between
based on the user's prompt. They live in `plugins/axiom/skills/axiom/workflows/`
as a code-based registry: `key`, `description`, `getRoutes()`, `invoke()`. Single-turn
shape — no hook bus, no return stack, no multi-turn state.

## The five workflows

| Order | Key | Description | Wraps |
|---|---|---|---|
| 1 | `signup` | User has no Axiom account / no API key — bootstrap them through signup + key minting. | `scripts/signup-and-mint-key.js` |
| 2 | `build_no_code` | Emit a no-code AutomationTemplate JSON, validate, save to the user's account. | `scripts/validate-no-code.js` + `scripts/save-to-axiom-lar.js` |
| 3 | `build_coded` | Emit a Node script using `@axiom_ai/api`. User runs it from their own code. | `scripts/validate-coded.js` |
| 4 | `run_automation` | Trigger a saved axiom by name, poll binary status, surface results. | `scripts/run-axiom.js` (existing `/v3/v4` REST surface — see [run-automation caveats](#run_automation-caveats)) |
| 5 | `handoff_to_extension` | Tell the user how to install the Axiom Chrome extension so they can find and run their saved axioms. | (inline guidance — no script) |

## How Claude uses them

1. **Look up by intent**: scan the workflows' `description`s — if one matches the user's
   prompt, that's the path. Use `node workflows/index.js dispatch --message "..."` to
   reproduce the routing decision.
2. **Invoke**: for `signup` / `build_no_code` / `build_coded`, Claude writes/composes the
   artifact, then invokes the workflow which validates + saves. For `run_automation` /
   `handoff_to_extension`, Claude just calls the workflow with the right opts.
3. **Read the result**: each `invoke()` returns `{response: {message, artifacts?, nextSteps?, data?}, debug}`.
   The `nextSteps` field is the most important — it tells the user (and Claude) what
   logically follows.

## Routing precedence

Registration order in `WorkflowRegistry.js` is the routing order. `signup` is first so
"I don't have an account" doesn't fall through to a build flow. Each workflow's
`getRoutes()` returns one or more `{key, match: regex-test, why}` conditions; the
first match across all workflows wins.

When routing returns `null` (no match), Claude should ask one clarifying question
rather than guessing.

## CLI

```bash
node plugins/axiom/skills/axiom/workflows/index.js list
node plugins/axiom/skills/axiom/workflows/index.js dispatch --message "trigger my Maps scraper"
node plugins/axiom/skills/axiom/workflows/index.js invoke run_automation '{"name": "My Scraper", "mode": "wait"}'
```

The CLI is used by tests (routing/registry assertions go via JSON output) and by power
users driving the skill outside a Claude session.

## `run_automation` caveats

The `run_automation` workflow drives Axiom's existing REST surface (`/v3/list-automations`, `/v4/trigger`, `/v3/run-data`) rather than introducing new id-based endpoints. The benefit is zero backend cost; the price is that the existing surface is name-based and stateless, which shows through:

- **No run identity.** "Status: Finished" means "no pod is currently running this name for this user" — not "the run *you* started has ended". If the user has another run of the same axiom going (scheduled, from the dashboard, or from a previous skill invocation), the status flips to `Finished` when *that* one ends.
- **Status is binary.** `Running` or `Finished`. A run that errored mid-way ends as `Finished`, identical to success. The workflow surfaces this explicitly in its `status`-mode message.
- **Output is Google-Sheets-only.** `/v3/run-data` walks the task definition looking for `WidgetWriteGoogleSheet` widgets and returns their rows. Other scraped data is invisible.
- **No cancel mode.** `/v4/stop` requires `{pw, pid, taskId}` — pod credentials we can only partially recover from the trigger response's VNC URL. Until there's a clean cancel-by-name endpoint, users should cancel via the Axiom dashboard.
- **Trigger returns a VNC URL.** That's the user-visible artifact: open it in a browser to watch the axiom run. The skill's `trigger` mode message includes the URL.

These caveats are stable — they're properties of the underlying REST surface, not of the wrapping client. Tests pin them by asserting on the human-readable messages the workflow emits.

## What this is NOT

- **Not a runtime dispatcher.** Claude reads SKILL.md + this index and picks a workflow
  in-context. The `WorkflowRegistry.route()` function is a *deterministic check* against
  Claude's choice, not the actual decision maker.
- **Not a copy of the in-app builder's dispatcher.** That system uses a hook bus, a return
  stack, and multi-turn session state — none of which survive the translation to a
  single-turn skill.
- **Not user-extensible at runtime.** Adding a sixth workflow means committing a new
  `*Workflow.js` to the registry + adding tests. There's no plugin-of-a-plugin layer.

## Future: extension ↔ Claude live channel

The handoff workflow is one-way: skill → extension. The natural follow-up is two-way
iteration where the extension publishes edit events back to Claude. The registry pattern
introduced here is the extension point — a sixth workflow `extension_event_stream` would
slot in without disturbing the existing five.
