---
name: 99ribu-shop-com-ui-ux-pattern
description: Where the 99ribu storefront's shop.com-derived UI/UX research lives, and which repository documents own the design decisions
metadata:
  node_type: memory
  type: project
---

# 99ribu — `shop.com` UI/UX Reference Pointer

- **Decisions live in the repository**, not here: `~/Projects/99ribu`
  `DESIGN.md`, `docs/spec/10-DESIGN-SYSTEM-WHITELABEL.md`, and
  `docs/spec/design/references/shop-com/visual-context.md` (review rounds under
  `docs/spec/design/reviews/shop-com-r2/`). When this file and those disagree,
  the repository wins.
- **Raw research pack** (page-by-page notes, `shop-com-scan-data.json`, and
  desktop/mobile captures): `~/Documents/work/research/shop-com-99ribu-ui-ux/`;
  start from its `README.md`.
- `shop.com` is a structural reference only; its sign-in-gated cart does not
  transfer, because 99ribu keeps guest cart and order capabilities
  (`docs/adr/ADR-0007-guest-commerce-capabilities.md`).
- Catalog and warehouse data: [[99ribu-berlapak-catalog]].
