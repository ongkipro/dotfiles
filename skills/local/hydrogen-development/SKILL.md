---
name: hydrogen-development
description: >-
  Build, migrate, debug, upgrade, or verify a Shopify Hydrogen storefront.
  Use for the current React Router-based Hydrogen framework, Oxygen runtime,
  Storefront API integration, cart/session behavior, route data, caching, and
  storefront release evidence. Not for generic Shopify headless architecture,
  tracking-only work, Liquid themes, or UCP agentic-commerce integrations.
---

# Hydrogen Development

Own the framework-specific implementation of a Shopify Hydrogen storefront.
Keep Shopify as the commerce authority and preserve the accepted boundary from
`headless-shopify`; this skill does not replace it.

## Start from the installed project

Read repository instructions, package scripts and lockfile, route structure,
environment-variable names without printing values, deployed runtime, and the
existing cart, session, customer-account, SEO, analytics, and test contracts.
When present, also inspect the GraphQL configuration, generated API types,
React Router configuration, and runtime entry point. They describe the
installed application's contract; do not recreate a current skeleton layout
inside an older or custom project.
Classify the task before editing:

- **New app:** use the current official Hydrogen generator only after the
  destination and development authorization are clear.
- **Existing app:** preserve its installed Hydrogen and React Router contract;
  do not migrate it merely because a newer preview or scaffold exists.
- **Developer preview:** treat the framework-agnostic Hydrogen preview as a
  separate migration decision, not an upgrade of the current framework.

For a new storefront, read [New storefront start](references/new-storefront-start.md).
It separates a disposable Mock.shop quickstart from a real-store link and an
Oxygen preview deployment; those are not interchangeable steps.

For a new headless decision, migration, API/token/cache/account/analytics
boundary, load `headless-shopify` first. For page composition and buyer-facing
commerce state, load `storefront-development`; for journey requirements load
`storefront-ux`.

Read [Official integrations](references/official-integrations.md) when a
platform capability, generator, AI Toolkit integration, or UCP question is
in scope.
Read [Commerce platform boundaries](references/commerce-platform-boundaries.md)
when changing cart behavior, Customer Accounts, search, metaobjects, a Liquid
to Hydrogen migration, or any Shopify-hosted tracking/pixel surface.
Read [SEO, environments, and launch](references/seo-environments-launch.md)
when changing route metadata, sitemap/robots, Oxygen environments, preview
visibility, traffic routing, domains, or a production cutover.

## Implement the Hydrogen boundary

- Fetch public storefront data in the server-side route/data boundary, with an
  explicit cache policy that varies for every market, locale, currency, buyer,
  or other response-affecting context.
- Keep cart references and customer-account/session state server-backed and
  private. Reconcile cart UI from the authoritative mutation response and its
  user errors; use only the returned checkout URL at handoff.
- Keep operational Admin API access, private Storefront tokens, customer
  credentials, webhook verification, and personal data out of browser code.
- Preserve server-rendered product, collection, search, and content routes;
  establish redirects, canonical URLs, metadata, localization, and error
  behavior before client-only enhancements.
- Prefer installed Hydrogen and React Router primitives over a new abstraction
  or dependency. Do not transplant patterns from a different Hydrogen major
  version without checking the installed project and current official docs.
- Treat Hydrogen, Storefront API, and Customer Account API versions as one
  compatibility decision. Upgrade them deliberately, regenerate types, and
  typecheck; never change only a query's API version to silence a schema error.
- After editing GraphQL documents, run the project's code-generation script
  before typechecking. Do not hand-edit generated Storefront API, Customer
  Account API, or route type declarations.

Use `hydrogen-headless-tracking` only for analytics, pixels, consent, or
server-side conversion signals. Use `seo-website-builder` for SEO/indexation,
`application-security` for auth, tokens, webhooks, customer data, or external
integrations, `ui-validation` for a browser-visible change, and `web-perf`
only for measured performance investigation.

## Preserve indexation and release boundaries

Use the installed Hydrogen metadata utilities and route `meta` contract for
HTML metadata. Let the most specific nested route own product or content SEO;
do not restore query parameters to canonical URLs by default. Do not add a
sitemap or robots route before confirming the project does not already own one.

Treat Oxygen environment variables, visibility, domain routing, and deployment
as external environment state. Never print values, make an environment public,
change a target branch, rotate a token, alter DNS, remove password protection,
or redirect Online Store traffic without explicit approval. A launch also
requires redirects, canonicals, feeds, notification links, channel publication,
and checkout-domain behavior to be verified together.

## Keep Shopify surfaces separate

Hydrogen owns the storefront runtime. Shopify-hosted checkout and Web Pixels
are separate controlled surfaces. Do not assume a Web Pixel can use Hydrogen
code, arbitrary DOM access, or the same storage/session boundary. Coordinate
event names and consent across surfaces, but implement each in its supported
runtime.

## AI Toolkit is an optional host capability

When installed in the active AI host, use Shopify AI Toolkit for current
official documentation, schema validation, and Shopify CLI discovery. It is
not a project dependency and it is not a replacement for repository evidence.

Never install its Claude, Codex, or Antigravity plugin automatically. Plugin
installation changes the local AI runtime and may enable toolkit telemetry;
ask for explicit approval first. If the Toolkit is unavailable, retrieve the
required current fact from official Shopify documentation instead. Do not
write to a store, alter permissions, or expose credentials as part of this
fallback.

## Verify the actual path

Run the project's smallest relevant typecheck, test, lint, or build script.
Use the project's local Hydrogen/Shopify CLI integration rather than assuming
a globally installed CLI. A scaffold's `dev` command may also run GraphQL
codegen and an Oxygen-compatible local runtime, so use it as the first
browser-proof path when available.
For a browser-visible change, run the app and verify the affected route in a
browser, including a relevant loading/error state and cart-to-checkout handoff
when touched. Record unavailable checks as `UNVERIFIED` or `BLOCKED`.

Do not deploy to Oxygen, publish a storefront, change a sales channel, or
modify production data without explicit approval.

## Ownership boundaries

- `headless-shopify`: architecture, Shopify authority, API/token/cache/account
  boundaries, and migration contract
- `hydrogen-development`: installed Hydrogen framework and runtime delivery
- `storefront-development`: page composition and commerce UI implementation
- `storefront-ux`: buyer journeys and observable commerce states
- `hydrogen-headless-tracking`: privacy-aware tracking and ad signals
- `seo-website-builder`: indexation, metadata, schema, and search strategy
