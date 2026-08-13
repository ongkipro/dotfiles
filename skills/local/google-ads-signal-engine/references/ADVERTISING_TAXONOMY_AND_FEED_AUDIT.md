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

## 2. UMKM Automated GTIN & Identifier Strategy (No Disapproval Guarantee)

For UMKM/early-stage brands without official GS1 registered barcodes, **NEVER fabricate random 13-digit numbers** (Google Merchant Center will flag `invalid_gtin` and suspend the item). Use the automated fallback contract below:

```ts
// Automated Feed Identifier Resolver for UMKM / Custom Brands
export interface ProductIdentifierPayload {
  identifier_exists: 'yes' | 'no';
  gtin?: string;
  brand: string;
  mpn: string;
}

export function resolveProductIdentifiers(product: {
  sku: string;
  brandName?: string;
  officialGtin?: string;
}): ProductIdentifierPayload {
  // 1. Valid GS1 GTIN exists (e.g. 13-digit EAN-13 starting with 899 for ID)
  if (product.officialGtin && /^\d{13}$/.test(product.officialGtin)) {
    return {
      identifier_exists: 'yes',
      gtin: product.officialGtin,
      brand: product.brandName || 'Brand',
      mpn: product.sku
    };
  }

  // 2. Automated Fallback for UMKM / Handmade / Custom Products (Safe & Approved)
  return {
    identifier_exists: 'no',
    brand: product.brandName || 'UMKM Brand',
    mpn: product.sku || `SKU-${Date.now()}`
  };
}
```

### Internal Barcode Generation (EAN-13 Prefix 200–299 for Local POS Scanners)
For internal store management and POS barcode printing, UMKMs can auto-generate internal EAN-13 numbers starting with prefix `200` to `299` (Restricted Distribution Prefix):

```ts
// Auto-generate internal EAN-13 with valid Luhn checksum (for POS & Print)
export function generateInternalEAN13(productId: number): string {
  const prefix = '200'; // RDN Internal Prefix
  const payload = prefix + String(productId).padStart(9, '0'); // 12 digits
  
  // Calculate Luhn checksum for 13th digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(payload[i], 10);
    sum += (i % 2 === 0) ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return payload + checkDigit;
}
```

---

## 3. Schema.org Rich Snippet & AI Search Data Layer (JSON-LD)

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

## 4. 12-Point System Audit Checklist for E-Commerce & Ad Integrations

Before launching any e-commerce storefront, landing page, or ad tracking integration, perform this mandatory 12-point audit:

- [ ] **1. Taxonomy Completeness**: Every product SKU has explicit `google_product_category` (Numeric ID or full path) mapped to the deepest subcategory.
- [ ] **2. Custom Labels Configured**: Data feed contains `custom_label_0` (Margin) and `custom_label_1` (Velocity).
- [ ] **3. GTIN / UMKM Fallback**: Valid 13-digit EAN/GTIN populated OR automated `identifier_exists: "no"` contract active.
- [ ] **4. Title Formula Applied**: Product titles follow `[Brand] + [Target/Gender] + [Product Type] + [Key Attributes] + [Color/Size]`.
- [ ] **5. Dual-Signal CAPI Active**: Meta CAPI and TikTok Events API running alongside browser pixels, each pinned to a version verified against its changelog.
- [ ] **6. `event_id` Match Verification**: Browser `event_id` and server `event_id` strings are 100% identical.
- [ ] **7. Click ID Preservation**: `gclid`, `gbraid`, `wbraid`, `_fbp`, `_fbc`, `ttclid` persisted in HTTP cookies & Order DB rows.
- [ ] **8. Customer Matching Hashing**: Emails trimmed & lowercased before SHA-256; phone numbers formatted to E.164 without `+` before SHA-256.
- [ ] **9. Transactional Outbox Pattern**: Server CAPI calls use a database outbox with exponential backoff retry queues.
- [ ] **10. Server-Authoritative Purchase**: `Purchase` / `CompletePayment` fires ONLY upon payment backend confirmation (PAID/COLLECTED status), never page refresh.
- [ ] **11. Schema.org JSON-LD Valid**: Product page passes Google Rich Results test with `Product`, `Offer`, `MerchantReturnPolicy`, and `OfferShippingDetails`.
- [ ] **12. Page Speed & CWV**: LCP < 1.2s, CLS < 0.1, INP < 200ms across mobile and desktop.
