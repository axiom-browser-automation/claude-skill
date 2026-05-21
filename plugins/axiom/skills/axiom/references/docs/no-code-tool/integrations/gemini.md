---
title: Gemini
metaTitle: Use Google's Gemini with axiom.ai through the Integrate AI step
description: Connect Gemini (Google) to your axiom.ai automations through the Integrate AI step. Generate text or extract structured data using your own Google AI Studio API key.
order: 11
---

Gemini is one of the LLM providers supported by the [**Integrate AI**](/docs/no-code-tool/reference/steps/integrate-ai) step. Drop the step into any automation, choose Gemini as the provider, and either generate text or extract structured fields from data flowing through earlier steps. You supply your own Google AI Studio API key, so billing happens directly on your Google account.

For step usage and how to write extract or generate prompts, see [Integrate AI](/docs/no-code-tool/how-it-works/integrate-ai). The rest of this page covers Gemini-specific setup and gotchas.

## Sign up and get an API key
***

1. Go to [Google AI Studio](https://aistudio.google.com/) and sign in with a Google account.
2. Open the [API keys page](https://aistudio.google.com/app/apikey) and click **Create API key**.
3. Choose an existing Google Cloud project or create a new one to attach the key to.
4. Copy the key. Google AI Studio lets you view existing keys later, but treat them as secrets and don't share or commit them.
5. Paste the key into the `API key` field of the **Integrate AI** step in your automation.

## Choose a model
***

Pick a Gemini model in the `Model` field of **Integrate AI**. Google publishes the current model lineup (Pro, Flash, and variants) on the [Gemini models page](https://ai.google.dev/gemini-api/docs/models/gemini). Use Flash for fast, cheap, high-volume work; use Pro for harder reasoning or longer outputs. See [Gemini API pricing](https://ai.google.dev/pricing) for current per-token costs.

## What Gemini is good at
***

Gemini's strengths inside an axiom.ai automation:

- **Free tier for development.** Google AI Studio includes a generous free tier on most models, useful for prototyping before turning on paid quotas.
- **Long context.** The Pro models support very large inputs, useful for long scraped HTML or PDF text.
- **Multimodal input** when paired with a screenshot or image from an earlier step.

Common patterns:

- High-volume extraction from scraped pages where cost matters and Flash is fast enough.
- Summarising long documents pulled in by [**Read local file**](/docs/no-code-tool/reference/steps/read-local-file) or [**Read file from Google Drive**](/docs/no-code-tool/reference/steps/read-file-from-google-drive).
- Drafting content where you want a different tone or style than ChatGPT or Claude produce.

## Limit API spending
***

Gemini billing runs through Google Cloud, so the standard Google Cloud controls apply:

- **Set a budget** on the Google Cloud project the API key is attached to. See [Cloud billing budgets](https://cloud.google.com/billing/docs/how-to/budgets).
- **Stay on the free tier** during development by capping usage well below the free-tier limits.
- **Rotate keys periodically** in [AI Studio](https://aistudio.google.com/app/apikey) and delete unused ones.

## Other LLM providers
***

The **Integrate AI** step also supports:

- [ChatGPT](/docs/no-code-tool/integrations/chatgpt) (OpenAI)
- [Claude](/docs/no-code-tool/integrations/claude) (Anthropic)
- [Sonar](/docs/no-code-tool/integrations/sonar) (Perplexity)
- [DeepSeek](/docs/no-code-tool/integrations/deepseek)

The step behaves the same way; only the model list and API key change.
