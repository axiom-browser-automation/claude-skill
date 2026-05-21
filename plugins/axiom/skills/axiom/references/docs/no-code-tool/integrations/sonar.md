---
title: Sonar
metaTitle: Use Perplexity's Sonar with axiom.ai through the Integrate AI step
description: Connect Sonar (Perplexity) to your axiom.ai automations through the Integrate AI step. Generate text or extract structured data using your own Perplexity API key.
order: 12
---

Sonar is Perplexity's API-accessible model family, and one of the LLM providers supported by the [**Integrate AI**](/docs/no-code-tool/reference/steps/integrate-ai) step. Drop the step into any automation, choose Sonar as the provider, and either generate text or extract structured fields from data flowing through earlier steps. You supply your own Perplexity API key, so billing happens directly on your Perplexity account.

For step usage and how to write extract or generate prompts, see [Integrate AI](/docs/no-code-tool/how-it-works/integrate-ai). The rest of this page covers Sonar-specific setup and gotchas.

## Sign up and get an API key
***

1. Create an account at [perplexity.ai](https://www.perplexity.ai/).
2. Open [API settings](https://www.perplexity.ai/account/api/keys) and add a payment method.
3. Click **Generate API key** and copy the key. Treat it like a secret.
4. Paste the key into the `API key` field of the **Integrate AI** step in your automation.

## Choose a model
***

Pick a Sonar model in the `Model` field of **Integrate AI**. Perplexity publishes the current model lineup (Sonar, Sonar Pro, and reasoning variants) on the [Perplexity API models page](https://docs.perplexity.ai/getting-started/models). See [Perplexity's pricing](https://docs.perplexity.ai/getting-started/pricing) for current per-token and per-request costs.

## What Sonar is good at
***

Sonar's distinguishing feature is **live web search built into the model**. Where other LLMs only know what was in their training data, Sonar can pull in current information at inference time. Useful when an automation needs:

- **Real-time facts** like today's prices, scores, or news.
- **Citations** alongside generated answers, since Sonar can return source URLs.
- **Research-style summaries** of topics that change frequently.

Common patterns:

- Generate a market update with up-to-date competitor pricing pulled in by Sonar itself, no separate scrape step needed.
- Enrich scraped leads with recent news about their company.
- Produce briefings that need to reference recent events.

Sonar is usually less useful for pure extraction from data you've already scraped; for that, ChatGPT, Claude, or Gemini Flash are typically cheaper and faster.

## Limit API spending
***

Perplexity exposes spending controls in the API settings:

- **Set usage limits** in [API settings](https://www.perplexity.ai/account/api/keys) so the API stops responding past a monthly cap.
- **Use a dedicated account** for axiom.ai if you want strict isolation from other apps.
- **Rotate keys periodically** and delete any you're no longer using.

## Other LLM providers
***

The **Integrate AI** step also supports:

- [ChatGPT](/docs/no-code-tool/integrations/chatgpt) (OpenAI)
- [Claude](/docs/no-code-tool/integrations/claude) (Anthropic)
- [Gemini](/docs/no-code-tool/integrations/gemini) (Google)
- [DeepSeek](/docs/no-code-tool/integrations/deepseek)

The step behaves the same way; only the model list and API key change.
