# Source ledger

Verified from GitHub on 2026-08-10. These repositories are behavior references,
not architectures to copy. Re-check their status and current documentation
before making platform-specific claims.

| Source | Evidence used | Adoption boundary |
|---|---|---|
| https://github.com/Shopify/dawn | HTML-first progressive enhancement, product forms, cart drawer/page, focus and live-region patterns | Reference patterns, not a stable component API or mandatory visual style |
| https://github.com/Shopify/hydrogen | Official Shopify storefront, cart, account, localization, and typed-data patterns | Shopify-specific; do not prescribe Hydrogen to Astro projects. Moved from Remix v2 to React Router v7 — older Hydrogen examples online assume the Remix API |
| https://github.com/saleor/storefront | PLP, PDP, cart, checkout, and account comparison | Harvest interaction patterns, not its Next.js/GraphQL architecture |
| https://github.com/spree/storefront | Multi-region, guest checkout, payment-session, and account comparison | Genuinely small (~50 stars); verify maturity per feature rather than re-litigating the repo |
| https://github.com/vercel/commerce | Server-first composition and provider-boundary comparison | Active, MIT. Vercel maintains **only** the Shopify version — the BigCommerce/Medusa/Saleor/Swell provider forks are unmaintained. Vercel/provider assumptions may not fit Cloudflare |
| https://github.com/Shopify/polaris-react-archive | Legacy admin design-system evidence | Archived Oct 2025 in favour of framework-agnostic Polaris web components; no new contributions. Not a storefront dependency. The old `Shopify/polaris-react` and `Shopify/polaris` URLs both redirect here |

Project code, installed packages, backend capabilities, analytics contracts,
markets, and design tokens remain the source of truth.

For current platform limits and APIs, prefer Shopify's official theme
architecture, accessibility/performance guidance, Ajax Cart API, Storefront Cart
guide, and Checkout UI Extension target documentation over repository examples.
