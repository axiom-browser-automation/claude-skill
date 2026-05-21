# Saving a no-code axiom to the user's account

`POST https://lar.axiom.ai/api/v4/automation`

Upsert endpoint. Pass an `id` to update an existing axiom; omit it to create a new one. Replaces the older GraphQL `task` mutation path for programmatic save.

## Auth

Pass the user's long-lived API key in the `X-API-KEY` header — same key as `/v4/trigger`, `/v5/*`, and the rest of the v4/v5 surface. No JWT, no login flow.

```
X-API-KEY: axm_<their-key>
Content-Type: application/json
Accept: application/json
```

## Request body

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `id` | int | no | — | Pass to update an existing axiom; omit to create a new one. |
| `name` | string | **yes** | — | User-visible name. |
| `data` | object \| string | no | `"{}"` | The `AutomationTemplate.data` JSON (the whole `data` subtree, including `form`, `context`, `injector`, etc.). The server `json_encode`s it if you pass an object. |
| `organization_id` | int | no | 1 | The user's org. |
| `type` | string | no | `"default"` | Free-form task type tag. |
| `status` | string | no | `"active"` | `"active"` or `"paused"`. |
| `triggers` | array | no | `[]` | Schedule entries — `{name, status, type, time_criteria, interval_type, starting_time}`. Empty for on-demand. |
| `stored_cookies` | array | no | `[]` | Persisted cookies the axiom should bring to its session. |
| `color` | string | no | `"#ffffff"` | Dashboard colour tag. |
| `favourite` | bool | no | `false` | Pin in the user's dashboard. |
| `parent_id` | int | no | — | When duplicating from a parent axiom. |

## Response

**Success (200):**

```json
{
  "status": "success",
  "data": {
    "id": 12345,
    "name": "Scrape product prices",
    "organization_id": 1,
    "creator_id": 678,
    "type": "default",
    "status": "active",
    "color": "#ffffff",
    "favourite": false
  }
}
```

**Error contract:**

| HTTP | Body shape | Cause |
|---|---|---|
| 400 | `{status: "error", message: "Request payload is empty…"}` | Empty body |
| 400 | `{status: "error", message: "The \"name\" field is required."}` | Missing `name` |
| 401 | `{status: "error", message: "Unable to authenticate, please check your API key…"}` | Invalid `X-API-KEY` |
| 401 | `{status: "error", message: "Your account has been locked…"}` | Account in strikeout |
| 403 | `{status: "error", message: "Unable to authenticate, you must send an API key."}` | No `X-API-KEY` header |
| 403 | `{status: "error", message: "You must have a pro subscription or higher to use this API."}` | Free-tier user |
| 403 | `{status: "error", message: "You do not have permission to update this automation."}` | Updating someone else's axiom |
| 404 | `{status: "error", message: "Automation not found."}` | `id` provided but no matching axiom |

## How the skill uses this

The bundled helper `skills/axiom/scripts/save-to-axiom-lar.js` wraps the call:

```bash
AXIOM_API_KEY=axm_... node skills/axiom/scripts/save-to-axiom-lar.js /tmp/my-axiom.json
```

The helper:

1. Validates the file against `automation-template-schema.json` (via `validate-no-code.js`).
2. Extracts the fields the endpoint accepts (`name`, `data`, `triggers`, `stored_cookies`).
3. POSTs to `https://lar.axiom.ai/api/v4/automation` with `X-API-KEY`.
4. Prints `saved: <id> <name>` on success, exits 1 on failure.

Override the base URL with `AXIOM_LAR_URL=https://lar-staging.axiom.ai` (for testing against staging).

## Curl example

```bash
curl -X POST https://lar.axiom.ai/api/v4/automation \
  -H "X-API-KEY: $AXIOM_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Scrape product prices",
    "data": { /* AutomationTemplate.data */ },
    "triggers": []
  }'
```

To update instead of create, include `id`:

```bash
curl -X POST https://lar.axiom.ai/api/v4/automation \
  -H "X-API-KEY: $AXIOM_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"id": 12345, "name": "Updated name", "data": { ... }, "triggers": []}'
```

## Server-side behaviour

The server is the source of truth for auth + validation: empty payload returns 400; missing / invalid / locked key returns 401 or 403; non-pro user returns 403; missing `name` returns 400; successful create returns the new id; update-of-missing-id returns 404. Object-valued `data` is json-encoded server-side.
