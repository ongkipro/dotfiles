# Memory: Product platforms and admin applications

> Advisory portfolio map. Load this file only for the named platform; inspect
> its repository contracts and executable state before implementation.

## social-autopilot — brand: Volum

- Repository: `ongkipro/social-autopilot`; expected checkout:
  `~/Projects/social-autopilot`.
- Product boundary: autopilot-first social publishing for Facebook, Instagram,
  Threads, and Pinterest; Twitter is intentionally excluded.
- Authentication details, test accounts, runtime models, provider fallbacks,
  deployment state, and implementation contracts belong in the repository.

## volumecms

- Repository: `ongkipro/volumecms`; expected checkout:
  `~/Projects/volumecms`.
- Product boundary: multi-tenant CMS platform with a neutral admin and
  per-client public themes. Each client uses a dedicated deployment and
  database rather than query-level tenancy.
- Repository documentation owns themes, RBAC, quotas, feature flags,
  provisioning, credentials, deployment topology, and operational gotchas.
- `nextpress` was the superseded prototype; do not continue it as the active
  product.

## volumform

- Repository: `ongkipro/volumform`; expected checkout:
  `~/Projects/volumform`.
- Product boundary: Indonesian multi-tenant direct-response funnel SaaS for
  COD, CRM, conversion signals, and shipping.
- Detailed UX reference: project-memory
  [`volumform-id-market-ux.md`](../project-memory/volumform-id-market-ux.md).

## adsbookcms

- Repository: `ongkipro/adsbookcms`; expected checkout:
  `~/Projects/adsbookcms`.
- Product boundary: installable, single-tenant Cloudflare CMS. One install
  maps to one Worker; do not introduce an in-application tenant abstraction.
- `permatamall` is a separate reference-install repository derived from this product. It may contain merchant-specific data, styling, deployment policy, and historical claims that must be re-verified before reuse.
- AdsBookCMS ships no merchant catalog or demo dataset by default (ADR-016); never copy Permatamall content, credentials, assets, or live-install policy into the product repository.
- Repository `AGENTS.md`, `ARCHITECTURE.md`, `TASKS.md`, and `DECISIONS.md`
  own implementation, gaps, execution state, and history.
- Ad signal work routes to `meta-ads-signal-engine` and
  `google-ads-signal-engine`.
