# Control catalogue by boundary

Open the subsection that matches the boundary being reviewed or fixed. Each control names the authoritative server-side decision point; specialists own syntax (`postgres-drizzle`, `better-auth-security`, `supabase-stack`, `workers-best-practices`, `stripe-best-practices`, `turnstile-spin`, `github-actions`, `observability-engineering`).

## Identity, authorization, and tenancy

- Authentication establishes identity; it never grants an action by itself. Authorize every object access and privileged function on the server, deny by default, and recheck after redirects or asynchronous boundaries.
- Derive user, role, tenant, and organization scope from trusted server-side identity—not request body, query string, client claims, filenames, cache keys, or webhook payload metadata.
- Enforce object-level checks on read, update, delete, export, download, and relationship endpoints. Enforce function-level checks on admin, bulk, approval, impersonation, role, billing, and configuration actions.
- Bind database queries, object-store keys, cache entries, jobs, uniqueness rules, search indexes, and exports to tenant scope. Test same-role access across two tenants. Use database isolation as defense in depth via `postgres-drizzle` or `supabase-stack`, not as a substitute for application authorization.
- Allowlist writable fields to prevent mass assignment. Protect role, owner, tenant, price, status, approver, and audit fields from client control.
- Make sensitive state transitions atomic. Prevent self-approval and stale-approval races when separation of duties is required; record actor, subject, old/new state, and approval decision without secrets.

## Untrusted input to sensitive sinks

| Boundary | Required control |
| --- | --- |
| General input | Parse once with a schema; constrain type, enum, length, count, nesting, numeric range, and canonical form. Reject unexpected fields where the contract permits. Validation does not make output safe for every sink. |
| HTML/JS/CSS/URL output | Use framework auto-escaping and context-specific encoding. Avoid raw-HTML escape hatches. Sanitize intentionally accepted markup with a maintained, configured sanitizer. |
| SQL/query | Use parameterized queries or safe ORM builders. Never concatenate values. Allowlist unavoidable identifiers/order expressions; parameters do not bind identifiers. Hand data-layer details to `postgres-drizzle`. |
| OS command | Prefer direct library or process APIs without a shell. Pass fixed executable plus separated arguments; allowlist constrained choices. Do not construct shell text from user input. |
| Templates/evaluation | Do not treat user-controlled text as server templates, code, expressions, regexes without bounds, or configuration. Keep templates trusted and data inert. |
| SSRF/outbound fetch | Allowlist required scheme, host, port, and path class; canonicalize with the platform URL parser; resolve and block loopback, private/link-local, metadata, and other disallowed destinations; disable redirects or revalidate every hop and resolved address. Apply time, response-size, and concurrency bounds. Prefer a controlled egress service where one exists. |
| Object merge/path assignment (JS) | Prototype pollution: never deep-merge, clone, or set by path from untrusted keys into plain objects. Reject `__proto__`, `constructor`, and `prototype` keys; use `Map` or `Object.create(null)` for keyed data; freezing prototypes or Node `--disable-proto=delete` is defense in depth only (OWASP Prototype Pollution Prevention Cheat Sheet). |
| Whole-object serialization | `JSON.stringify`, `util.inspect`, loggers, span attributes, or error context fed whole config/client/settings objects leak credential fields. Serialize an allowlist of scalar keys; keep secrets off object fields or non-enumerable/`#private`. Test with the sink's own serializer and assert the secret string is absent (paraphrased from getsentry/skills `secret-serialization`, Apache-2.0). |
| File upload | Limit count and bytes before expensive work; validate expected extension, media type, and signature; generate storage names; prevent traversal and overwrite; quarantine/scan where risk requires; store outside executable/public paths or in private object storage; serve with safe content type, disposition, and authorization. Bound archive extraction and image/document processing. |

Do not rely on blacklists, filename stripping alone, MIME alone, naive URL prefix checks, client-side validation, or a WAF as the authoritative control.

## Webhooks and replay-safe side effects

- Verify the provider signature over the exact raw request bytes before parsing or performing work. Use the provider's official maintained library and current algorithm; use constant-time comparison when implementing an officially documented primitive.
- Enforce expected endpoint/tenant/account context and bounded timestamp freshness. Support deliberate key rotation without accepting unsigned fallback paths.
- Store a provider-scoped event or delivery ID behind a durable unique constraint. Make the business transition idempotent and transactional; acknowledge duplicates without repeating side effects.
- Handle retries, duplicates, out-of-order events, and partial failure explicitly. Fetch authoritative provider state when the provider recommends it; never trust a success-page redirect for fulfillment.
- Hand Stripe-specific behavior to `stripe-best-practices`; describe webhook contracts in `openapi-spec` only where appropriate.

## Browser, session, and transport boundaries

- Use HTTPS end to end. Configure session cookies through the framework/auth owner with `Secure`, `HttpOnly`, appropriate `SameSite`, narrow domain/path, bounded lifetime, rotation after authentication or privilege change, and revocation. Never put session identifiers in URLs.
- Protect every cookie-authenticated state change against CSRF using the framework's supported token and/or strict origin mechanism. `SameSite` and Fetch Metadata are defense in depth, not universal replacements.
- CORS is a browser read policy, not authentication. Allow only exact required origins, methods, and headers; never combine credentialed requests with wildcard origins. Validate origins as origins, not suffix strings.
- Apply response headers at the layer that actually serves every relevant success and error response. Prefer a nonce/hash-based Content Security Policy; avoid `unsafe-inline`/`unsafe-eval`. Set appropriate `frame-ancestors`, `object-src`, `base-uri`, `X-Content-Type-Options: nosniff`, Referrer-Policy, and Permissions-Policy. Enable HSTS only at a confirmed HTTPS boundary with rollout suited to the domain.
- Verify CSP and headers in a real browser via `ui-validation`; hand framework syntax to its specialist.

## Secrets, cryptography, dependencies, and abuse

- Inventory secret sources, sinks, owners, scopes, and rotation paths. Use least-privilege, environment-scoped credentials from the existing secret manager. On suspected exposure: stop printing, preserve minimal evidence, revoke/rotate through the owner, and remove the source leak; deleting history alone does not revoke a credential.
- Use platform cryptography or a maintained high-level library: CSPRNG for tokens, authenticated encryption where encryption is needed, unique nonces as required, purpose-separated/versioned keys, and an explicit rotation/migration path. Never invent algorithms or silently fall back to weak/default keys. Defer password hashing and auth token formats to the auth specialist.
- Keep lockfiles and existing dependency policy; for any install, upgrade, or new package apply `supply-chain.md` (release-age quarantine, default-deny install scripts, no non-registry transitive deps, package-name existence check). Remove needless packages, evaluate advisory reachability and exploit preconditions, prefer supported releases, and verify the patched path. Hand workflow permissions, action pinning, artifact attestations, and CI provenance to `github-actions`.
- Rate-limit and quota by the strongest meaningful dimensions: account/service identity, tenant, operation, and trustworthy network signal. Bound body size, pagination, fan-out, recursion, concurrency, and expensive parsing before work begins. Use a shared/atomic store when instances scale. Do not trust forwarded IP headers beyond the configured proxy chain. Use `turnstile-spin` for requested bot challenges.

## LLM and agent features

Treat model input, retrieved documents, tool results, and model output as untrusted data crossing a trust boundary (LLM01/LLM05:2025, ASI01:2026). Prompt wording is not a security control.

- **Authority stays outside the model.** Tools execute with the calling user's server-side identity and tenant scope, not a broad service credential; authorize every tool call and its arguments as if a hostile user sent them (LLM06:2025 Excessive Agency, ASI02/ASI03:2026).
- **Least agency.** Expose the fewest tools with the narrowest operations; require explicit, attributable human confirmation for irreversible, financial, outbound-message, or privilege-changing actions. Never let model output approve its own action.
- **Output to sinks.** Model output reaching HTML, SQL, shell, URL fetch, file paths, or code execution gets the same sink controls as any untrusted input (table above). Sandbox any generated-code execution.
- **Data exposure.** Keep secrets and other tenants' data out of prompts, system prompts, and retrieval indexes; assume the system prompt can leak (LLM07:2025). Filter retrieval by the caller's authorization before the model sees it (LLM08:2025).
- **Indirect injection and memory.** Content fetched from the web, email, files, or persistent agent memory can carry instructions; scope and expire memory per user/tenant (ASI06:2026).
- **Consumption.** Bound tokens, tool-call depth, recursion, concurrency, and spend per identity/tenant (LLM10:2025).
- **Evidence.** Prove a planted inert instruction in retrieved/tool content cannot trigger an unauthorized tool call or cross-tenant read; a model "refusing" in one run is not proof.

Provider SDK and model specifics belong to the owning AI/platform skill (for example `agents-sdk`, `claude-api`).

## Logging and secure failure

- Record security-relevant authentication, authorization, admin, tenant, approval, webhook, secret-management, and abuse decisions with timestamp, event type, outcome, actor/service, target, tenant, and correlation ID as appropriate.
- Never log passwords, session or reset tokens, API keys, signature headers, raw payment/auth payloads, sensitive query strings, or unnecessary personal data. Sanitize untrusted values to prevent log injection; restrict log access and retention. Hand telemetry implementation to `observability-engineering`.
- Return stable, minimal client errors without stack traces, SQL text, filesystem paths, internal hostnames, secret fragments, or account-enumeration detail. Preserve useful diagnostics in protected server logs with correlation IDs.
- Fail closed for authorization, signature, tenant, and integrity decisions (OWASP A10:2025 Mishandling of Exceptional Conditions covers fail-open error paths). Make availability trade-offs explicit for optional dependencies; do not disguise upstream failure as success. Roll back partial state and ensure retries cannot duplicate sensitive effects.
