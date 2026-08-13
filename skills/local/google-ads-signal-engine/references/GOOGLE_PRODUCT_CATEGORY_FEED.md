# Google Product Category (GPC) & Merchant Center Feed Optimization

> Operational reference for Google Product Category (`google_product_category`), Performance Max (PMax) AI targeting, and product feed contracts.

---

## 1. Google Product Category (GPC) vs Product Type

| Attribute | `google_product_category` | `product_type` |
| :--- | :--- | :--- |
| **Definition** | Google's official, standardized taxonomy (e.g. `Apparel & Accessories > Clothing > Outerwear > Coats & Jackets` or ID `5598`). | Merchant's custom internal store category hierarchy (e.g. `Men > Jackets > Winter Sale`). |
| **Flexibility** | Rigid, predefined by Google. Must match Google Product Taxonomy exact strings or Numeric IDs. | Fully flexible, defined by store architecture. |
| **PMax AI Impact** | Primary signal for Google AI query matching, audience targeting, policy verification, and bidding. | Used for internal campaign segmentation and asset group organization. |

---

## 2. Performance Max (PMax) AI Optimization Rules

1. **Explicit Override over Auto-Categorization**:
   Google auto-assigns GPC using machine learning if missing, but misclassification reduces ad impressions or triggers policy flags. Always explicitly supply `google_product_category` in the feed.
2. **Deepest Subcategory Precision**:
   Always select the most specific leaf node in the taxonomy.
   - ❌ Bad: `Apparel & Accessories` (ID `1604`)
   - ✅ Good: `Apparel & Accessories > Clothing > Shirts & Tops` (ID `212`)
3. **Data Consistency**:
   Ensure `google_product_category` aligns with `age_group`, `gender`, `color`, and `size`. Conflicting attributes (e.g. GPC `Baby Clothing` with `age_group: adult`) degrade PMax auction score.

---

## 3. Product Feed Payload Contract (JSON / XML)

```json
{
  "id": "SKU-9912",
  "title": "Jaket Outdoor Waterproof Breathable - Black L",
  "description": "Jaket outdoor pria tahan air dan angin cocok untuk hiking dan mendaki gunung.",
  "link": "https://example.com/products/jaket-outdoor-waterproof",
  "image_link": "https://example.com/cdn/images/jaket-outdoor-1.jpg",
  "availability": "in_stock",
  "price": "350000 IDR",
  "google_product_category": 5598,
  "product_type": "Pria > Jaket & Outerwear > Waterproof",
  "brand": "OutdoorPro",
  "condition": "new",
  "gender": "male",
  "age_group": "adult",
  "identifier_exists": "yes",
  "gtin": "8991234567890"
}
```
