---
name: 99ribu-url-slugs
description: 99ribu URL scheme owner rule: clean title slugs on the public storefront, numeric ids in admin, no long codes in URLs; 99ribu-cf date-based catalog ids and INV99 invoice numbers
metadata:
  node_type: memory
  type: project
---

# 99ribu — URL slugs and admin ids

- **Owner rule (2026-10-28):** public storefront URLs carry no long codes.
  Product pages are `/produk/<title-words>` (stored unique slug, collisions get
  `-2`, `-3`; the old `title-<uuid>` shape and renamed slugs answer a 308 to the
  current slug). Categories already use their slug. Admin pages use short
  numeric ids (`/admin/orders/1042`) resolved to the UUID on the server; the
  UUID stays in APIs and the database. A user/staff page, if one is added, is
  addressed by the unique username (owner, 2026-10-28), never the user UUID;
  today no admin page is URL-addressed by user (staff and customers are a list
  and a lookup), and the accounts have no username column yet.
- **99ribu-cf rebuild (`~/Projects/99ribu-cf`, owner, 2026-11-19, `DEC-040`):**
  public product URLs carry no id at all (`/produk/<slug>`, a directly linked
  variant `/produk/<slug>/<variant-slug>`); the catalog id is `ddmmyy` (WIB) +
  daily sequence from `1001` (`1911261001`), the same string on Meta Content ID,
  Google `id`, TikTok `sku_id`, Pixel/CAPI and the admin URL; parent id =
  `item_group_id`; new catalogs on every platform. Orders/invoices are
  `INV99-ddmmyy1001` and the digits are the AutoLaris `reff_id`. Method and
  sources: skill `meta-ads-signal-engine` → `CATALOG_IDENTITY_AND_AUDIT.md`.
- **Never reintroduce** a UUID, hash or random tail in a public URL, sitemap
  entry, canonical, JSON-LD `url` or product feed link.
- **Decisions and the exact scheme live in the repository** (`ARCHITECTURE.md`,
  `DESIGN.md`, `DECISIONS.md`, migrations 0040 public slug and 0041 admin
  numbers). When this file and the repository disagree, the repository wins.
- Related rule for all sites: shared `preferences.md` "SEO Invariant — Public
  URL slugs". See also [[99ribu-shop-com-ui-ux-pattern]].
