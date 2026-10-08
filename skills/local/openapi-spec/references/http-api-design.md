# HTTP API design rules for specs

Read when generating or reviewing a contract that has errors, lists, retries, rate limits, or evolving schemas. Rules paraphrase the [Zalando RESTful API Guidelines](https://opensource.zalando.com/restful-api-guidelines/) (CC BY 4.0; rule numbers checked against the repository on 2026-10-08) and the cited RFCs. Describe only behavior the implementation has or will have; these are defaults for new contracts, not reasons to rewrite a published one.

## Errors: Problem Details (RFC 9457, Zalando #176)

- Return `application/problem+json` for 4xx and 5xx with `type` (URI identifying the problem kind), `title`, `status`, `detail`, and `instance`; add extension members only for machine-actionable data (for example field-level validation errors).
- `type` is stable and documented; `detail` is for humans and must not leak internals.
- Clients must tolerate a non-problem error body, because proxies and gateways emit their own.
- Document problem responses once under `components/responses` and `$ref` them.

## Pagination (Zalando #160, #254)

- Prefer cursor pagination: the cursor is opaque and is never inspected or constructed by clients; return `next`/`prev` cursors (or links).
- Offset pagination only when jump-to-page is a real requirement; it duplicates or skips rows under concurrent writes and degrades on large sets.
- Bound `limit` with `minimum`, `maximum`, and `default` in the schema; the server enforces the maximum.
- Avoid total counts on large or growing sets; once shipped, clients depend on them. Offer them opt-in if truly needed.

## Rate limits (Zalando #153, RFC 6585)

- Signal throttling with `429 Too Many Requests` plus `Retry-After` (prefer delay-seconds); document both on rate-limited operations. `503` with `Retry-After` is for overload, not per-client quotas.

## Idempotent retries (Zalando #230)

- For non-idempotent `POST` (payments, orders, messages), accept an `Idempotency-Key` request header. Header standardization is still an IETF draft (`draft-ietf-httpapi-idempotency-key-header`); describe it as the API's own contract.
- Store key, request fingerprint (hash), and the resulting response atomically with the side effect, for a documented retention window; replay the stored response for the same key.
- Same key with a different payload is a client error (Zalando suggests `400`; some APIs use `409`/`422`) — document whichever the implementation returns.
- Concurrent requests with an in-flight key must not both execute.

## Null versus absent (Zalando #123)

- Give `null` and an absent optional property the same meaning; do not encode a third state through the difference. If a third state matters, model it explicitly (an enum or separate field).
- In OAS 3.1: optional = omitted from `required`; nullable = `type: [X, "null"]`.

## Compatibility (Zalando #106, #107)

- Evolve by additive changes: add optional request fields, add response fields, relax input validation.
- Breaking: removing or renaming fields, making an optional request field required, tightening validation, changing a type, extending an output `enum` clients may not handle, or changing a path/status code.
- Never repurpose a field's meaning, and do not reuse a removed field's name for different semantics.
- Treat removal as breaking even when the server would ignore the field.
