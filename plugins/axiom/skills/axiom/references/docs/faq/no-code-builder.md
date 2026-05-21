---
title: Builder FAQ
metaTitle: Common questions about the axiom.ai Builder and No-Code Tool
description: Answers to common questions about the axiom.ai No-Code Tool, including JavaScript support, captchas, login automation, loops, and Chrome extension automation.
order: 1
---

## Can I write code to control automations or process data?
***

Yes. axiom.ai supports [JavaScript](/docs/tutorials/javascript) and a subset of Google's [Puppeteer API](/docs/no-code-tool/integrations/puppeteer).

## How do I bypass captchas?
***

axiom.ai doesn't have an in-house [captcha](/docs/no-code-tool/how-it-works/browser-actions/solve-captcha) solver but integrates with [2Captcha](/docs/no-code-tool/integrations/2captcha) for the most common captcha types.

## How do I get started building an automation?
***

Follow the guide for [your first automation in the browser](/docs/first-automation) and pick a starting point that matches your use case.

## How do I get my automation to log in to a site?
***

When you trigger an automation from the Chrome extension on the desktop, axiom.ai uses your [local browser session](/docs/no-code-tool/how-it-works/login/sessions), so you're already logged in. When triggering remotely (via the API, a webhook, or a schedule), you'll need to handle login as part of the automation. See the full [login guide](/docs/no-code-tool/how-it-works/login) for the available approaches.

## How do I make a loop?
***

axiom.ai supports conditional [logic](/docs/no-code-tool/how-it-works/logic), a dedicated [**Loop through data**](/docs/no-code-tool/reference/steps/loop) step, and complex patterns built with jump steps. For details, see the [loop documentation](/docs/no-code-tool/how-it-works/loop).

## Can a deleted automation be restored?
***

No. Deleted automations are permanently removed and can't be recovered.

## Can I share an automation with another user?
***

Yes. Download the automation as a JSON file and the other user can import it into their own account. See [import or download an automation](/docs/no-code-tool/import-export/sharing).

## How do I deal with Google token expiry?
***

Google revokes tokens periodically as a security measure. The most common triggers are password changes and high-frequency reads or writes. When a token expires:

1. **Re-authenticate.** Reconnect your Google account in axiom.ai. Token expiry can't be resolved automatically.
2. **Set up notifications.** Enable [run notifications](/docs/no-code-tool/reference/settings/run-options/notifications) so you find out as soon as a token-related run fails.
3. **Reduce read/write frequency.** Frequent reads and writes correlate with token expiry. If your token expires often, run the automation less frequently. If you're not sure how to reduce frequency without breaking the automation, [contact support](/customer-support) with details of your sheet usage.

## Can I automate a Chrome extension?
***

Limited support. axiom.ai can interact with [extensions that modify pages directly](/docs/no-code-tool/reference/settings/chrome/load-extension) (for example, by injecting buttons or fields into the DOM). Extensions whose UI lives in popups or dedicated windows aren't accessible to axiom.ai.

## Can I use Python?
***

No. JavaScript is the only scripting language supported in steps. For the JavaScript step, see [**Write javascript**](/docs/no-code-tool/reference/steps/write-javascript).

## How do I insert line breaks in the Enter text step?
***

In the [**Enter text**](/docs/no-code-tool/reference/steps/enter-text) step, toggle `Custom line break` on and record a unique key sequence. Make sure all whitespace is removed from the recording, then use the recorded sequence wherever you want a line break in the text.

For step-by-step instructions, see the [insert line breaks guide](/guides/line-breaks).

## Can I trigger an automation from a Google Apps Script?
***

Yes. Use the axiom.ai [API](/docs/developer-hub/api) from your Apps Script. For a worked example, see the [Google Apps Script trigger guide](/guides/google-apps-script).

## How can I send multiple paragraphs in one message? When I add spaces, they send separately.
***

This is common on social platforms like Instagram and Facebook, where pressing Enter sends the message instead of inserting a line break. Follow the [insert line breaks guide](/guides/line-breaks) for the workaround.