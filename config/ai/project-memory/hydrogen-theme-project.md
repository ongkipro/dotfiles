---
name: hydrogen-theme-project
description: "hydrogen-theme — modular plug-and-play Shopify Hydrogen theme (React Router v7 + Vite on Shopify Oxygen); canonical repo ongkipro/hydrogen-theme"
metadata:
  node_type: memory
  type: project
  modified: 2026-09-04
---

Modular, white-label, headless Shopify Hydrogen theme engineered for rapid plug-and-play UI/UX customization, high conversion rates (CRO), and seamless multi-project reuse.

- Canonical repository: `ongkipro/hydrogen-theme` (private) under `~/Projects/hydrogen-theme`.
- Stack: Shopify Hydrogen (`@shopify/hydrogen@^2026.4.5`), React Router v7 (`7.16.0`), Vite, Tailwind CSS v4, Shopify Oxygen runtime.
- Architecture:
  - 12-section dynamic registry (`SectionRenderer.jsx`) configured via `app/config/home-sections.config.ts`.
  - Optimistic Cart Drawer with Free Shipping progress bar and in-cart upsells.
  - PDP CRO suite: responsive zoom gallery, instant variant swatches, URL parameter synchronization, scroll-triggered sticky add-to-cart, volume tiered pricing widget.
  - PLP collection browsing with faceted filter drawer, sorting, and cursor pagination.
  - Customer Account API v2 with OAuth 2.0 PKCE (`/account/login`, `/account/authorize`, `/account`).
  - Technical SEO: 301 catch-all redirects engine (`app/routes/$.jsx`), dynamic `/sitemap.xml`, `/robots.txt` with staging shielding, automated JSON-LD schemas (Product, BreadcrumbList, Organization, FAQPage), and canonical URL cleanup.
  - Cross-domain checkout linker (`checkout.js`) appending Google Analytics (`_ga`, `_gl`), Meta Pixel (`_fbp`, `_fbc`), and Shopify session cookies to checkout handoff.
  - Development navigation & showcase tooling: `/dev` and `<DevNavSheet />` mapped in `PAGES-MAP.md`.
- Authority: Repository disk wins. Refer to `AGENTS.md`, `PRD.md`, `TASKS.md`, `STATUS.md`, `BUILD-LOG.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `RELEASE.md`.
