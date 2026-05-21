---
title: Log in using a Google Sheet
metaTitle: Store login details in a Google Sheet for automated logins
description: Store usernames and passwords in a Google Sheet and read them into an automation at runtime to sign in to web apps.
order: 1
---

There are several ways to automate actions behind a login. The simplest is [sharing your session](/docs/no-code-tool/how-it-works/login/sessions). This page covers an alternative: storing login details in a Google Sheet and reading them in at runtime. We don't recommend storing passwords directly in step fields. All step data is encrypted at rest and in transit, but a Google Sheet is a more isolated store.

For other login methods, see [sessions](/docs/no-code-tool/how-it-works/login/sessions), [VPS](/docs/no-code-tool/how-it-works/login/vps), [2FA](/docs/no-code-tool/how-it-works/login/2fa), [password managers](/docs/no-code-tool/how-it-works/login/password-manager), or [secure login](/docs/no-code-tool/how-it-works/login/secure).

## Why a Google Sheet
***

Not everyone is comfortable storing passwords in Google Sheets, but Google operates one of the most heavily monitored security infrastructures on the internet, used by enterprises and governments worldwide. For most teams it is a reasonable trade-off between convenience and isolation.

## Set up the Google Sheet
***

Create a [Google Sheet](/docs/no-code-tool/integrations/google-sheets) and add columns for your login details. Don't share the sheet with anyone who doesn't need access.

## Build the login automation
***

The pattern is five steps:

1. **Read data from a Google Sheet**
2. **Go to page**
3. **Enter text** (username)
4. **Enter text** (password)
5. **Click element** (submit)

To build it:

1. Add a **Read data from a Google Sheet** step and select the sheet that contains your login details.
2. Add a **Go to page** step and set its URL to the sign-in page.
3. Add an **Enter text** step. Select the username field, click **Insert data**, choose the Google Sheet variable, and pick the column with the username.
4. Add another **Enter text** step. Select the password field, click **Insert data**, choose the Google Sheet variable, and pick the column with the password.
5. Add a **Click element** step and select the submit button using **Select by text**.

## Loop through multiple logins
***

To sign in to several accounts in a single run, wrap the login steps in a **Loop through data** step.

The pattern becomes:

1. **Read data from a Google Sheet**
2. **Loop through data**
   1. **Go to page**
   2. **Enter text** (username)
   3. **Enter text** (password)
   4. **Click element** (submit)
   5. **Loop through data** (the actions to perform once signed in)
   6. **Clear cookies**

To build it:

1. Tick the boxes next to the **Go to page**, both **Enter text** steps, and the **Click element** step. The Move toolbar appears at the top.
2. In the toolbar, click **Loop**. The selected steps are wrapped in a **Loop through data** step.
3. In the new **Loop through data** step, set `Data to loop through` to the Google Sheet variable.
4. Inside the loop, after the **Click element** step, add a nested **Loop through data** step. Add the actions to perform once signed in to each account.
5. At the end of the outer loop, add a **Clear cookies** step. This signs the automation out before the next iteration.

### Control how many accounts to sign in to

In the **Read data from a Google Sheet** step, set `First cell` and `Last cell` to limit the rows read. For example, `A1` to `B3` reads three rows from columns A and B, so the automation signs in to three accounts.