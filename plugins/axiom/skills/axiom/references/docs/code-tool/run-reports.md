---
title: Run reports
metaTitle: Monitor Code Tool script runs in the dashboard
description: View in-progress and completed Code Tool runs, watch live runs, check durations, and inspect errors and run details from the dashboard.
order: 5
---

Run reports show every Code Tool run you've started, alongside any in-progress runs. Use them to track how long scripts take, watch live runs, and inspect errors after a run fails.

## Open run reports
***

Click **Run reports** in the dashboard navigation. You'll see a list of completed and in-progress runs. Each row shows:

- The run's status.
- A unique run identifier.
- The start date and time.
- The runtime in seconds.
- A details link.

## Watch a live run
***

While a run is in progress, the row includes a **Watch** link. Click it to open a live view of the hosted browser executing your script. This is the same view as the Playground browser panel, but for a script running outside the Playground.

## View run details
***

Click **Details** on a row to open the full report for that run. The details view shows:

- The version of axiom.ai used to execute the script.
- Any errors thrown during execution, with stack traces where available.

For background on debugging script errors, see [debug developer features](/docs/developer-hub/troubleshooting/debug).