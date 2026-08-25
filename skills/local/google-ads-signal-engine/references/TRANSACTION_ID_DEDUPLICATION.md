# Transaction ID & Deduplication Rules

Passing a unique `transaction_id` prevents Google Ads from counting duplicate purchase conversions if a user refreshes the thank-you page or visits from multiple devices.

---

## `transaction_id` Invariant

- Must be a stable canonical backend order identifier (for example, a persisted
  order number), not a browser UUID, numeric row ID, or payment-attempt ID.
- Must be non-empty whenever a Purchase event exists. Omit it for event types
  with no transaction rather than sending `""`.
- Must agree across every path deliberately reporting the same conversion. A
  direct Google tag and GTM must not both fire one Google Ads conversion action;
  `transaction_id` is deduplication support, not permission to duplicate.

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
