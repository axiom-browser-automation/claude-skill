---
title: AI Assistant
metaTitle: Use the AI Assistant in the axiom.ai Builder
description: Use the in-Builder AI Assistant to debug failing automations, get suggested fixes, extend your automation with new steps, and resolve common configuration issues from a chat conversation.
order: 10
---

The AI Assistant's main job is to help you build and debug an automation. 

It is an assistant, and still requires a human to be in the driving seat. 

It can help you debug errors, suggest fixes and guide you through documentation with natural language. 

It can also extend an automation by adding, looping, or modifying steps from a natural-language description. 

## Start a troubleshooting conversation
***

Type `/help` and the assistant asks whether you want to **Debug my automation** or **Extend my automation**.

If you choose **Debug**, the assistant offers a list of common problems and takes you to the right place:

- Incorrect data or element selected
- Wrong page loading
- No data output
- Login or session failing
- Interacting with an element failing
- Wrong data mapping to a field
- Wrong order of steps
- Extra steps
- Not looping
- Need to add a new step
- A specific error message

If you choose **Extend**, the assistant helps you change your automation by chat — adding, looping, or editing steps as described below.

## Extend your automation
***

You can ask the assistant to change the automation in plain English. It proposes the change, shows a preview, and asks before applying it.

- **Add steps.** *"Add a click step after step 6"*, *"write to a Google Sheet at the end"*. The assistant proposes the step(s) and the position.
- **Loop steps.** *"Loop steps 3 to 6"* wraps a range of steps in a loop.
- **Fill a form.** Ask the assistant to fill a form and it walks you through the **Enter text** / **Select list** / **Click** pattern.
- **Read and write Google Sheets.** Ask and it inserts the read-sheet / find-row / write-sheet trio.
- **Upload or download files.** Ask and it inserts the right file-transfer steps for local files or Google Drive.
- **Receive or trigger a webhook.** Ask and it sets up an incoming webhook (with a sample payload to test) or an outgoing webhook (you can paste a curl command for it to parse).

## What the assistant can help with
***

The assistant covers a lot of ground. The list below is a quick tour of the things you can ask it for. You can usually start any of them by typing what you want; the most common ones are also a click away in the `/help` menu.

### Debugging an error

- **Error help.** When something goes wrong, the assistant looks at the error and suggests fixes. Opens automatically when a run fails, or type *"error in step 3"*.
- **Autofix.** Lets the AI try to fix the error for you by editing the automation. You'll see an **Autofix** button on supported errors, and the assistant might ask a quick clarifying question before making the change.
- **Skip non-critical errors.** Helps you tell the automation to keep going if a step fails, when that failure isn't important. Say *"ignore this error"* or pick it from the suggested fixes.
- **Click not working.** When a **Click** step isn't hitting the right thing, the assistant offers to reselect the element, click by its text, use a custom selector, or get support. Pick "Interacting with element failing" or type *"click not working"*.
- **Selector issues.** When a selector isn't finding the right element — iframes, hidden elements, attribute selectors and so on — the assistant walks you through the options. Pick "Incorrect data or element selected" or type *"selector not working"*.
- **Page won't load.** Helps with URL, network, VPN, and blocker issues. Offers autofix, a URL check, a login check, a network check, or support. Opens on page-load errors, or pick "Wrong page loading".
- **Empty Google Sheet.** Steps in when a **Get data from Google Sheet** step reads an empty sheet. Offers to open the sheet for you or set the step to continue when it's empty.
- **Cloudflare blocks.** Spots when a page is being blocked by Cloudflare and offers to turn on the bot-detection bypass. If it's already on, the assistant points you to support.
- **Run-in-app required.** Pops up when a **Write javascript** step needs the desktop app's "Run in app" mode, and offers to switch it on.
- **Mac "Chromium not supported".** When the desktop app shows this macOS error, the assistant walks you through gathering the system details support will need.

### Editing your automation by chat

- **Add steps.** Describe what you want and the assistant adds it. Type *"add a step"*, pick "Need to add a new step", or accept an autofix suggestion.
- **Loop steps.** Wraps a range of steps in a loop. Try *"loop steps 3 to 6"*, or pick "Not looping".
- **Fill a form.** Sets up the usual **Enter text** / **Select list** / **Click** pattern for filling forms. Type *"fill a form"* or pick it from the `/help` menu.
- **Read and write Google Sheets.** Adds the read-sheet, find-row, and write-sheet steps in one go. Type *"write to a Google Sheet"*.
- **Working with files.** Adds upload or download steps for local files or Google Drive. Type *"upload a file"*.
- **Incoming webhook.** Sets up an endpoint so other tools — Zapier, your own service, anything that can make a request — can kick off your automation. You'll see the URL and a sample payload, and you can do a test run before saving. Type *"trigger from Zapier"* or *"webhook"*.
- **Send to a webhook.** Adds a step that calls an external endpoint. Paste a curl command and the assistant works out the rest. Type *"send to an API"* or *"call a webhook"*.

### Settings and scheduling

- **Schedule a run.** Sets up a schedule — date, frequency, local or cloud — or turns an existing one off. Type *"schedule"*, *"run daily"*, and so on.
- **Schedule running at the wrong time.** Helps with timezone, daylight saving, and UTC mix-ups. Type *"schedule running at the wrong time"*.
- **Notifications.** Sets up or changes email or webhook notifications for run results — failure, warning, or success. Type *"notify me"* or *"email on failure"*.
- **Proxy settings.** Walks you through proxy setup — SOCKS5 or HTTP, host, port, auth. Type *"proxy"*.
- **Stay logged in.** Captures and re-syncs your login cookies so cloud runs stay signed in. Type *"sync cookies"* or *"stay logged in"*.
- **Block resources.** Speeds up runs by blocking images, fonts, media, stylesheets, and other things the page doesn't strictly need. Type *"block images"*, or pick it from the Slow automation help.

### Speed and reliability

- **Slow automation.** Help when runs are slow or Chrome crashes ("Oh Snap"). The assistant suggests blocking resources, or pointing you to support. Type *"slow"* or *"Oh Snap"*.
- **Slow scraper.** Spots **Get data** steps that are slow because of retry attempts, and offers to dial them down. Type *"scrape is slow"*.
- **Stuck automation.** Helps when a run looks like it's hanging. The assistant can stop it for you, and set a max runtime so future runs cut themselves off. Type *"stuck"* or *"running forever"*.
- **Runtime limit hit.** Shows up when a run goes over the maximum runtime on your plan. Offers tips to make the run shorter, or an upgrade.
- **Upgrade your plan.** Appears when you hit a plan limit. Shows the right plan to switch to, with a checkout button.

### Other

- **Troubleshooting menu.** The top-level `/help` menu that leads to everything above. Type `/help`, *"troubleshoot"*, or *"help"*.
- **Contact support.** Hands you off to human support, with the issue details and error already attached. Type *"contact support"*, or click any **Contact support** button you see in the chat.
- **Backing out.** If you change your mind partway through — *"cancel"*, *"never mind"* — the assistant tidies up the pending step and lets you start fresh.

