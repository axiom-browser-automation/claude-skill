---
title: General errors
metaTitle: Fix common general errors in axiom.ai automations
description: Errors that can occur during automation runs, including server errors, version mismatches, concurrency limits, and browser launch failures.
order: 2
---

The errors on this page are general issues that can occur during automation runs or when starting the desktop application.

## Internal server error
***

**Error:** Internal server error.

**Problem:** If you see this in the extension or when running an automation in the cloud, axiom.ai may be experiencing a service issue. If you see this on a page that isn't part of axiom.ai, contact the owner of that page.

**Fix:** The team is likely already working on a resolution. If the error persists, [contact support](/customer-support).

## This step does not exist in your version of the axiom.ai desktop application
***

**Error:** This step does not exist in your version of the axiom.ai desktop application.

**Problem:** A version mismatch between the installed desktop application and the automation you're running. The automation contains a step that was added in a newer version.

**Fix:** Update the [desktop application](/docs/install#installing-the-desktop-app-optional) by opening it. If the Builder shows update prompts, follow them to update individual steps to the latest version.

## Concurrency limit reached
***

**Error:** All of your concurrency allocations are currently in use. Click below to stop them, or wait for them to finish.

**Problem:** Your account has hit its concurrency limit. See the [pricing page](/pricing) for the limits on each plan.

**Fix:** Wait for in-flight runs to finish, or upgrade your plan for more [concurrency](/docs/no-code-tool/reference/settings/run-options/concurrency).

## Cloud servers busy
***

**Error:** Oh no, all our cloud servers are busy right now.

**Problem:** Very rare. axiom.ai's cloud capacity is fully in use.

**Fix:** Try again in a few minutes, or run the automation locally in the [desktop app](/docs/install#installing-the-desktop-app-optional).
