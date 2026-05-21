---
title: DeepSeek
metaTitle: Use DeepSeek with axiom.ai through the Integrate AI step
description: Connect DeepSeek to your axiom.ai automations through the Integrate AI step. Generate text or extract structured data using your own DeepSeek API key.
order: 13
---

DeepSeek is one of the LLM providers supported by the [**Integrate AI**](/docs/no-code-tool/reference/steps/integrate-ai) step. Drop the step into any automation, choose DeepSeek as the provider, and either generate text or extract structured fields from data flowing through earlier steps. You supply your own DeepSeek API key, so billing happens directly on your DeepSeek account.

For step usage and how to write extract or generate prompts, see [Integrate AI](/docs/no-code-tool/how-it-works/integrate-ai). The rest of this page covers DeepSeek-specific setup and gotchas.

## Sign up and get an API key
***

1. Create an account at [platform.deepseek.com](https://platform.deepseek.com).
2. Open **Billing** and top up the account balance. DeepSeek bills against a prepaid balance.
3. Go to [API keys](https://platform.deepseek.com/api_keys) and click **Create new API key**. Copy the key once; DeepSeek doesn't show it again.
4. Paste the key into the `API key` field of the **Integrate AI** step in your automation.

## Choose a model
***

Pick a DeepSeek model in the `Model` field of **Integrate AI**. The two main families are:

- **DeepSeek-V3** for general chat, generation, and extraction tasks.
- **DeepSeek-R1** for tasks that benefit from explicit step-by-step reasoning, such as complex extraction schemas or logic-heavy decisions.

See [DeepSeek's pricing](https://api-docs.deepseek.com/quick_start/pricing) for current per-token costs. DeepSeek is typically the cheapest provider supported by **Integrate AI**, often by an order of magnitude.

## What DeepSeek is good at
***

DeepSeek's strengths inside an axiom.ai automation:

- **Very low per-token cost**, useful for high-volume extraction or generation where the same prompt runs hundreds or thousands of times.
- **Reasoning models** (R1 family) when an automation needs to follow a multi-step decision tree rather than a single instruction.
- **OpenAI-compatible API surface** so models behave predictably if you've used ChatGPT before.

Common patterns:

- High-volume scraped-page extraction where ChatGPT or Claude would be too expensive per run.
- Bulk content generation (product descriptions, ad variants, email drafts) at a scale that would push other providers' bills up.
- Reasoning over structured data with R1 when a single-shot prompt won't reliably produce the right answer.

## Data residency note
***

DeepSeek is operated from China and routes API traffic to servers there. If your automation handles personal data, customer data, or anything subject to a data residency requirement, confirm DeepSeek's terms fit your needs before sending production traffic. Anonymise or scrub sensitive fields where possible.

## Limit API spending
***

DeepSeek bills against a prepaid balance, which is itself a built-in spending cap:

- **Only top up the balance you're willing to spend.** When the balance hits zero, the API stops responding.
- **Watch usage** on the [usage page](https://platform.deepseek.com/usage) and refill in small increments to keep a hard cap.
- **Rotate keys periodically** and revoke any you're no longer using.

## Other LLM providers
***

The **Integrate AI** step also supports:

- [ChatGPT](/docs/no-code-tool/integrations/chatgpt) (OpenAI)
- [Claude](/docs/no-code-tool/integrations/claude) (Anthropic)
- [Gemini](/docs/no-code-tool/integrations/gemini) (Google)
- [Sonar](/docs/no-code-tool/integrations/sonar) (Perplexity)

The step behaves the same way; only the model list and API key change.
