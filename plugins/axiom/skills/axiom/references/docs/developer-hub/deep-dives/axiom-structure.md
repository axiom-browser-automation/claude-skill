---
title: Automation JSON structure
metaTitle: How an exported axiom.ai automation is structured
description: Reference for the JSON structure of an exported axiom.ai automation, covering identifiers, step data, parameters, settings, and notification fields.
order: 2
---

When you export an axiom.ai automation, you get a JSON file containing the inner workings of the automation. The export is useful for sharing automations with the support team, with a colleague, or with anyone you're collaborating with. Most of the file is data axiom.ai uses to reconstruct the automation, but some of it is interesting on its own. This page documents the most useful fields. We've left out fields that relate to deprecated features, internal extension state, or rarely-used settings.

You can think of an exported automation as a snapshot of the automation's current state, including every step variable, error setting, and configuration value.

> **Warning:** Don't edit an exported automation by hand. Errors in the JSON prevent the file from being imported back into the extension.

## Identifiers
***

The first few fields in the JSON identify the automation:

```json
"id": 938717,
"name": "Send to Supabase",
"templateId": 0,
"triggers": [ ... ]
```

| Key | Description |
| --- | --- |
| `id` | The automation's unique ID. |
| `name` | The automation name, as shown in the dashboard. |
| `templateId` | The ID of the template the automation was created from, if any. |
| `triggers` | Configured triggers, such as schedules. |

If the automation has a schedule, the `triggers` array contains an entry like this:

```json
{
    "id": 10126,
    "interval_type": "seconds",
    "name": "",
    "starting_time": "2025-02-26 16:26:23+00",
    "status": "ready",
    "time_criteria": 86400,
    "type": "schedule"
}
```

| Key | Description |
| --- | --- |
| `id` | The schedule's unique ID. |
| `interval_type` | The interval unit. Always `seconds`. |
| `starting_time` | The time the schedule was set to start. |
| `time_criteria` | The number of seconds between runs. For example, `86400` is one day. |
| `type` | The trigger type. |

## Data
***

The `data` key holds everything about the automation's behaviour: steps, settings, and the configurations that drive each run. The top of the `data` object looks like this:

```json
"builderTemplateId": 0,
"context": [{ "context": "url", "url": "" }],
"continueOnError": true,
"disablePageChangeMonitoring": true,
"executablePath": "...",
"extensionToLoad": "...",
"form": [ ... ]
```

| Key | Description | Default | Docs |
| --- | --- | --- | --- |
| `continueOnError` | Continue after the automation hits an error. | `false` | [Continue on error](/docs/no-code-tool/reference/settings/error-handling/continue-on-error) |
| `disablePageChangeMonitoring` | Skip page-change monitoring between steps. | `false` | [Disable page monitoring](/docs/no-code-tool/reference/settings/error-handling/page-monitoring) |
| `executablePath` | Path to a local Chrome installation. | `null` | [Set executable path](/docs/no-code-tool/reference/settings/chrome/executable-path) |
| `extensionToLoad` | Path to a Chrome extension to load. | `null` | [Load another extension](/docs/no-code-tool/reference/settings/chrome/load-extension) |
| `form` | The list of steps. See [Step data](#step-data). | | |

### Step data

Step data lives in the `form` key. It's an array of step objects shaped like this:

```json
{
    "description": "Instruct the bot to go to a new page.",
    "hasErrors": false,
    "index": 0,
    "machine_name": "WidgetDriverGoto",
    "metadata": "",
    "name": "google.com",
    "original_name": "Go to page",
    "params": [ ... ],
    "stepNumber": "1",
    "token": ""
}
```

| Key | Description |
| --- | --- |
| `description` | The description of the step at the time it was created. |
| `machine_name` | axiom.ai's internal name for the step. |
| `metadata` | Search keywords used by the step finder. |
| `name` | The customisable display name. |
| `original_name` | The canonical step name without customisations. |
| `params` | The step's configuration. See [Params](#params). |
| `stepNumber` | The step's position in the automation. |
| `token` | The data token output by the step, if any (the token name only, not the data). |

> **Note:** The `description` and parameter `description` fields are stored at creation time so older steps continue to make sense if the canonical step description changes in a later release.

### Params

The `params` array inside each step object holds every parameter the step has, plus the value you've configured. For example, a single parameter on the [**Read data from a Google Sheet**](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step) step looks like this:

```json
{
    "collapsible": 0,
    "configurable": true,
    "default_value": "",
    "description": ["Select a google sheet to read from, or paste its URL here."],
    "help": [],
    "image": "",
    "name": "Spreadsheet",
    "sheetName": "Your Google Sheet",
    "type": "spreadsheet_picker",
    "value": "..."
}
```

| Key | Description |
| --- | --- |
| `default_value` | The default value, if the step has one. |
| `description` | The parameter's description (preserved from the step's creation time, see the note above). |
| `name` | The parameter name. |
| `sheetName` | The name of the Google Sheet selected for this parameter. |
| `type` | The parameter type. The example above is a `spreadsheet_picker`. |
| `value` | The configured value. |

Each parameter type may include extra fields specific to that parameter or step. The example above is a single parameter; most steps have several.

### Automation settings

The remaining keys are the automation's settings, the same ones you configure from the **Cog** icon in the Builder.

```json
"headless": false,
"iframesAllowed": true,
"incognitoMode": true,
"injector": { "injector": "dom", "magic_btn_status": true, "selector": "" },
"maximumRuntime": 600,
"mode": "browser",
"notifications": { ... },
"proxyAuth": null,
"storeCookies": true,
"templateId": 0,
"templateItem": null,
"templateMode": false,
"templateStarted": false,
"tokens": null,
"useLocalTimezone": true,
"userDataDir": "...",
"viewport": null
```

| Key | Description | Default | Docs |
| --- | --- | --- | --- |
| `headless` | Run the browser in headless mode. | `false` | [Run headless](/docs/no-code-tool/reference/settings/run-options/headless) |
| `iframesAllowed` | Allow the selector tool to interact with iframes. | `false` | [Interact with iframes](/docs/no-code-tool/reference/settings/error-handling/iframes) |
| `incognitoMode` | Run the automation in incognito mode. | `false` | [Run in incognito mode](/docs/no-code-tool/reference/settings/chrome/incognito) |
| `maximumRuntime` | Maximum runtime in seconds. | `720` | [Set maximum runtime](/docs/no-code-tool/reference/settings/run-options/max-runtime) |
| `notifications` | Notification configuration. See [Notifications](#notifications). | `null` | [Set up notifications](/docs/no-code-tool/reference/settings/run-options/notifications) |
| `proxyAuth` | Proxy configuration, if a proxy is set up. | `null` | [Use a proxy](/docs/no-code-tool/reference/settings/run-options/proxy) |
| `storeCookies` | Use stored cookies and local storage. | `null` | [Store cookies](/docs/no-code-tool/reference/settings/run-options/store-cookies) |
| `templateId` | The template ID the automation was created from, if any. | `0` | |
| `useLocalTimezone` | Use the local timezone for scheduling. | `false` | [Configure timezone](/docs/no-code-tool/reference/settings/run-options/timezone) |
| `userDataDir` | Path to a custom Chromium profile, if one is set. | `null` | [Set a custom Chromium profile](/docs/no-code-tool/reference/settings/chrome/profile) |

### Notifications

The `notifications` key holds the email and webhook notification configuration:

```json
{
    "emailAddress": "...",
    "emailOn": true,
    "onFailure": true,
    "onSuccess": false,
    "webhookOn": false,
    "webhookPayload": "",
    "webhookURL": ""
}
```

| Key | Description |
| --- | --- |
| `emailAddress` | The email addresses to send notifications to. |
| `emailOn` | Whether email notifications are enabled. |
| `onFailure` | Whether to notify on a failed run. |
| `onSuccess` | Whether to notify on a successful run. |
| `webhookOn` | Whether webhook notifications are enabled. |
| `webhookPayload` | The auto-generated webhook payload. |
| `webhookURL` | The URL the webhook payload is sent to. |

## Wrapping up
***

Understanding the JSON structure of an automation can help when you need to share an automation with support or read someone else's exported file. We don't recommend editing an automation through the JSON, but if you do, work from the table above to know what each key controls. Any malformed JSON will prevent the file from being imported back into the extension.