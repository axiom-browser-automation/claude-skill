---
title: Cookies in axiom.ai
metaTitle: How axiom.ai stores and applies cookies in automations
description: A deep dive into how axiom.ai stores cookies for automations, how cookies behave when an automation is duplicated, and why resyncing is sometimes required.
order: 3
---

axiom.ai uses stored cookies to keep an automation signed into a target site between runs. The behaviour is straightforward most of the time, but a few corners (especially around duplication and the local browser state) catch users out. This page covers how cookies are stored, when they're applied, and what to do when something goes wrong.

For the user-facing how-to on enabling cookie storage, see [store cookies](/docs/no-code-tool/reference/settings/run-options/store-cookies).

## How axiom.ai stores cookies
***

When the [store cookies](/docs/no-code-tool/reference/settings/run-options/store-cookies) setting is enabled for an automation, axiom.ai pulls the relevant cookies from your local browser and stores them in its database. The stored copy is:

- **Encrypted at rest.** Cookies are written to the database in encrypted form. Nobody at axiom.ai can read the cookie values directly.
- **Bound to the automation.** Each automation has its own copy. Two automations storing cookies for the same site each get their own encrypted entry.
- **Sourced from the local browser.** The cookies axiom.ai stores come from your local browser at the moment you save the automation or click **Resync cookies**. There's no other source.

Cookies are applied to the cloud browser before each cloud run, so the automation's session matches your local one. Local runs use your local browser session directly without going through stored cookies.

## How duplication affects cookies
***

When you duplicate an automation, axiom.ai re-reads cookies from your local browser and stores a fresh encrypted copy against the new automation. The original and the duplicate end up with separate copies.

This usually works seamlessly. The cases where it doesn't:

- **The cookies aren't in your local browser at duplication time.** If you've cleared cookies, signed out of the target site, or used a different browser profile since the original was created, the local source is gone. The duplicate gets stored against the new automation, but with empty or stale values.
- **You signed out of and back into the target site.** Logging out invalidates the original cookie, even though it's still stored in axiom.ai's database. The next run uses an invalid cookie and fails authentication.

In both cases the fix is to **resync** the cookies on the duplicated automation. Resyncing pulls the current cookies from your local browser into the duplicate's encrypted storage, replacing whatever was there.

## Resync cookies
***

Resync whenever you suspect the stored cookie is out of date. Common triggers:

- After signing out and back into the target site.
- After clearing cookies in your browser.
- After duplicating an automation that depends on cookies.
- After moving to a different machine or browser profile.

To resync:

1. Open the automation and click the **Cog** icon in the toolbar on the left.
2. Open the **Store cookies** section.
3. Click **Resync cookies** for the URL you want to refresh, or **Globally resync cookies** to refresh every automation that uses the same URL.

For step-level details, see [store cookies](/docs/no-code-tool/reference/settings/run-options/store-cookies#configure-stored-cookies).

## Inspecting stored cookies
***

axiom.ai doesn't expose stored cookie values, domains, or expiry through the UI. Cookies are stored encrypted, and the UI only shows which URLs have cookies stored against them, not what's inside.

For developer-level inspection, you can use Chrome DevTools to watch the GraphQL `tasks` query the dashboard makes when loading an automation. The query response contains the cookie metadata for each automation. The cookie values themselves remain encrypted and unreadable.

> **Note:** Inspecting the GraphQL response is for development debugging only. Don't rely on this for day-to-day cookie management; use **Resync cookies** instead.

## Common scenarios
***

### A duplicated automation works at first, then fails

Most likely cause: the original cookie expired or was invalidated by signing out of the target site. The original automation may also be failing for the same reason, just less obviously if it's run more recently.

**Fix:** Resync cookies on both the original and the duplicate.

### A duplicated automation fails immediately

Most likely cause: the cookies for the target site weren't in your local browser at the moment you duplicated. axiom.ai stored an empty or stale copy.

**Fix:** Sign in to the target site in your local browser to refresh the cookies there, then resync cookies on the duplicate.

### Two duplicates of the same automation behave differently

This is consistent with the storage model: each duplicate gets its own encrypted copy at duplication time. If your local browser state was different between duplications (different sign-in state, different time, different profile), the copies stored against each duplicate will differ.

**Fix:** Resync cookies on each duplicate so they all use the current local browser state.

### A duplicated automation works, but cookie storage feels fragile

This is the recommended pattern for any automation that depends on stored cookies, especially after duplication: **resync cookies as part of your duplication workflow**, not as something you only do when something breaks. It's a one-click action, and it removes the largest source of cookie-related failures.

## Best practices
***

- **Enable [run notifications](/docs/no-code-tool/reference/settings/run-options/notifications)** for automations that depend on cookies. You'll find out as soon as a cookie expires rather than discovering it in run reports days later.
- **Resync cookies after duplication.** Don't rely on the duplicate inheriting working cookies from the original.
- **Don't sign out of the target site in your local browser** if you have automations that use stored cookies for that site. Signing out invalidates the cookies in axiom.ai's storage too.
- **Use one browser profile for cookie sources.** Cookies stored against an automation come from whichever browser profile was active when you saved or resynced. Switching profiles can invalidate the source.

## Limitations
***

- Cookie values, domains, and expiry can't be inspected directly from the UI.
- Cookies are bound to the automation that stored them. There's no shared cookie pool across automations except via the **Globally resync cookies** action, which still produces separate copies.
- axiom.ai can't refresh cookies on its own. If the source cookies in your local browser are gone or expired, the automation needs a manual resync.