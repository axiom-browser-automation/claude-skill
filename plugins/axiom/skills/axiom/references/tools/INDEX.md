# Axiom tool knowledge — index

Structured, verified knowledge for driving Axiom's browser-automation tools.
One file per tool area, every file the same shape: **When to use · Call
shapes · Failure modes · Anti-patterns**. Every fact here was verified
against the live platform — when reality and this document disagree, report
the discrepancy; do not silently work around it.

Read order for a configure/build task:

| File | Read when |
|---|---|
| [sessions.md](sessions.md) | ALWAYS — before your first browser call |
| [scrape.md](scrape.md) | the task extracts any page data |
| [navigation.md](navigation.md) | ALWAYS — goto, consent walls |
| [outputs.md](outputs.md) | the task writes to Google Sheets / files |
| [compile-save.md](compile-save.md) | ALWAYS — before compiling/saving the automation |

These are the ACTOR-INDEPENDENT tool mechanics. Actor-specific mechanics
(how YOUR runtime injects credentials, which helper scripts exist in YOUR
sandbox) live in your actor skill, and per-job specifics (the task, the
user's values, the completion protocol) arrive in your job brief. Precedence:
brief > actor skill > these docs.
