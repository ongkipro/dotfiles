# Advertising Taxonomy, Feed Optimization & System Audit Protocol

> Master reference and system audit protocol for multi-platform e-commerce advertising taxonomies (Google, Meta, TikTok), feed optimization, and conversion signal integrity.

---

## 1. Multi-Platform Product Taxonomy Matrix

| Attribute Name | Target Platform | Type & Value Standard | Purpose & Impact |
| :--- | :--- | :--- | :--- |
| `google_product_category` | Google Merchant Center, PMax | Numeric ID (e.g. `5598`) or full path string (`Apparel & Accessories > Clothing > Outerwear`). | Matches Google Search intent, powers PMax asset groups, prevents policy disapproval. |
| `fb_product_category` | Meta Commerce Catalog, Advantage+ Ads | Meta Taxonomy String or ID (`Apparel & Accessories > Shoes > Athletic Shoes`). | Drives Meta Advantage+ catalog recommendations on IG Reels & Facebook Feed. |
| `tiktok_category_id` | TikTok Shop, In-Feed Shopping Ads | TikTok Category ID string. | Enables TikTok Shop indexing, Live Stream product tagging, and Affiliate ads. |
| `product_type` | Google & Meta Ads | Custom store category path (e.g. `Pria > Outerwear > Jaket Waterproof`). | Custom campaign segmentation and listing group organization in ad manager. |
| `custom_label_0` | PMax & Meta Ads | `High-Margin` (Margin > 50%), `Low-Margin` (Margin < 20%). | Allows high-ROAS bidding strategy on high-profit items. |
| `custom_label_1` | PMax & Meta Ads | `Hero-BestSeller`, `Slow-Mover`, `Dead-Stock`. | Allocates ad spend to top-performing product velocity groups. |
| `custom_label_2` | PMax & Meta Ads | `Under-100k`, `100k-500k`, `High-Ticket-1M+`. | Price-tier dynamic bidding and budget allocation. |
| `custom_label_3` | PMax & Meta Ads | `Evergreen`, `Promo-Gajian`, `Flash-Sale`. | Seasonal campaign control and promotional asset switching. |
| `custom_label_4` | PMax & Meta Ads | `In-Stock-High`, `Low-Stock-Alert`. | Automatically pauses ads when inventory drops below threshold. |
| `gtin` / `barcode` | Google Shopping, Meta, TikTok | Global Trade Item Number (EAN-13, UPC, ISBN). | **+20%–40% impressions** via global catalog price & star-rating matching. |

---

## 2. Schema.org Rich Snippet & AI Search Data Layer (JSON-LD)

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "OutdoorPro Jaket Waterproof Premium",
  "image": ["https://example.com/cdn/jaket-1.jpg"],
  "description": "Jaket outdoor pria tahan air dan angin.",
  "sku": "SKU-9912",
  "gtin13": "8991234567890",
  "brand": { "@type": "Brand", "name": "OutdoorPro" },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/products/jaket-waterproof",
    "priceCurrency": "IDR",
    "price": "350000",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "IDR" }
    },
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": "ID",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 30
    }
  }
}
```

---

## 3. 12-Point System Audit Checklist for E-Commerce & Ad Integrations

Before launching any e-commerce storefront, landing page, or ad tracking integration, perform this mandatory 12-point audit:

- [ ] **1. Taxonomy Completeness**: Every product SKU has explicit `google_product_category` (Numeric ID or full path) mapped to the deepest subcategory.
- [ ] **2. Custom Labels Configured**: Data feed contains `custom_label_0` (Margin) and `custom_label_1` (Velocity).
- [ ] **3. GTIN / EAN Barcodes**: Valid 13-digit EAN/GTIN populated for standard brand products.
- [ ] **4. Title Formula Applied**: Product titles follow `[Brand] + [Target/Gender] + [Product Type] + [Key Attributes] + [Color/Size]`.
- [ ] **5. Dual-Signal CAPI Active**: Meta CAPI (Graph API v22.0) and TikTok Events API v2 running alongside browser pixels.
- [ ] **6. `event_id` Match Verification**: Browser `event_id` and server `event_id` strings are 100% identical.
- [ ] **7. Click ID Preservation**: `gclid`, `gbraid`, `wbraid`, `_fbp`, `_fbc`, `ttclid` persisted in HTTP cookies & Order DB rows.
- [ ] **8. Customer Matching Hashing**: Emails trimmed & lowercased before SHA-256; phone numbers formatted to E.164 without `+` before SHA-256.
- [ ] **9. Transactional Outbox Pattern**: Server CAPI calls use a database outbox with exponential backoff retry queues.
- [ ] **10. Server-Authoritative Purchase**: `Purchase` / `CompletePayment` fires ONLY upon payment backend confirmation (PAID/COLLECTED status), never page refresh.
- [ ] **11. Schema.org JSON-LD Valid**: Product page passes Google Rich Results test with `Product`, `Offer`, `MerchantReturnPolicy`, and `OfferShippingDetails`.
- [ ] **12. Page Speed & CWV**: LCP < 1.2s, CLS < 0.1, INP < 200ms across mobile and desktop.
