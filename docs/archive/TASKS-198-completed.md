# TASK-198 — completed 2026-11-07

Shipped in `1ac9ee8` and `6d053f3`; ledger runs `RUN-20261107T083315Z-7ebef39a` and `RUN-20261107T093120Z-1cdbc029` PASS.

## TASK-198: CPAS PCA Unified campaign, creative & omnichannel ad set contract
- **Requirement:** REQ-CPAS-PCA-UNIFIED (2026-11-07: `Website and app` UI, `7d_click+1d_view+1d_ev`, `dotads:` naming, SDK catalog creative + 6 CPAS traps).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/dotads-meta`, `bin/dotads-meta-test`, `skills/local/meta-ads-cli/**`, `config/ai/memory/meta-ads.md`, `TASKS.md`, `CHANGELOG.md`.
- **Protected Paths:** `bin/delivery-ledger`, `docs/task-change-boundary.md`, `config/ai/README.md`.
- **Canonical Contract Owners:** `dotads-meta`; `cpas-collaborative-ads.md`; `rules-and-tutorial.md`.
- **Accepted Invariants:** SDK creates CPAS campaign (`is_pca_unified`, `promoted_object`), catalog creative (`template_url_spec`, `asset_feed_spec`, `format_transformation_spec`), and ad set (`ad_set_goal`, `omnichannel_object`); `validate` guards `product_set_id`, `age_max<65`, catalog, and `da_collection`; public files stay de-identified.
- **Regression Checks:** `workspace`, `provider`, `meta-cli`, `skill`, `policy`, `memory-link`, `system-map`, `security`.
- **Reopen Conditions:** Ads Manager hides `Website and app` or SDK leaks token / activates without `--activate`.
- **Non-Scope:** live account calls in tests; history rewrite.
- **Escalation Conditions:** unapproved live account mutation.
