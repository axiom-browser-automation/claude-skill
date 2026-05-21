---
title: Integrate AI
metaTitle: Run an inline LLM call from an axiom.ai cloud browser session
description: Run an LLM call inline within a step-function session for prompt completion, classification, or extraction using axiom.integrateAI().
order: 17
---

`axiom.integrateAI(aiOptions)` runs an LLM call inline within the session. Two modes are supported: `generate` (prompt → completion) and `extract` (prompt → structured fields from supplied data). The same step type as the No-Code Tool's [**Generate text with ChatGPT**](/docs/no-code-tool/reference/steps/chatgpt-generate) / extraction-AI step.

## Signature
***

```javascript
const result = await axiom.integrateAI(aiOptions);
```

| Field | Type | Required | Description |
|---|---|---|---|
| `aiOptions.aiFunction` | `"generate"` \| `"extract"` | Yes | Selects mode. |
| `aiOptions.key` | string | No | Your LLM API key. Leave unset to use the API key stored against your axiom.ai account. |
| `aiOptions.model` | string | No | Model identifier (provider-specific). Defaults to the account-level default. |
| `aiOptions.prompt` | string | `generate` only | The prompt. |
| `aiOptions.extractData` | string | `extract` only | The source text (typically scraped earlier in the run). |
| `aiOptions.promptExtract` | string | `extract` only | The extraction prompt (e.g. "Return a JSON object with keys name, price, sku"). |

## Examples
***

**Generate a summary of scraped content:**

```javascript
const rows = await axiom.scrape(null, { hierarchy: "article" }, null, 1, {});
const result = await axiom.integrateAI({
  aiFunction: 'generate',
  prompt: `Summarise this in one sentence:\n\n${rows[0][0]}`
});
```

**Extract structured fields from a page:**

```javascript
const rows = await axiom.scrape(null, { hierarchy: "body" }, null, 1, {});
const result = await axiom.integrateAI({
  aiFunction: 'extract',
  extractData: rows[0][0],
  promptExtract: 'Return a JSON object with keys: company_name, ceo_name, founded_year.'
});
```

## Notes
***

- For arbitrary LLM workflows (chains, tool use, streaming), call your LLM provider's API directly from your code rather than going through this step. This step is best when you want the LLM call to count against your axiom.ai runtime quota and to keep the whole flow in one place.
- The exact set of supported `model` values depends on which provider keys are configured on your account. See [API integrations](/docs/no-code-tool/integrations) for the current list.

## Related
***

- [Scrape](/docs/developer-hub/api/step-functions/scrape)
- [Scrape metadata](/docs/developer-hub/api/step-functions/scrape-metadata)
