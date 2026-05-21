---
title: Runtime and scheduling FAQ
metaTitle: Common questions about runtime, scheduling, and automation behaviour
description: Answers to common questions about runtime allowances, scheduling, automation speed, concurrency, queueing, and triggering automations from external tools.
order: 3
---

## Do failed or stopped runs use up runtime?
***

No. Only successful runs count against your runtime allowance, on both desktop and cloud.

## How do I stop axiom.ai from auto-starting on my computer?
***

Every operating system has its own way to remove apps from the startup list. Search "remove from startup" plus your operating system name for current instructions.

## My automation is slow. How do I speed it up?
***

The right fix depends on what's slowing things down. axiom.ai prioritises reliability and accuracy over raw speed, so always test changes after applying them.

For a full walkthrough, see [speed up an automation run](/docs/tutorials/speed-up-run). Common quick wins:

- Use [block resources](/docs/no-code-tool/reference/settings/run-options/block-resources) to skip images, fonts, and ads on heavy pages.
- Lower the `Number of retries` in the step's [scraper configuration](/docs/no-code-tool/how-it-works/get-data/configuring-your-scraper).

## How do I continue when a button isn't always present?
***

A [**Click element**](/docs/no-code-tool/how-it-works/browser-actions/clicks) step throws an error if the button isn't found. To skip the error and continue to the next step, enable [optional click](/docs/no-code-tool/how-it-works/browser-actions/clicks#automate-a-click-when-the-button-is-not-always-found-optional-click) in the step settings.

## My scheduled automation runs at the wrong time. What should I do?
***

Cloud runs use UTC by default. If the time of the run doesn't match the timezone of the site you're automating, change the timezone setting:

1. Open the automation and click the **Cog** icon in the toolbar on the left.
2. Open the **Run options** section.
3. Open the [**Configure timezone**](/docs/no-code-tool/reference/settings/run-options/timezone) section.
4. Pick the timezone the schedule should use.

## How do I speed up the scraper?
***

The scraper has [configuration settings](/docs/no-code-tool/how-it-works/get-data/configuring-your-scraper) that affect speed. The most impactful is `Number of retries`. Lowering it makes the step faster but less tolerant of slow-loading pages.

## Can axiom.ai run in my current Chrome tab?
***

By default, axiom.ai launches a new Chromium window. To attach to an existing Chrome window instead, use [bypass bot detection](/docs/no-code-tool/reference/settings/chrome/bypass-bot-detection) with the **Attach to existing Chrome** option. This requires starting Chrome with the remote-debugging flag.

## Does unused runtime carry over between billing periods?
***

No. Runtime resets at the start of each billing period and unused minutes don't roll over. Every period starts with the full runtime allowance for your plan.

## When does runtime refresh?
***

Runtime refreshes on the day of the month you subscribed. For example, if you subscribed on the 4th of January, your runtime refreshes on the 4th of every following month, or the closest available date in months with fewer days. Unused runtime doesn't roll over.

## Can I schedule an automation more than once a day?
***

Locally, yes. The desktop scheduler can run automations as often as every minute. In the cloud, the maximum frequency depends on your plan; some plans cap cloud runs at once per day.

## My new runtime isn't showing after upgrading. What should I do?
***

Try these in order:

1. **Restart your browser.** Close Chrome completely and reopen it.
2. **Sign out and back in.** Sign out of axiom.ai, then sign in again.
3. **Contact support.** If neither of the above works, email `support@axiom.ai`.

## Which plans support scheduling?
***

[Scheduling](/docs/no-code-tool/reference/settings/run-options/schedule) is available on the Pro plan and higher.

## My automation runs but no data is written to Google Sheets
***

The most common cause is that the [**Write data to a Google Sheet**](/docs/no-code-tool/integrations/google-sheets#write-data-to-a-google-sheet) step has no `Data` value set. Open the step, click **Insert data** in `Data`, and pick the variable from the previous step you want to write.

For background on moving data between steps, see [pass data between steps](/docs/no-code-tool/the-builder/pass).

## Page elements load slowly. How do I make the scraper wait?
***

axiom.ai waits for page changes by default, but some pages load slower than the detection allows. To force a longer wait, increase `Minimum wait before scraping (ms)` in the step's scraper configuration:

1. Open the automation.
2. Open the scrape step you want to adjust.
3. Click [**Configure scraper**](/docs/no-code-tool/how-it-works/get-data/configuring-your-scraper#minimum-wait-before-scraping-ms).
4. Set `Minimum wait before scraping (ms)` to your desired wait. 1000 ms equals 1 second.

## The scraper returns inconsistent results across pages
***

This is most often caused by CSS selectors that don't generalise across pages. Try these in order:

1. Switch to [custom CSS selectors](/docs/no-code-tool/the-builder/selector-tool/custom-css-selectors) that target stable attributes.
2. Use the [AI web scraper template](/guides/ai-proofreading) (requires an OpenAI API key).
3. [Contact support](/customer-support) with examples of pages that work and pages that don't.

## My automation is stuck on Running
***

The most common cause is that the computer or network connection dropped while the automation was running. The run actually stopped, but the extension didn't receive the status update.

Try these in order:

1. Refresh the dashboard tab and reopen axiom.ai.
2. If that doesn't work, restart Chrome.
3. If that doesn't work, see [stop a run](/docs/tutorials/stop-bot-runs).

If the run is still stuck after all three, [contact support](/customer-support).

## Pages don't load through my proxy
***

If a [proxy](/docs/no-code-tool/reference/settings/run-options/proxy) is configured correctly but the target page won't load, the most likely cause is that the proxy's IP has been blocked or blocklisted by the target site. Many sites maintain lists of known proxy and datacenter IPs and refuse traffic from them.

To confirm, change the **Go to page** step to a different URL (something like `https://example.com`) and run the automation again. If the test page loads, your proxy works in general but is blocked by the original target site. Try these in order:

1. Switch to a different proxy or proxy region. Residential proxies are less likely to be blocked than datacenter proxies.
2. Ask your proxy provider whether they offer a region or pool tuned for the target site.
3. If the issue persists across multiple proxies, the target site may simply not allow proxied traffic.

If the test page also fails to load, the issue is with the proxy connection itself. See the [proxy troubleshooting section](/docs/no-code-tool/reference/settings/run-options/proxy#troubleshooting) for the next steps.

## How do I make an automation ignore all errors?
***

Enable [continue on error](/docs/no-code-tool/reference/settings/error-handling/continue-on-error):

1. Open the automation and click the **Cog** icon.
2. Open the **Continue on error** section.
3. Toggle `Continue on error` on.

> **Note:** With this setting on, every run reports as **successful** at the end regardless of how many errors occurred. Errors appear as warnings in run reports.

## Are runs ever queued?
***

Yes. Runs triggered by Zapier, Make, n8n, or the API are queued when your account exceeds its [concurrency](/docs/no-code-tool/reference/settings/run-options/concurrency) limit. Queued runs retry every five minutes until they can run.

If you regularly hit the concurrency limit, runs may take a long time to complete or never run at all. For a custom concurrency package, email `support@axiom.ai`.

## Can I run multiple instances of the same automation in parallel?
***

By default, no. Each automation can only have one instance running at a time. The same account can run different automations in parallel up to its concurrency limit, but not the same automation twice.

To run the same logic concurrently, use **Save as duplicate** from the Builder menu to create as many copies of the automation as you need parallel runs. Each duplicate counts as a separate automation and can run independently of the others.

## Can I trigger an automation with Apple Shortcuts?
***

Yes. You can trigger axiom.ai automations from [Apple Shortcuts on macOS or iOS](/guides/apple-shortcuts). You can also run shortcuts from the command line, or pin them to the macOS Dock.

## Can I run an automation on an iPhone?
***

You can trigger an automation from an iPhone (typically via Apple Shortcuts), but the automation itself runs on the axiom.ai cloud, not on the iPhone. See the [Apple Shortcuts guide](/guides/apple-shortcuts).

## Can I pause an automation mid-run?
***

Use the [**Wait**](/docs/no-code-tool/how-it-works/browser-actions/wait) step to pause for a fixed duration. There's no manual pause control during a run.

## Can I interact with the browser during a run?
***

On the desktop and on a VPS, yes. In the cloud, no. Interaction with the cloud browser isn't permitted for security reasons. When interacting with the desktop browser during a run, consider adding a [**Wait**](/docs/no-code-tool/how-it-works/browser-actions/wait) step so the automation pauses while you act.

## Can Zapier trigger a desktop run?
***

Not directly, because Zapier triggers are web-based and the desktop runner doesn't have a public webhook endpoint. The standard workaround uses Google Sheets as a middleman:

1. In Zapier, write a new row to a Google Sheet when you want the automation to run.
2. Schedule the axiom.ai automation to run every minute on the desktop.
3. The first step in the automation reads the sheet with [**Read data from a Google Sheet**](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step). If a row exists, the automation continues.
4. The last step deletes the row with [**Delete rows from a Google Sheet**](/docs/no-code-tool/reference/steps/delete-rows-from-a-google-sheet) so the same trigger doesn't fire twice.

For more, see [trigger a desktop run with webhooks](/guides/trigger-desktop).

## Can I share my runtime with my team?
***

Yes. Ultimate subscribers can share runtime by setting up a [team account](/docs/no-code-tool/account/manage-account#set-up-a-team-account).