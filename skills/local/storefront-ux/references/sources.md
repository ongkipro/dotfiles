# Source ledger

Verified from GitHub on 2026-08-07. These repositories are behavior references,
not architectures to copy. Re-check their status and current documentation
before making platform-specific claims.

| Source | Evidence used | Adoption boundary |
|---|---|---|
| https://github.com/Shopify/hydrogen | Official Shopify storefront, cart, account, localization, and typed-data patterns | Shopify-specific; do not prescribe Hydrogen to Astro projects |
| https://github.com/saleor/storefront | PLP, PDP, cart, checkout, and account comparison | Harvest interaction patterns, not its Next.js/GraphQL architecture |
| https://github.com/spree/storefront | Multi-region, guest checkout, payment-session, and account comparison | Young repository; verify maturity per feature |
| https://github.com/vercel/commerce | Server-first composition and provider-boundary comparison | Vercel/provider assumptions may not fit Cloudflare or Shopify |
| https://github.com/Shopify/polaris-react | Legacy admin design-system evidence | Deprecated for new work; not a storefront dependency |

Project code, installed packages, backend capabilities, analytics contracts,
markets, and design tokens remain the source of truth.
