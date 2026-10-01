# Enhanced Conversions & Google Ads API Offline Uploads

Enhanced Conversions matches website conversion events with Google logged-in accounts using hashed first-party user data (`email`, `phone_number`, `address`).

Before sending any user data, the advertiser MUST enable the selected enhanced
conversion method in Google Ads, accept the applicable customer-data terms, and
ensure the applicable consent state permits it. A browser payload that is
correctly normalized can still be ignored when the account-side method or terms
are not configured.

> **Current account-side change (verified 2026-10-02):** from April 2026 Google
> Ads accepts user-provided data from website tags, Data Manager, and API
> connections simultaneously; from June 2026 enhanced conversions for web and
> leads are one on/off setting
> ([Google Ads Help](https://support.google.com/google-ads/answer/16884284)).
> Verify the current account UI and selected data sources before implementing.

---

## 1. Web Implementation (`gtag.js`)

In web browser implementations, send either raw values for Google to normalize
and hash or pre-hashed SHA-256 values in the documented field names; never mix a
raw value with its `sha256_*` key.

If you hash yourself, follow Google's normalization exactly
([enhanced conversions guide](https://developers.google.com/google-ads/api/docs/conversions/enhanced-conversions/web), accessed 2026-10-02):

- Email: trim, lowercase; for `gmail.com` / `googlemail.com` only, also remove
  every `.` and any `+suffix` from the local part
  (`Jane.Doe+Shopping@googlemail.com` → `janedoe@googlemail.com`).
- Phone: `+E.164` — digits with a leading `+`, matching `^\+[1-9]\d{6,14}$`
  (`0812-3456-7890` in Indonesia → `+6281234567890`). This differs from Meta's
  `ph`, which drops the `+`. Use real first-party data only and omit fields
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

## 2. Server-to-Server Offline Upload

For offline sales, delayed COD confirmations, or CRM lead qualifications, upload
conversions server-side.

> **Path changed (verified 2026-10-02):** since June 15, 2026,
> `UploadClickConversions` fails for developer tokens that had not previously
> uploaded offline conversions or enhanced conversions for leads; Google directs
> new work to the **Data Manager API** (`POST
> https://datamanager.googleapis.com/v1/events:ingest`)
> ([upload-clicks guide](https://developers.google.com/google-ads/api/docs/conversions/upload-clicks),
> [REST reference](https://developers.google.com/data-manager/api/reference/rest)).
> The builder below is the **legacy Google Ads API** `ClickConversion` shape, kept
> for grandfathered integrations and migration mapping. For a new integration,
> map the same inputs (transaction ID, timestamp, value, currency, click IDs,
> hashed user data, consent) onto the Data Manager event fields from its current
> reference — do not copy these snake_case names.

Legacy-shape rules from the same guide: `conversion_date_time` must carry a
timezone, formatted `yyyy-mm-dd HH:mm:ss+|-HH:mm`; populate `consent` (Google:
"If not set, it's possible that your conversions won't be attributable"); when
both a `gclid` and a `gbraid` are known, Google recommends sending both; custom
conversion variables are not supported with `gbraid`/`wbraid`.

```typescript
import { createHash } from 'crypto';

function sha256(val: string): string {
  return createHash('sha256').update(val).digest('hex');
}

function normalizeEmail(raw: string): string {
  const [local, domain] = raw.trim().toLowerCase().split('@');
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    return `${local.split('+')[0].replace(/\./g, '')}@${domain}`;
  }
  return `${local}@${domain}`;
}

interface OfflineConversionInput {
  conversionActionResourceName: string; // "customers/1234567890/conversionActions/987654321"
  conversionDateTime: string; // "2026-10-02 19:32:45+07:00" (timezone required)
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
    userIdentifiers.push({ hashed_email: sha256(normalizeEmail(input.rawEmail)) });
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
