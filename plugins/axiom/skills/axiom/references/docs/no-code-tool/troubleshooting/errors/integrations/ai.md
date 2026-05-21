---
title: AI integration errors
metaTitle: Fix API key errors in axiom.ai AI steps
description: Errors that can occur when using AI steps with OpenAI, Google Gemini, Anthropic Claude, or Perplexity Sonar, mostly related to missing or invalid API keys.
order: 2
---

The errors on this page can occur when using AI steps in an automation. axiom.ai's AI steps connect to several providers:

- OpenAI (ChatGPT and GPT models)
- Google (Gemini)
- Anthropic (Claude)
- Perplexity AI (Sonar)

For background on the AI steps, see the [ChatGPT integration](/docs/no-code-tool/integrations/chatgpt) page.

## API key not provided
***

**Error:** You didn't provide an API key. You need to provide your API key in an Authorization header using Bearer auth (i.e. `Authorization: Bearer YOUR_KEY`), or as the password field (with blank username) if you're accessing the API from your browser and are prompted for a username and password.

**Problem:** No API key was set on the AI step (for example a generate-text or LLM-prompt step).

**Fix:** Set `API key` on the step. Get a key from the relevant provider's dashboard:

- [OpenAI API keys](https://platform.openai.com/account/api-keys)
- [Google AI Studio](https://aistudio.google.com/app/apikey) (Gemini)
- [Anthropic Console](https://console.anthropic.com/settings/keys) (Claude)
- [Perplexity API settings](https://www.perplexity.ai/settings/api) (Sonar)

## API key invalid
***

**Error:** Incorrect API key provided.

**Problem:** The API key on the step is invalid, expired, or doesn't match the provider expected by the step.

**Fix:** Open the relevant provider's dashboard and check that:

- The key is still active.
- The key matches the provider the step is configured for.
- The key has no leading or trailing whitespace and was copied in full.

If the key looks correct and the error persists, regenerate it in the provider's dashboard and paste the new key into the step.