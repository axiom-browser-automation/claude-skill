---
title: Log in by sharing your session
metaTitle: Share a browser session to keep an automation signed in
description: Store browser cookies in axiom.ai so an automation stays signed in to a web app on desktop and cloud runs.
order: 2
---

The simplest way to automate login is to share your browser session. axiom.ai stores your cookie, and when the automation runs, you're already signed in.

For other login methods, see [Google Sheet steps](/docs/no-code-tool/how-it-works/login/steps), [VPS](/docs/no-code-tool/how-it-works/login/vps), [2FA](/docs/no-code-tool/how-it-works/login/2fa), [password managers](/docs/no-code-tool/how-it-works/login/password-manager), or [secure login](/docs/no-code-tool/how-it-works/login/secure).

## Store cookies for desktop runs
***

The [desktop runner](/docs/install#installing-the-desktop-app-optional) shares your browser cookie by default. Run the automation from a window where you're already signed in to the web app, and the session is reused automatically.

## Store cookies for cloud runs
***

For cloud runs, you have to opt in to cookie sharing on a per-automation basis.

1. In the automation, click the kebab menu in the top right corner and select **Settings**.
2. Click **Store cookies** under run options.
3. Toggle `Local cookies are used` to `Stored cookies are used`.
4. Click **Populate from Axiom** to fetch the cookies.

### Sessions expire

Sessions can last up to 100 days but eventually expire. To renew, resync the cookies using the button in the **Store cookies** settings panel.

### Turn on error notifications

When using cookies for cloud runs, turn on error notifications so you find out as soon as a session expires.

1. In the automation, click the kebab menu in the top right corner and select **Settings**.
2. Click **Set up notifications** under run options.
3. Toggle `Notify when run fails` on.
4. Choose to be notified by email or webhook.