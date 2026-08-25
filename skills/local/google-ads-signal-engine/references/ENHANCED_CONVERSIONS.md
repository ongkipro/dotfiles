# Enhanced Conversions & Google Ads API Offline Uploads

Enhanced Conversions matches website conversion events with Google logged-in accounts using hashed first-party user data (`email`, `phone_number`, `address`).

Before sending any user data, the advertiser MUST enable the selected enhanced
conversion method in Google Ads, accept the applicable customer-data terms, and
ensure the applicable consent state permits it. A browser payload that is
correctly normalized can still be ignored when the account-side method or terms
are not configured.

> **Current account-side change:** Google Ads combined Enhanced Conversions for
> Web and Leads into one setting from April 2026. Verify the current account UI
> and selected data source before implementing; a browser implementation and an
> API implementation chosen in incompatible account settings can be ignored.

---

## 1. Web Implementation (`gtag.js`)

In web browser implementations, send either raw values for Google to normalize
and hash or pre-hashed SHA-256 values in the documented field names; never mix a
raw value with its `sha256_*` key. Use real first-party data only and omit fields
that are unavailable or synthetic.

```javascript
// Set user_data before or alongside conversion event
gtag('set', 'user_data', {
  "email": "customer@example.com",
  "phone_number": "+6281234567890",
  "address": {
    "first_name": "John",
    "last_name": "Doe",
    "postal_code": "12340",
    "country": "ID"
  }
});

// Fire Conversion Event
gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXXXX/CONVERSION_LABEL',
  'value': 549000,
  'currency': 'IDR',
  'transaction_id': 'ORD-2026-00018472'
});
```

---

## 2. Server-to-Server Google Ads API Offline Upload

For offline sales, delayed COD confirmations, or CRM lead qualifications, upload conversions directly via the Google Ads API.

```typescript
import { createHash } from 'crypto';

function sha256(val: string): string {
  return createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
}

interface OfflineConversionInput {
  conversionActionResourceName: string; // "customers/1234567890/conversionActions/987654321"
  conversionDateTime: string; // "YYYY-MM-DD HH:MM:SS+TIMEZONE"
  conversionValue: number;
  currencyCode: string;
  orderId: string; // transaction_id
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  rawEmail?: string;
  rawPhone?: string;
}

export function buildGoogleAdsApiPayload(input: OfflineConversionInput) {
  const userIdentifiers: Array<{ hashed_email?: string; hashed_phone_number?: string }> = [];

  if (input.rawEmail) {
    userIdentifiers.push({ hashed_email: sha256(input.rawEmail) });
  }

  if (input.rawPhone) {
    let phoneDigits = input.rawPhone.replace(/[^0-9]/g, '');
    if (phoneDigits.startsWith('0')) phoneDigits = '62' + phoneDigits.substring(1);
    userIdentifiers.push({ hashed_phone_number: sha256('+' + phoneDigits) });
  }

  return {
    conversion_action: input.conversionActionResourceName,
    conversion_date_time: input.conversionDateTime,
    conversion_value: input.conversionValue,
    currency_code: input.currencyCode,
    order_id: input.orderId,
    ...(input.gclid && { gclid: input.gclid }),
    ...(input.gbraid && { gbraid: input.gbraid }),
    ...(input.wbraid && { wbraid: input.wbraid }),
    user_identifiers: userIdentifiers
  };
}
```
