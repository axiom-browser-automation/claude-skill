---
title: Check remaining runtime
metaTitle: Check remaining axiom.ai cloud runtime via the API
description: Query the axiom.ai API for your account's cloud runtime allowance, used minutes, and remaining minutes for the current billing period.
order: 2
---

The `/remaining-runtime` endpoint returns your account's cloud runtime allowance and usage for the current billing period. Use it to surface a "you've used X of Y minutes this month" widget in a dashboard, or to block expensive runs when you're nearly out of quota.

## Request
***

```http
POST /api/v3/remaining-runtime
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
    "used": 12.25,
    "allowance": 15000,
    "remaining": 14987.75
  }
}
```

| Field | Type | Description |
|---|---|---|
| `status` | string | `success` on a successful call, otherwise an error string. |
| `data.used` | number | Minutes of cloud runtime used in the current billing period. |
| `data.allowance` | number | Total minutes of cloud runtime included in your plan for the current billing period. |
| `data.remaining` | number | Minutes left (`allowance - used`). |

All values are in minutes.

## Example
***

```bash
curl -X POST https://lar.axiom.ai/api/v3/remaining-runtime \
  -H "Content-Type: application/json" \
  -d '{"key": "your-api-key-here"}'
```

A common pattern is to call this before triggering a long-running automation, so your code can fail fast rather than starting a run that will be killed mid-way through.

```javascript
const res = await fetch("https://lar.axiom.ai/api/v3/remaining-runtime", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ key: process.env.AXIOM_API_KEY }),
});
const { data } = await res.json();

if (data.remaining < 5) {
  throw new Error(`Only ${data.remaining} minutes left, skipping run.`);
}
```

## Notes
***

- The billing period resets monthly on your subscription anniversary, not the calendar month. Usage figures reflect the current cycle.
- Cloud runtime is consumed by `/trigger` runs and by browser sessions opened against `wss://cdp-lb.axiom.ai`. Local browser runs (the No-Code Tool running on your machine) don't draw from this allowance.
- A long-open browser session counts against your allowance even if it's idle. Always close sessions when you're done with them.