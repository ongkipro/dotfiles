# Reven Leather — Shopify Payments HK & Currency Architecture

## Entity & Payment Setup
- **Company Entity**: Hong Kong (HK) registered business.
- **Payment Gateway**: Shopify Payments (Hong Kong) with Shop Pay enabled.
- **Dynamic Pricing**: Shopify Payments + Shopify Markets dynamically displays and charges local currencies per visitor's country (USD, EUR, GBP, AUD, SGD, etc.).

## Base Currency Decision: USD over HKD
- **Store Default (Base) Currency**: **USD ($)**.
- **Rationale**:
  1. **Master Catalog Pricing Integrity**: Setting base prices in USD (e.g. $29, $49, $89, $149) avoids decimal creep/odd price points for the dominant global/US customer base.
  2. **Shopify Markets Conversion Direction**: Dynamic pricing calculates other currencies from USD using clean rounding rules (e.g. USD -> GBP, EUR, AUD).
  3. **Payout Efficiency**: Shopify Payments HK supports payouts in both HKD and USD (via HK-domiciled USD accounts such as HSBC HK, Hang Seng, or Airwallex/Wise Business HK). Receiving USD payouts directly eliminates Shopify's 2% currency conversion fee on USD transactions.
  4. **Ad Spend & Accounting Alignment**: Global Meta & Google Ads spend is denominated in USD; anchoring the store in USD ensures 1:1 ROAS tracking without daily HKD/USD currency volatility.

## Product Naming & SEO Invariant
- **Product Title**: Strip the word "Reven" from all product titles (e.g. `Abimana Mini Pouch`, `Adam Clutch Bag`, `Apollo Long Wallet`). The domain already includes "reven" (`revenleather.com`), so repeating the brand name in product titles is redundant.
- **SEO Title & Meta Description**: Keep "Reven Leather" in SEO Meta Titles (e.g. `[Product Title] - [Descriptor] - Reven Leather`) and Meta Descriptions for Google SERP branding.
