# Transaction ID & Deduplication Rules

Passing a unique `transaction_id` prevents Google Ads from counting duplicate purchase conversions if a user refreshes the thank-you page or visits from multiple devices.

---

## `transaction_id` Invariant

- Must match your database `order_id` (e.g. `ORD-2026-9901`).
- Must be passed in both Web tags (`gtag.js` / GTM) and Offline CAPI uploads so Google Ads deduplicates web vs offline reports.

```javascript
gtag('event', 'conversion', {
  'send_to': 'AW-123456789/LABEL',
  'value': 299000,
  'currency': 'IDR',
  'transaction_id': 'ORD-2026-9901'
});
```

---

## Count Setting Guidelines

| Conversion Action Type | Recommended Count | Rationale |
| --- | --- | --- |
| **Purchase** | **Every** | Every distinct purchase order generates real business revenue. Deduplication is handled by `transaction_id`. |
| **Lead / Signup** | **One** | Multiple submissions from the same user session do not increase business value. |

---

## Dynamic Value & Currency Rules

1. `value`: Must be numeric (e.g. `299000` or `299000.00`). Never string format with currency symbols (`"Rp 299.000"`).
2. `currency`: Standard 3-letter ISO 4217 code uppercase (e.g. `"IDR"`, `"USD"`, `"MYR"`).
