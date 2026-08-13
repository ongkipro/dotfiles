# 0. MODE DETECTION (before anything else)

Pick ONE mode. It changes which rules fire.

| Mode | Signals | Rule set |
|---|---|---|
| **Brand / Marketing** | agency site, SaaS landing, portfolio, storefront home, editorial/blog/docs, "premium", "clean", brand awareness | All sections apply (editorial, docs, and portfolio also get §4.5.1) |
| **DR / COD Funnel** | LP produk COD, ads funnel, Scalev/order form, "yang penting convert", quiz/geo funnel | Sections apply EXCEPT the overrides in Section 6 |

If a page is both (storefront home that also sells), default Brand mode for
the shell, Funnel mode for the product/offer blocks.

For product discovery, variants, cart, checkout handoff, customer account,
inventory conflicts, or commerce analytics contracts, keep the visual direction
here and load `storefront-ux` for interaction behavior.

Out of scope entirely: admin panels, dashboards, data tables, multi-step
product UI → use the `admin-dashboard` skill. Say so and stop.
