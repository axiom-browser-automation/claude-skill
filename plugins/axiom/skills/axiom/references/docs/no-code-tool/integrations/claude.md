---
title: Claude
metaTitle: Use Anthropic's Claude with axiom.ai through the Integrate AI step
description: Connect Claude (Anthropic) to your axiom.ai automations through the Integrate AI step. Generate text or extract structured data using your own Anthropic API key.
order: 10
---

Claude is one of the LLM providers supported by the [**Integrate AI**](/docs/no-code-tool/reference/steps/integrate-ai) step. Drop the step into any automation, choose Claude as the provider, and either generate text or extract structured fields from data flowing through earlier steps. You supply your own Anthropic API key, so billing happens directly on your Anthropic account.

For step usage and how to write extract or generate prompts, see [Integrate AI](/docs/no-code-tool/how-it-works/integrate-ai). The rest of this page covers Claude-specific setup and gotchas.

## Sign up and get an API key
***

1. Create an account at [console.anthropic.com](https://console.anthropic.com).
2. Add a payment method in **Plans & billing**. API access is separate from a claude.ai chat subscription.
3. Open [API Keys](https://console.anthropic.com/settings/keys) and click **Create Key**. Copy the key once; Anthropic doesn't show it again.
4. Paste the key into the `API key` field of the **Integrate AI** step in your automation.

## Choose a model
***

Pick a Claude model in the `Model` field of **Integrate AI**. Anthropic publishes the current model lineup (Opus, Sonnet, Haiku) on [their models page](https://docs.anthropic.com/en/docs/about-claude/models). Use Haiku for fast, cheap, high-volume extraction; use Sonnet or Opus for complex reasoning or longer generation. See [Anthropic's pricing](https://www.anthropic.com/pricing#api) for current per-token costs.

## What Claude is good at
***

Claude tends to outperform other models when the automation needs to:

- **Follow long, precise instructions** without drifting. Strict extraction schemas hold up well.
- **Process long inputs** like full HTML pages or long PDFs (Claude has a large context window).
- **Refuse to invent data** the source doesn't contain, which makes it a safer pick for extraction tasks where hallucinated fields would corrupt downstream data.

Common patterns:

- Extract structured fields from scraped HTML or PDF text.
- Summarise long pages or reports into a fixed format.
- Draft contextual replies in customer-service or outreach workflows.

## Limit API spending
***

Anthropic exposes spending controls directly in the console:

- **Set a monthly limit** in [Plans & billing](https://console.anthropic.com/settings/plans). The API stops responding when the cap is hit.
- **Create a dedicated workspace** for axiom.ai usage to keep its spend isolated from other apps.
- **Rotate keys periodically** and revoke any you're no longer using.

## Other LLM providers
***

The **Integrate AI** step also supports:

- [ChatGPT](/docs/no-code-tool/integrations/chatgpt) (OpenAI)
- [Gemini](/docs/no-code-tool/integrations/gemini) (Google)
- [Sonar](/docs/no-code-tool/integrations/sonar) (Perplexity)
- [DeepSeek](/docs/no-code-tool/integrations/deepseek)

The step behaves the same way; only the model list and API key change.
