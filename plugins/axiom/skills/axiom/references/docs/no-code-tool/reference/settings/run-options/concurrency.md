---
title: Concurrency
metaTitle: Run multiple instances of the same automation in parallel
description: Allow more than one instance of an automation to run at the same time on the cloud or desktop, or keep them sequential when order matters.
order: 8
---

Concurrency lets multiple instances of the same automation run at the same time. Useful when an automation is triggered repeatedly (by a webhook, a schedule, or a manual rerun) and you don't want each run to wait for the last one to finish. Turn it off when runs depend on each other, for example when both write to the same Google Sheet and would clash if they ran in parallel.

![The concurrency settings panel in the axiom.ai Builder](/docs/settings/concurrency-axiom-ai.jpg)

## Cloud concurrency
***

Toggle `Allow cloud concurrency` on to let multiple cloud runs of the automation fire at the same time.

Use it when:

- A webhook triggers the automation more often than a single run takes to finish.
- A schedule overlaps with manual runs.
- Each run is independent. It doesn't read or write data another run also touches.

Keep it off when runs share state, especially when both runs read from or write to the same Google Sheet, since simultaneous writes can overwrite each other.

## Desktop concurrency
***

Toggle `Allow desktop concurrency` on to let multiple desktop runs of the automation fire at the same time.

The same rules as cloud concurrency apply. Off by default. Desktop runs typically need the screen and a single browser session, so running several in parallel is more likely to clash.

## Set concurrency for an automation
***

1. Open the automation and click the **Cog** icon in the toolbar on the left.
2. Open the **Concurrency** section.
3. Toggle `Allow cloud concurrency` on or off.
4. Toggle `Allow desktop concurrency` on or off.

## Need more concurrency
***

Each plan ships with a default concurrency limit. To raise it, email [support@axiom.ai](mailto:support@axiom.ai) for a custom package.