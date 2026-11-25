# Archived Hydrogen tracking blueprints

> **Archived 2026-11-23. Not part of this skill's contract. Do not load by default
> and do not copy code from here into a project.** Read
> [`../delivery-contract.md`](../delivery-contract.md) for the current rules.

These seven files are 2026-09 design sketches from before Hydrogen `2026.10`. They
were kept, not deleted, so a Classic Hydrogen (`<= 2026.4.x`) storefront can still
borrow a pattern. Nothing in this repository, in `~/Projects`, or in the memory files
links to any of them.

## Why they are archived

- **They target APIs that no longer exist in `2026.10+`.** Four use `useAnalytics()`,
  `analytics.subscribe()`, `getShopAnalytics()`, `NonceProvider`, or `withPrivacyBanner`.
  `delivery-contract.md` lists what replaced them (`window.Shopify.analytics`,
  `addDestination()`, `ShopifyScripts`, `createContentSecurityPolicy({shop, directives})`).
- **Two pin Meta Graph API `v22.0`**, which is four releases behind. The provider skill
  says never to hardcode a version (see `meta-ads-signal-engine`).
- **Most of the content already has an owner** that is kept current:

| Archived file | What it covers | Current owner |
|---|---|---|
| `advanced-matching-normalizer.md` | Email and phone normalization, SHA-256 | `meta-ads-signal-engine/references/IDENTITY_NORMALIZATION.md` |
| `meta-capi-server-engine.md` | CAPI sender, test events, dedup | `meta-ads-signal-engine/references/CAPI_SENDER.md` and `DEDUPLICATION_EVENT_ID.md` |
| `meta-pixel-connector.md` | Browser pixel and `event_id` dedup | `meta-ads-signal-engine/references/PIXEL_2026_CHANGES.md`, plus `../delivery-contract.md` for `addDestination()` |
| `wetracked-parity-architecture.md` | First-party cookies, cart-attribute bridge | `meta-ads-signal-engine/references/WETRACKED_ATTRIBUTION_PARITY.md` |
| `gtm-datalayer-connector.md` | Hydrogen events to `window.dataLayer` | `google-ads-signal-engine` (`CONSENT_MODE_V2.md`, `ENHANCED_CONVERSIONS.md`) for the Google side; `../delivery-contract.md` for the Hydrogen side |
| `cross-domain-attribution.md` | Cart attributes carry click IDs into the order | `../delivery-contract.md` section 3 |
| `csp-and-consent.md` | CSP and consent banner wiring | `../delivery-contract.md` section 2, and the `hydrogen-request-handlers` skill packaged inside `@shopify/hydrogen` |

## If you need one of them

Read it as a sketch, then re-derive the code against `../delivery-contract.md` and
the provider skill for the platform you are sending to. The first lines of each file
repeat this warning. If the storefront is Classic Hydrogen and you are about to ship
something from here, say so in the task so the gap is a recorded decision.

## Restoring one

`git mv` it back to `references/` and re-add its line to the routing list in
`../../SKILL.md`. Its `../delivery-contract.md` link then needs the `../` removed.
