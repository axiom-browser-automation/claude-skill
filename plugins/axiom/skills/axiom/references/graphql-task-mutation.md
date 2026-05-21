# Moved — see `rest-save-endpoint.md`

The save path is now the REST endpoint `POST /api/v4/automation`. See [`rest-save-endpoint.md`](./rest-save-endpoint.md) for the contract.

The legacy GraphQL `task` mutation still exists on the Axiom backend but is not the recommended path for programmatic use:

- It needs the JWT from `/api/user/login`; the REST endpoint takes a plain `X-API-KEY` header (same key as `/v4/trigger` and the rest of the v4/v5 surface).
- Its arg list is GraphQL-shaped and harder to construct from a shell or a Node fetch.
- The REST endpoint covers the same upsert semantics (`id` to update, omit to create) with a smaller and more conventional surface.
