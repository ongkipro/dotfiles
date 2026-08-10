---
name: petcue-dawn-rebuild
description: PetCue theme rebuild on Dawn base (legal alternative to licensed Olivia theme)
metadata: 
  node_type: memory
  type: project
  originSessionId: 552a6bd3-29dd-4de2-87f5-559436b550e8
---

Building a **fresh Dawn-based theme "PetCue (Dawn build)"** as a legal, license-free alternative to the LuminTheme Olivia theme — so it can run on the unlicensed store. Reason: Olivia is per-store licensed; only [[sf-theme-shopify-store]] (`yn80fb-mb`) is activated. The user repeatedly asked to strip Olivia's license/DRM check (declined — it's circumventing commercial licensing). Dawn rebuild is the agreed legal path.

**Locations & IDs:**
- New theme code: `~/Projects/petcue-theme` (own git repo, Dawn base + commits)
- Target store: **`2mpt3p-xv.myshopify.com`** (separate store; live theme = Horizon; has storefront password so `theme dev` needs `--store-password`, use `theme push` instead)
- Remote theme: **PetCue (Dawn build)** #184212979823 (unpublished). Push with: `shopify theme push --path ~/Projects/petcue-theme --store 2mpt3p-xv.myshopify.com --theme 184212979823`

**Brand (carried from Olivia settings):** Poppins headings (poppins_n5) + Harmonia Sans body (harmonia_sans_n4); colors white + red #fe2828/#ff5454 + charcoal #1f1d24 + pink tints (#fff5f7,#ffe7ec); page_width 1400; cart_type drawer; rounded cards (radius 12, shadow).

**Historical snapshot (2026-06-24; verify the repository before resuming) — phases (5):** 1. Foundation/rebrand ✅ · 2. Homepage ✅ · 3. PDP funnel ⏭️ · 4. Cart CRO (upsell, free-ship bar) ⏭️ · 5. Merchandising + social proof + polish ⏭️. Paused by user 2026-06-24 ("skip dulu development"). CRO feature scope still unconfirmed (user answered ambiguously twice).

**Gotcha:** Dawn settings_data numeric steps — shadow opacity/blur must be multiples of 5, radius multiples of 2, slideshow change_slides_speed ∈ {3,5,7,9}. Validate via push errors.
