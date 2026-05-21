---
title: Data handling
metaTitle: How axiom.ai stores, processes, and protects your data
description: A deep dive into what data axiom.ai stores, what stays in your environment, how desktop and cloud runs differ, and how to use axiom.ai safely with sensitive data.
order: 4
---

axiom.ai is designed so that customer data (the data your automations work with) stays out of axiom.ai's systems by default. This page covers what axiom.ai stores, what it doesn't, how desktop and cloud runs differ in practice, and the patterns to follow when handling sensitive data.

> **Note:** axiom.ai is a data processor. The user controls what data flows into and out of axiom.ai through the steps they configure. axiom.ai doesn't access, copy, or share customer data with third parties.

## What axiom.ai stores
***

The only data axiom.ai keeps is what's needed to run the platform itself. There are three categories.

### Account data

The information needed to maintain your account:

- Names and email addresses on the account.
- Plan and billing metadata.

Account data is stored encrypted at rest and accessed only by the team to provide support and maintain the service.

### Automation structure

When you save an automation, axiom.ai stores its structure so it can run later. This includes:

- The automation's name.
- The list of steps in the automation.
- The configuration of each step (selectors, target URLs, options, and any literal text typed into step fields).
- The order of the steps.
- Any settings configured on the automation (schedule, proxy, notifications, stored cookies, and so on).

This is what gets exported when you [download an automation as JSON](/docs/no-code-tool/import-export/sharing). For the full structure, see [automation JSON structure](/docs/developer-hub/deep-dives/axiom-structure).

> **Important:** Anything you manually type into a step input is stored as part of the automation. This includes search queries, URLs, default values, and any text you've typed instead of inserting a data token. Don't type sensitive values like passwords, API keys, or personally identifiable information directly into step fields. Use a data source (Google Sheet, webhook, API call) instead. See [use data safely](#use-data-safely) below.

### Run metadata

For every run, axiom.ai records:

- Run status (success, warning, failure).
- Start and end times.
- Runtime used.
- Any error messages thrown by steps.

This metadata appears in [run reports](/docs/no-code-tool/troubleshooting/how-to-debug#check-run-reports). It doesn't include the data your automation processed.

## What axiom.ai doesn't store
***

By default, the data your automation actually processes (what it scrapes, what gets passed through it, what it writes elsewhere) isn't stored. Specifically:

- Data scraped from web pages.
- Data passed in through [Receive data from another app](/docs/no-code-tool/reference/steps/receive-data-from-another-app) (Zapier, Make, n8n, the API).
- Data read from Google Sheets or Excel.
- Data written out through any step.

axiom.ai doesn't train AI or machine learning models on user data. There's no pipeline that ingests it, no analytics layer that aggregates it, no internal use of it.

## Desktop runs vs cloud runs
***

The boundary between the two execution modes matters when you're thinking about data flow.

### Desktop runs

Desktop runs execute in a browser on your own machine. The data the automation handles never leaves your network unless your automation explicitly sends it somewhere (a webhook, an AI step, a third-party integration).

This means:

- Scraped data, page content, and intermediate values stay on your machine.
- axiom.ai's servers don't see the run's data.
- Run metadata (status, runtime, errors) is still sent to axiom.ai so you can see runs in the dashboard.

For data-sensitive workflows, the desktop app is the deployment of choice.

### Cloud runs

Cloud runs execute in a private browser container on axiom.ai's infrastructure. The container is created at the start of the run and permanently deleted when the run ends. Nothing persists between runs.

While the run is in progress:

- The data flowing through the automation lives only inside the container.
- The container has no shared storage with other accounts or other runs.
- axiom.ai engineers can't reach into the container.

When the run ends:

- The container is destroyed.
- Run metadata (status, runtime, errors) is retained for run reports.
- The processed data is gone unless your automation wrote it somewhere (a Google Sheet, an export step, a webhook).

## Use data safely
***

axiom.ai handles your data safely by default. The remaining surface area for accidental data exposure is in how *you* configure your automations. A few patterns to follow:

### Don't type sensitive values into step fields

Anything typed directly into a step's text input is stored as part of the automation's structure. For sensitive values (passwords, API keys, customer data), pass the value in dynamically instead.

- Read sensitive inputs from a [Google Sheet](/docs/no-code-tool/integrations/google-sheets) or [Excel sheet](/docs/no-code-tool/integrations/excel) the user controls.
- Pass them in via [Receive data from another app](/docs/no-code-tool/reference/steps/receive-data-from-another-app) so the value comes from a webhook or API call.
- For credentials specifically, use [stored cookies](/docs/no-code-tool/reference/settings/run-options/store-cookies) or your browser's password manager rather than entering passwords as text.

### Egress is opt-in

Data only leaves an automation when a step is configured to send it out. Examples:

- A [Trigger webhook](/docs/no-code-tool/reference/steps/trigger-webhook) step sends data to an external URL.
- An [AI step](/docs/no-code-tool/integrations/chatgpt) sends prompt content to OpenAI.
- A [Write data to a Google Sheet](/docs/no-code-tool/integrations/google-sheets) step writes to your Google account.

None of these are present by default. If your automation has none of these steps, data doesn't leave it.

When you do add an egress step, the destination is also yours: the third-party service receiving the data is bound by its own terms with you, not with axiom.ai.

### Run sensitive workflows on the desktop

If a workflow handles regulated or highly sensitive data, run it on the [desktop app](/docs/install#installing-the-desktop-app-optional) rather than in the cloud. The data never reaches axiom.ai's servers, removing axiom.ai from the data flow entirely.

## Security practices
***

A few specifics on how axiom.ai handles the data it does store:

- **Encryption at rest.** All user data on axiom.ai's systems is stored encrypted.
- **Restricted admin access.** Only a small number of team members can access production systems, and access is logged.
- **Regular penetration testing.** axiom.ai runs penetration tests on a regular cadence.
- **Annual CASA review.** Google reviews axiom.ai's data handling annually through their [Cloud Application Security Assessment](https://support.google.com/cloud/answer/13465431) (CASA), which verifies secure handling and processing of data.
- **No customer-data access for support.** axiom.ai's support process doesn't require access to your customer data. If we ever ask for context to debug an issue, you decide what to share.

## Compliance and certifications
***

axiom.ai is designed to be compliant with common data-handling standards but is not formally certified for any of them. Specifically:

- **Not SOC 2 certified.** The system is built around the principle of not handling customer data (so most controls are not applicable), but no formal SOC 2 audit has been completed.
- **Not HIPAA certified, no BAA offered.** axiom.ai doesn't sign Business Associate Agreements. For why this can still work for HIPAA-regulated workflows, see [HIPAA and axiom.ai](#hipaa-and-axiom-ai) below.
- **CASA-verified annually.** Google's CASA review confirms that axiom.ai handles and processes data securely.

If you have a security questionnaire to complete, [contact support](/customer-support). The team has filled these in for several enterprise users.

## HIPAA and axiom.ai
***

axiom.ai doesn't sign BAAs, but the desktop deployment can still be appropriate for workflows that touch Protected Health Information (PHI). The reasoning, drawn from [HHS guidance](https://www.hhs.gov/hipaa/for-professionals/faq/256/are-business-associate-agreements-required-with-software-vendors/index.html) and [45 CFR 160.103](https://www.ecfr.gov/current/title-45/section-160.103):

- Under HIPAA, a software vendor only becomes a business associate if it **creates, receives, maintains, or transmits PHI on behalf of a covered entity**.
- Selling software that runs in your environment doesn't trigger business-associate status.
- When you run automations on the desktop app, PHI stays inside your network. axiom.ai doesn't see, store, or transmit any of it.
- In that deployment model, axiom.ai isn't a business associate, and no BAA is required.

The cloud deployment is a different story: cloud runs process data on axiom.ai's infrastructure. If your workflows handle PHI, run them on the desktop app only.

> **Important:** This is a summary, not legal advice. HIPAA compliance is your organisation's responsibility, and the right deployment depends on your specific workflow. If you're unsure whether the desktop deployment fits your compliance needs, consult your privacy or compliance team before deploying.

## Summary
***

- axiom.ai stores account information, automation structure, and run metadata. It doesn't store the data your automations process.
- Anything typed manually into a step is stored as part of the automation. Don't type sensitive values directly; pass them in through a data source.
- Data only leaves an automation through steps you configure to send it out (webhooks, AI steps, integrations). None of these are present by default.
- Desktop runs keep data inside your network. Cloud runs use private, ephemeral containers that are destroyed when the run ends.
- For sensitive or regulated data, the desktop app is the recommended deployment.
- axiom.ai is designed to be compliant with common standards (not formally certified), CASA-verified annually, and supports security questionnaires on request.