---
title: General FAQ
metaTitle: General questions about axiom.ai, data handling, and platform support
description: Answers to common general questions about axiom.ai including affiliate program, API, desktop app, data handling, HIPAA compliance, and screen recording.
order: 2
---

## Do you have an affiliate program?
***

Yes. To learn more and join, see the [axiom.ai affiliate program](/affiliate-program) page.

## Do you have an API?
***

Yes. The [axiom.ai API](/docs/developer-hub/api) lets you trigger automations and pass data to them. The API requires a Pro subscription or higher.

## Does axiom.ai come with a desktop app?
***

The [desktop application](/docs/install#installing-the-desktop-app-optional) is optional. It's required for automations that upload or download files. Every subscription tier can use it. The desktop app is available for macOS, Windows, and Linux.

## Does axiom.ai work with Zapier?
***

Yes. Pro subscribers and above can trigger automations from Zapier and pass data between axiom.ai and [Zapier](/docs/no-code-tool/integrations/zapier) in either direction. Any tool that can send or receive webhooks can be integrated.

## Can you help me build an automation?
***

Yes. To help you efficiently, send us as much context as possible:

1. A screen recording of the task you want to automate.
2. Any Google Sheets used in the automation, shared with `support@axiom.ai` with editor permission.
3. The target webpage exported as HTML (the [Save Page WE](https://chromewebstore.google.com/detail/save-page-we/dhhpefjklgkmgeafimnjhojgjamoafof) extension works well for this).
4. The axiom.ai automation file if you've started one. See [import or download an automation](/docs/no-code-tool/import-export/sharing).

[Contact support](/customer-support) with the details.

## How does axiom.ai handle my data?
***

axiom.ai doesn't store user data and doesn't train models on user data. When automations run on the desktop app, no data leaves your network. When automations run in the cloud, the data is processed in a private container that's destroyed when the run finishes.

axiom.ai stores only essential information: automation names, runtime usage, and basic account details. Text typed manually into an **Enter text** step is stored encrypted, so no one at axiom.ai can read it. Data passed in from a data source (a Google Sheet, a webhook, an API call) isn't stored.

For full details, see the [privacy policy](/privacy-policy).

## What if axiom.ai doesn't have the feature I need?
***

Email feature requests to [support@axiom.ai](mailto:support@axiom.ai). User feedback drives the roadmap.

## How can I record my screen to share with support?
***

Use the built-in screen recorder for your operating system.

### Windows 10 and Windows 11

1. Press **Win + G** to open the Game Bar.
2. Click **Start recording**, or press **Win + Alt + R**.
3. When you're done, click **Stop recording**.
4. The video saves to **Videos** → **Captures**.

### macOS

1. Press **Cmd + Shift + 5** to open the screenshot toolbar.
2. Click **Record entire screen** or **Record selected portion**, then click **Record**.
3. To stop, click the **Stop** button in the menu bar.
4. The video saves to your Desktop, or wherever you've configured screenshots to save.

Email the recording to support, or share it via Google Drive (with `support@axiom.ai` granted access). [Loom](https://chromewebstore.google.com/detail/loom-%E2%80%93-screen-recorder-sc/liecbddmkiiihnedobmlmillhodjkdmb) is a good cross-platform alternative.

## Is axiom.ai HIPAA compliant?
***

No. axiom.ai does not offer HIPAA compliance, doesn't sign Business Associate Agreements (BAAs), and shouldn't be used to handle, store, or process protected health information in the cloud.

If your organisation requires HIPAA compliance, use the [desktop app](/docs/install#installing-the-desktop-app-optional) only and never run automations in the cloud. With the desktop app, data stays on your network and never reaches axiom.ai's servers, but HIPAA compliance still remains your organisation's responsibility.

For details on how axiom.ai handles user data in general, see [How does axiom.ai handle my data?](#how-does-axiom-ai-handle-my-data) above.

## Can I host axiom.ai on a server?
***

Yes. Running axiom.ai on a server is a good option when you need unattended runs combined with desktop-only features (file downloads, file uploads, local session storage, or specific JavaScript steps).

To set up axiom.ai on a server:

1. Install Chrome.
2. Install the [axiom.ai extension](/docs/install).
3. If you'll use **Download a file** or **Upload a file** steps, also install the [desktop application](/docs/install).

Once installed, axiom.ai works on the server just as it does on a local computer. When scheduling automations, enable `Run on this computer` so they run locally on the server rather than in the cloud.

## How do I uninstall the desktop app?
***

- **macOS:** Navigate to the **Applications** folder and remove the **axiom-desktop** application.
- **Windows:** Navigate to **Control Panel** → **Programs** → **Programs and Features**. Find **axiom-desktop**, right-click it, and choose **Uninstall**.

If you have problems after uninstalling, see [installation errors](/docs/no-code-tool/troubleshooting/errors/installation).