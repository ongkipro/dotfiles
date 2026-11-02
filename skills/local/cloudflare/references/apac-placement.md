# Asia-Pacific placement (Indonesia / Southeast Asia audiences)

Owner default (2026-11-02): web projects whose users are in Indonesia or
Southeast Asia keep their **stateful** Cloudflare resources and any pinned
Worker placement in Asia-Pacific, as close to Singapore as Cloudflare lets
you choose. Verified against the docs linked below on 2026-11-02; recheck
them before relying on a hint list, because Cloudflare adds hints over time.

## What can and cannot be chosen

| Layer | Who decides | Control | Choose for ID/SEA |
|---|---|---|---|
| Visitor → edge PoP (static assets, cache, WAF, Worker by default) | Anycast + visitor's ISP peering | none on any plan; not a setting | nothing to set. A Jakarta visitor may land in CGK or SIN depending on the ISP; check `https://<site>/cdn-cgi/trace` (`colo=`) |
| **D1** primary | creation request location, or `--location` | location hint at creation only; cannot move later | `wrangler d1 create <name> --location apac` |
| **R2** bucket | creation request location, or `--location` | location hint at creation only; first creation of that name wins | `wrangler r2 bucket create <name> --location apac` |
| **Durable Objects** | first `get()` location, or `locationHint` | hint on the first `get()` per object | `{ locationHint: "apac-se" }` (Southeast Asia); `apac` when users span all of Asia |
| **Worker execution** | nearest PoP to the visitor | `placement` in Wrangler config | default (no placement) for edge-only Workers; see below when it talks to a backend |
| KV | global replication | none | nothing to set |
| Regional Services (where TLS is terminated) | Enterprise add-on | managed region, e.g. Singapore | only with an Enterprise contract and a real compliance need; there is no Indonesia region |
| Jurisdiction (D1, R2, DO) | creation | `eu`, `us`, `fedramp` only | **none exists for Asia**; never claim data residency in Indonesia or Singapore from a hint |

Hints are best effort, not guarantees: Cloudflare places the resource in the
lowest-latency location it supports near the hint. `apac` is the finest D1
and R2 hint; Durable Objects also accept `apac-se` and `apac-ne`.

## Worker placement for an Indonesian/SEA site

- **Edge-only Worker** (static assets, HTML, cache, redirects): no
  `placement`. It already runs at the visitor's PoP.
- **Worker that queries D1/R2 several times per request:** the hop is
  Worker → APAC primary. With a SEA audience the visitor PoP is already near
  it; leave placement unset, or `"mode": "smart"` if analytics show slow
  request duration. Smart Placement only moves to locations that already
  receive traffic and only affects `fetch` handlers.
- **Worker in front of one backend in a known cloud region** (e.g. Postgres
  in AWS Singapore or GCP Jakarta): `"placement": { "region":
  "aws:ap-southeast-1" }` (Singapore), `"aws:ap-southeast-3"` (Jakarta),
  `"gcp:asia-southeast1"` (Singapore), `"gcp:asia-southeast2"` (Jakarta) or
  `"azure:southeastasia"`. A VPS outside the big clouds:
  `"placement": { "hostname": "api.example.co.id" }` (experimental).
- Static assets are always served from the visitor's PoP, whatever the
  placement.

## Creating resources (the only moment that counts)

D1 and R2 location is fixed when the resource is created, and Automatic picks
the region near **whoever runs the create command or CI job**. A GitHub
Actions runner in the US creates a US database. Therefore:

1. Always pass `--location apac` to `wrangler d1 create` and
   `wrangler r2 bucket create` for an ID/SEA project, even from Indonesia.
2. Record the choice in the project (`wrangler.jsonc` comment or
   `ARCHITECTURE.md`): resource, hint, date.
3. Verify after creation: R2 shows the location in the dashboard and in
   `wrangler r2 bucket info <name>`; D1 shows it in the dashboard database
   overview. Report it as verified only after seeing it.

## Existing resources in the wrong region

D1 and R2 cannot be moved in place. Migration = new resource with
`--location apac` → copy data (D1: `wrangler d1 export` then `execute
--file`; R2: copy objects, e.g. Super Slurper or `rclone`) → switch the
binding → keep the old one until verified. This is a production data
migration: needs explicit owner approval, a backup, and a rollback plan
before any remote command.

## Do not

- Promise "data stays in Indonesia/Singapore". Without an Enterprise
  Regional Services contract, Cloudflare offers no Asian residency guarantee;
  hints are latency optimisations.
- Expect a plan upgrade to change which PoP Indonesian visitors use; peering
  of the visitor's ISP decides it.
- Re-create a D1 or R2 resource to "fix" its region without the migration
  steps above.

Sources: [D1 data location](https://developers.cloudflare.com/d1/configuration/data-location/),
[R2 data location](https://developers.cloudflare.com/r2/reference/data-location/),
[Durable Objects data location](https://developers.cloudflare.com/durable-objects/reference/data-location/),
[Workers placement](https://developers.cloudflare.com/workers/configuration/placement/),
[Regional Services](https://developers.cloudflare.com/data-localization/regional-services/),
[Data Localization region support](https://developers.cloudflare.com/data-localization/region-support/).
