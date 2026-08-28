# Memory: Product platforms and admin applications

> Advisory portfolio map. Load this file only for the named platform; inspect
> its repository contracts and executable state before implementation.


## volumecms

- Repository: `ongkipro/volumecms`; expected checkout:
  `~/Projects/volumecms`.
- Product boundary: multi-tenant CMS platform with a neutral admin and
  per-client public themes. Each client uses a dedicated deployment and
  database rather than query-level tenancy.
- Repository documentation owns themes, RBAC, quotas, feature flags,
  provisioning, credentials, deployment topology, and operational gotchas.

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
- Live installs (each its own repo/Worker/D1/KV/R2 under `~/Projects/`):
  merge-type (`git merge product/main`) — carukesi, skincarebpom, taniniaga,
  each on `install/<name>`; copy-type (apply the product diff as a patch,
  never `wrangler.jsonc`/`RELEASE.md`) — permatamall and zanobyshop on `main`,
  zvarashop on `install/zvarashop`. The branch name does not imply the install
  type: check for `Merge remote-tracking branch 'product/main'` commits, since
  a copy-type install records `chore: adopt AdsBookCMS <version>` instead.
  `adsbookcms-dev`/`adsbookcms-lp` are product worktrees, not installs.
- **A React island that throws during SSR returns `200` with an empty body** —
  a blank white page that `astro check`, `tsc`, `npm test` and `npm run build`
  all call healthy, because the suite globs `src/lib/*.test.ts` and executes no
  `.tsx`. This shipped to all six installs once (1.3.4, admin order list). Put
  the branch in `src/lib/` where the runner reaches it, and open the page
  before deploying anything browser-visible.
- Admin list rows have **two independent producers** — the API mapper and the
  server-rendered query in the page's own `.astro` frontmatter. Adding a field
  to one and not the other is what caused that blank page; check both.
- Separate resources do not isolate the Workers Free-plan **KV write quota**:
  it is per Cloudflare account (1,000/day) and the account carries ~21 KV
  namespaces across every product. On 2026-08-27 it ran out and every install
  500'd on kecamatan search and admin login; product 1.3.2 / ADR-021 moved
  sessions and rate limits to D1 and made KV cache-only. A fleet-wide symptom
  is a product bug — `wrangler tail` one install first.
