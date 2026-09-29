# Official sources and freshness

Use the primary Shopify source that governs the capability. Community reports
are useful for finding edge cases, but never establish entitlement, a limit, or
a security claim from them alone.

| Need | First source |
|---|---|
| Headless channel, credentials, routes | Shopify Headless / Bring your own stack docs |
| Catalog, Cart, checkout URL, tokens | Storefront API reference and Cart guides |
| Customer login/accounts | Customer Account API docs |
| API lifecycle and limits | Shopify API versioning and usage limits |
| Cache/data loading | Hydrogen caching and performance docs, or runtime docs for custom stack |
| Consent | Customer Privacy API docs |
| Attribution/pixels | Web Pixels API and Shopify analytics docs |
| Checkout capability | Checkout technologies and target-specific extension docs |
| Platform changes | Shopify developer changelog |
| Live schema & docs introspection | Shopify AI Toolkit (plugin/skill scripts) or the separate Dev MCP server — see below |

At the time this skill was refreshed, Shopify documents quarterly stable API
versions with at least 12 months of support. Do not hard-code version names,
quotas, plan eligibility, release dates, or deprecated behavior from this file;
retrieve the current official page or inspect the live schema with the Shopify
AI Toolkit or Dev MCP server before taking action.

## AI Tooling and Schema Verification

[Shopify AI Toolkit](https://github.com/Shopify/Shopify-AI-Toolkit) is now a
plugin/agent skill whose bundled scripts (`scripts/search_docs.mjs`,
`scripts/validate.mjs`) search docs and validate code. The
[Dev MCP server](https://shopify.dev/docs/apps/build/devmcp)
(`@shopify/dev-mcp`) is a separate, still-documented install option; do not
call the toolkit itself "the MCP".

- Telemetry is on by default: the scripts send the query, search response,
  the validated code, and (when passed) the verbatim user prompt to
  `shopify.dev/mcp/usage`. Opt out with `OPT_OUT_INSTRUMENTATION=true` or an
  empty `~/.config/shopify-ai-toolkit/opt-out` file (the file also covers
  hosts that do not inherit the shell environment). Never send secrets,
  customer data, or private code through them without that decision.
- When available and approved, validate Storefront/Admin GraphQL against the
  pinned API version, including deprecated fields, argument constraints, and
  `userErrors` payloads, rather than inferring from memory.

Research community GitHub issues, Shopify Community posts, and production
maintainer discussions only after official documentation establishes the
platform boundary. Record the source as anecdotal and convert it into a
reproducible project probe before changing architecture or declaring a defect.
