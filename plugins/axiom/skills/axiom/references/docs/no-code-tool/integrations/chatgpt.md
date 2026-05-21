---
title: ChatGPT
metaTitle: Use OpenAI's ChatGPT with axiom.ai through the Integrate AI step
description: Connect ChatGPT (OpenAI) to your axiom.ai automations through the Integrate AI step. Generate text or extract structured data using your own OpenAI API key.
order: 3
---

ChatGPT is one of the LLM providers supported by the [**Integrate AI**](/docs/no-code-tool/reference/steps/integrate-ai) step. Drop the step into any automation, choose OpenAI as the provider, and either generate text or extract structured fields from data flowing through earlier steps. You supply your own OpenAI API key, so billing happens directly on your OpenAI account.

For step usage and how to write extract or generate prompts, see [Integrate AI](/docs/no-code-tool/how-it-works/integrate-ai). The rest of this page covers OpenAI-specific setup and gotchas.

## Sign up and get an API key
***

1. Create an account at [platform.openai.com](https://platform.openai.com/signup) if you don't have one.
2. Add a payment method in **Billing**. OpenAI's API requires a positive balance separate from a ChatGPT Plus subscription.
3. Open the [API keys page](https://platform.openai.com/account/api-keys) and click **Create new secret key**. Copy the key once; OpenAI doesn't show it again.
4. Paste the key into the `API key` field of the **Integrate AI** step in your automation.

## Choose a model
***

The **Integrate AI** step lets you pick the OpenAI model in the `Model` field. Use a smaller, cheaper model for high-volume extraction; use a larger one for nuanced generation. See [OpenAI's pricing page](https://openai.com/api/pricing/) for current per-token costs.

## What to use it for
***

Common patterns when OpenAI is the provider:

- **Extract structured data** from messy scraped HTML. Pair with [**Get data from a URL**](/docs/no-code-tool/reference/steps/get-data-from-a-url) or [**Receive data from another app**](/docs/no-code-tool/reference/steps/receive-data-from-another-app), then ask **Integrate AI** for the fields you want as a comma-separated list.
- **Generate replies, emails, or DMs** using data from earlier steps. Insert tokens into the prompt with **Insert data**, then pass the output to [**Send an email**](/docs/no-code-tool/reference/steps/send-an-email) or a posting step.
- **Pull metrics out of reporting sites** that have no API by scraping the page text and asking ChatGPT to isolate specific values.

For a worked example, try the [ChatGPT web scraper template](/guides/chatgpt-web-scraper) and the [related blog post](/blog/chatgpt-web-scraping).

## Limit API spending
***

OpenAI doesn't support per-user or per-API-key spending limits. To keep usage isolated and predictable:

- **Create a dedicated OpenAI account just for axiom.ai** so your automation's usage is separated from any other apps using the API.
- **Set a monthly budget** in [OpenAI's billing settings](https://platform.openai.com/account/billing/limits) so the API stops responding when the cap is hit.
- **Rotate keys periodically** and revoke anything you're no longer using.
- Follow [OpenAI's security guidance](https://help.openai.com/en/articles/8304786-how-can-i-keep-my-openai-accounts-secure) for the latest best practices.

## Other LLM providers
***

The **Integrate AI** step also supports:

- [Claude](/docs/no-code-tool/integrations/claude) (Anthropic)
- [Gemini](/docs/no-code-tool/integrations/gemini) (Google)
- [Sonar](/docs/no-code-tool/integrations/sonar) (Perplexity)
- [DeepSeek](/docs/no-code-tool/integrations/deepseek)

The step behaves the same way; only the model list and API key change.
