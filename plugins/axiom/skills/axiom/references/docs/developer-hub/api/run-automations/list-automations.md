---
title: List automations
metaTitle: List all axiom.ai automations on an account
description: Fetch the names of every saved No-Code Tool automation on your account, useful for building UIs or validating an automation name before triggering it.
order: 5
---

The `/list-automations` endpoint returns the names of every saved No-Code Tool automation on your account. Use it to populate a dropdown in your own UI, validate an automation name before calling `/trigger`, or audit what's available to the integration.

## Request
***

```http
POST /api/v3/list-automations
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `key` | string | Yes | Your API key. See [Authentication](/docs/developer-hub/api/authentication). |

## Response
***

```json
{
  "status": "success",
  "data": {
    "names": [
      "Automation 1",
      "Automation 2"
    ]
  }
}
```

| Field | Type | Description |
|---|---|---|
| `status` | string | `success` on a successful call, otherwise an error string. |
| `data.names` | array | Array of automation names, exactly as they appear in the **Dashboard**. |

## Example
***

```bash
curl -X POST https://lar.axiom.ai/api/v3/list-automations \
  -H "Content-Type: application/json" \
  -d '{"key": "your-api-key-here"}'
```

Use the returned names to drive an automation picker in your own application:

```javascript
const res = await fetch("https://lar.axiom.ai/api/v3/list-automations", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ key: process.env.AXIOM_API_KEY }),
});
const { data } = await res.json();

console.log(`You have ${data.names.length} automations available.`);
data.names.forEach(n => console.log(` - ${n}`));
```

## Notes
***

- Names returned here are the exact strings to pass to [`/trigger`](/docs/developer-hub/api/run-automations/trigger-an-automation) as the `name` parameter. They're case-sensitive and whitespace-sensitive.
- The list includes every automation saved to the cloud on your account, including ones you haven't run recently.
