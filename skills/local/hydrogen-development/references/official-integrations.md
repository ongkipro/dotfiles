# Official integrations

Use this reference only when the task needs a current platform fact or an AI
host integration decision. Prefer the linked primary source over memory.

## Hydrogen framework versus developer preview

- The current Hydrogen framework is React Router based. For a new app, use
  the command shown by the current [Hydrogen documentation](https://shopify.dev/docs/api/hydrogen).
- The upstream [Hydrogen repository](https://github.com/Shopify/hydrogen)
  is the implementation source for the official generator and packages. Its
  standard skeleton currently combines React Router, Hydrogen, Oxygen, Vite,
  Shopify CLI, GraphQL code generation, and local Mini Oxygen. Treat that as
  a current scaffold baseline, not a mandate to rewrite an existing app.
- The [Hydrogen developer preview](https://shopify.dev/docs/storefronts/headless/developer-preview)
  is a separate, framework-agnostic SDK direction. Do not mix its setup or
  APIs into an installed React Router Hydrogen project without an explicit
  migration decision and verified compatibility.

## Release snapshot (verified 2026-10-02)

Point-in-time facts for orientation only; the installed lockfile and the
current changelog win. Sources: npm `@shopify/hydrogen` dist-tags
(https://registry.npmjs.org/@shopify/hydrogen), the package changelog
(https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/CHANGELOG.md),
and https://shopify.dev/docs/api/usage/versioning, all accessed 2026-10-02.

- npm `latest` is `2026.4.6`; it pins Storefront API and Customer Account API
  `2026-04`. Shopify's latest stable API is `2026-10`. Hydrogen does not ship
  every quarter (there is no 2026.7), so a framework that lags the newest
  API is normal; it is not a reason to bump query versions by hand.
- Peer ranges on `2026.4.6`: `react-router` and `@react-router/dev` `~7.16.0`,
  Vite 5 through 8. New projects default to React Router 7.16 and Vite 8.
- `2026.4.0` removed `proxyStandardRoutes`: the same-origin Storefront API
  proxy in `createRequestHandler` is always on, and the handler throws if the
  load context lacks a `storefront` instance. `2026.4.6` routes consent
  through that proxy and stops creating `_shopify_y`/`_shopify_s`; custom
  request handlers that bypass it lose visitor analytics and consent.
- `2026.1.0`: `cartDiscountCodesUpdate` requires `discountCodes`.
  `2026.4.0`: cart operations can return
  `MERCHANDISE_LINE_TRANSFORMERS_RUN_ERROR` when a Cart Transform Function
  fails; JSON metafield writes are capped at 128KB on `2026-04`+.
- `2026.1.4` proxies `/api/mcp` to Shopify's Storefront MCP server. Treat that
  route as a public agent surface when reviewing routing and rate limits.
- npm `preview` is `2026.10.0-preview.x`, the framework-agnostic SDK
  (`npx @shopify/hydrogen@preview setup`). Its `hydrogen skills sync` writes
  packaged agent skills into `.claude/skills` and `.agents/skills`, and
  `hydrogen skills check` gates CI on drift. Those writes change repository
  files: run them only on a project that adopted the preview and with approval.

## Generated contracts and versioning

The upstream project ties Hydrogen and `hydrogen-react` releases to specific
[Storefront API](https://shopify.dev/docs/api/storefront) and Customer Account
API versions. API-version upgrades can therefore be framework upgrades too.
Inspect the installed lockfile, package manifest, and generated artifacts as a
unit; do not change a GraphQL endpoint/version independently.

The current skeleton's GraphQL configuration separates Storefront documents
from Customer Account documents and its local scripts run Hydrogen codegen plus
React Router type generation. When an installed project follows that pattern:

- change source documents, not generated declaration files;
- run its `codegen` script after a query or API-version change;
- run its `typecheck` script after generation; and
- preserve `hydrogenPreset()` in React Router configuration unless the runtime
  migration is an explicit accepted task.

The generator, Node engine range, scripts, and file layout can change. The
generated project's manifest is authoritative for that project; do not derive
runtime requirements from an older README or another storefront.

## Shopify AI Toolkit

[Shopify AI Toolkit](https://github.com/Shopify/Shopify-AI-Toolkit) provides
current documentation/API schema access and code validation for supported AI
hosts. It is host tooling, not an application dependency.

When a user explicitly authorizes installation, follow the toolkit's current
host-specific instructions rather than guessing a command. Confirm the host
and inspect the install result before relying on it. The Toolkit documents
[usage telemetry and opt-out behavior](https://github.com/Shopify/Shopify-AI-Toolkit#telemetry):
its bundled scripts (`search_docs.mjs`, `validate.mjs`) send queries, validated
code, and optionally the user prompt to shopify.dev, on by default, opt out with
`OPT_OUT_INSTRUMENTATION=true` or an empty `~/.config/shopify-ai-toolkit/opt-out`.
The [Dev MCP server](https://shopify.dev/docs/apps/build/devmcp) is a separate
install option. Do not enable or disable telemetry implicitly.

For an installed Toolkit, use its schema/doc tools to validate Shopify-specific
code or discover CLI commands. Do not treat a plugin response as authorization
for store mutations, credential access, sales-channel changes, or deployment.

As of 2026-10-02 the Toolkit ships one consolidated `shopify` skill plus a
`ucp` skill; the per-domain skills, including `shopify-hydrogen`, sit under
`deprecated/` and tell users to switch to `shopify`. The `shopify` skill's
frontmatter registers a `PostToolUse` telemetry hook, and its validator takes
a base64 copy of the user prompt. The Dev MCP alternative installs as
`npx -y @shopify/dev-mcp@latest` and runs locally without authentication.
Sources: https://github.com/Shopify/Shopify-AI-Toolkit (`skills/shopify/SKILL.md`,
`deprecated/`) and https://shopify.dev/docs/apps/build/devmcp, accessed
2026-10-02.

Validation loop, paraphrased from the Toolkit's `shopify` skill workflow: search
the docs for the topic before writing; validate every generated GraphQL
document or extension against the project's pinned API version, not the
latest; on failure, search the exact field or value the error names, change
only that, and re-run; stop after three attempts and report the remaining
error rather than guessing values. Without the Toolkit, apply the same loop
with the project's codegen and typecheck scripts.

## UCP is not a Hydrogen default

[`@shopify/ucp-cli`](https://github.com/Shopify/ucp-cli) supports Universal
Commerce Protocol catalog, cart, checkout, and order flows for agents. It is
not required to scaffold, run, deploy, or operate a conventional Hydrogen
storefront. Load it only when the accepted work is explicitly agentic commerce
or a UCP merchant integration; keep its credentials and merchant operations
outside the Hydrogen browser runtime.
