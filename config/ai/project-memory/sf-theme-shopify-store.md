---
name: sf-theme-shopify-store
description: Shopify store handle and theme for the SF-Theme project
metadata: 
  node_type: memory
  type: project
  originSessionId: 552a6bd3-29dd-4de2-87f5-559436b550e8
---

The `SF-Theme` project (`~/Projects/SF-Theme`) works on the Shopify theme **olivia-16-6-0a** (#186432061760, unpublished) on store **`yn80fb-mb.myshopify.com`**.

`yn80fb-mb` is the permanent store handle — use it for all Shopify CLI commands. `olivia-16-6-0a` is a vanity/theme name and does NOT work as a `--store` value (the CLI returns "not authorized / use the permanent store domain"). The live theme on this store is Dawn (#186434617664).

**Theme:** "Olivia" by LuminTheme v16.6.0A — a Dawn-based CRO/conversion theme (cart upsells, free-shipping bar, countdown timers, sticky cart, wishlist, bundle deals, quantity breaks). All vendor code is `lumin-`/`Lumin-` prefixed. Ships beauty/skincare demo templates but **this store is actually a pet brand, "PetCue.co"** — homepage wired to pet collections, and `layout/theme.liquid` hard-codes the index page `<title>`/description to PetCue copy (overriding theme settings for `request.page_type == 'index'`).

A full structural scan lives in `THEME-NOTES.md` at the project root — read it before deep theme work. Gotchas: don't hand-edit `config/markets.json` or `*.context.*.json` (auto-generated); homepage SEO is hard-coded in theme.liquid; `blocks/_*.liquid` are internal product blocks.
