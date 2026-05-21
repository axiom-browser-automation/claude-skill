---
title: Dashboard redesign, better conditionals, stop remote bots, and more
date: 2022-08-22
version: 3.11
featuredimg: /version3.11.0-2.jpg
---

## New features
***

- All remote running bots (scheduled or via Zapier, API etc.) now show up as running in the main axiom.ai dashboard and can be stopped from there.
- Conditional steps now have a “not” toggle, allowing jumping or continuing on error when a condition does not match.
- New, cleaner dashboard design with integrated documentation.
- “Continue on error” now prevents sub-steps within loops from being skipped when there’s an error.
- Speed improvements on select list and when clicking by text.
- Suggest a template banner and link added to step finder.

## Bug fixes
***

- Fixes to data replacement within javascript widgets for some data types.
- Alerts now always automatically confirm, and correctly confirm in newly open tabs.
- Improvements to preview result display.
- Duplicate axioms now automatically renamed.
- Download link to desktop app now available under run button.