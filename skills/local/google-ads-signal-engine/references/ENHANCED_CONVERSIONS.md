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
- Names: trim + lowercase only before `address.sha256_first_name` /
  `sha256_last_name`. Do not reuse Meta's normaliser (it strips spaces and
  punctuation, so "Nur Aisyah" hashes differently).
- Pre-hashed keys exist only for email, phone, first and last name; `city`,
  `region`, `postal_code`, `country` (ISO 3166-1 alpha-2, uppercase) stay plain.
- Minimum for a tag match: email, **or** first + last name + postal code +
  country. Phone counts only next to one of those. Drop absent keys; never
  send `""`.
  ([key table](https://support.google.com/google-ads/answer/13258081), read 2026-11-12)

```javascript
// Set user_data before or alongside conversion event
gtag('set', 'user_data', {
  "email": "customer@example.com",
  "phone_number": "+6281234567890",
  "address": {
    "first_name": "John",          // names go INSIDE address; top-level names are ignored
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

---

## Data Manager facts that change COD design (2026-11-02)

- Auth is OAuth scope `https://www.googleapis.com/auth/datamanager` via a service account added as a user on the Ads account; no developer token. Limit 2,000 events per request (Google's own samples use 10,000 — follow the limits page), 300 requests/min per project; `validateOnly: true` for staging.
- **No retraction.** A repeated event restates the value (e.g. to 0) but the conversion count stays. Legacy `UploadConversionAdjustments` RETRACTION is ≤54 days, unavailable for wbraid, and only affects bidding within 7 days. So for COD, make placement a **secondary** tag action and upload **delivered** as the **primary** `UPLOAD_CLICKS` action (`eventTimestamp = delivered_at` with `+07:00/+08:00/+09:00`); upload ≤90 days after the click, set the click window ≥30 days.
- Google's `datamanager_util` formatter turns `0812-3456-7890` into `+081234567890` (it only prepends `+`). Normalise to `+62…` yourself before calling it.
- Web enhanced conversions (tag) reject phone-only user data (need email, or first+last name+postal+country). The Data Manager leg does **not** have that rule: a hashed phone alone is a valid `userData` identifier (see the next section). Never invent a last name or a placeholder email.
- Shopify's Google & YouTube app sends "Checkout completed" purchases server-to-server to Google Ads via Data Manager, deduplicated with the tag; for COD that is placement time — disable it for COD or the delivered upload double-counts.

## Data Manager `events:ingest` field contract (read 2026-11-12)

Two destination kinds, chosen by the conversion action, with different rules:

| | Multi-source (supplements a website tag action: UI "Website"; the send guide names the API enum `WEBPAGE`, the adjustments page `WEBSITE` — confirm before generating action-creation code) | Offline / EC for leads (`UPLOAD_CLICKS` action) |
| --- | --- | --- |
| `transactionId` | **Required**; must equal the tag's `transaction_id` | Optional; first event wins, later ones are adjustments |
| `eventSource` | Optional; only `WEB` or `APP` | **Required** (`WEB`, `APP`, `IN_STORE`, `PHONE`, `MESSAGE`, `OTHER`) |
| Matched `transactionId` | value + currency **overwritten**; `userData` **supplemented only if the tag captured none**, else ignored; every other field (incl. `gclid`) ignored | Same adjustment rules |
| Use for COD | Mode A Purchase (tag + server recover each other) | Delivered Purchase (server-only, `eventTimestamp = delivered_at`) |

```json
{
  "destinations": [{
    "operatingAccount": { "accountType": "GOOGLE_ADS", "accountId": "1234567890" },
    "loginAccount": { "accountType": "GOOGLE_ADS", "accountId": "<manager, only if used>" },
    "productDestinationId": "<conversion action ID = ctId in the Ads UI URL>"
  }],
  "encoding": "HEX",
  "validateOnly": false,
  "events": [{
    "transactionId": "k7m2-261106001",
    "eventTimestamp": "2026-11-06T14:03:11+07:00",
    "eventSource": "WEB",
    "conversionValue": 135000,
    "currency": "IDR",
    "adIdentifiers": { "gclid": "...", "sessionAttributes": "<base64url>" },
    "userData": { "userIdentifiers": [
      { "phoneNumber": "<sha256 hex of +6281234567890>" },
      { "address": { "givenName": "<sha256>", "familyName": "<sha256>", "regionCode": "ID", "postalCode": "12345" } }
    ]},
    "consent": { "adUserData": "CONSENT_GRANTED", "adPersonalization": "CONSENT_GRANTED" }
  }]
}
```

- **Identifier requirement:** at least one of `adIdentifiers.gclid`, `gbraid`/`wbraid`, `adIdentifiers.landingPageDeviceInfo.ipAddress`, `adIdentifiers.sessionAttributes`, `userData`, or `eventDeviceInfo.ipAddress`. `leadId`/`matchId` are accepted but not yet attributed.
- `userIdentifiers[]`: ≤ 10, each exactly one of `emailAddress`, `phoneNumber`, `address`. `address` needs **all four** of `givenName`, `familyName`, `regionCode`, `postalCode` (names trimmed, lowercased, titles/suffixes like `Mrs.`/`Jr.` removed, then hashed; Google's sources conflict on other punctuation: the `AddressInfo` reference says "no punctuation" but the formatting guide and both send-events examples keep `Smith-Jones` → `smith-jones`, so follow the formatting guide and keep a hyphenated-name test fixture); `city`/`administrativeArea`/`addressLine` are GA-only. Declare hash encoding with request-level `encoding` (`HEX` or `BASE64`).
- Email: lowercase, trim; Gmail/Googlemail only — drop dots and `+suffix` in the local part. Phone: `+` and country code, digits only.
- `consent` enum: `CONSENT_GRANTED`, `CONSENT_DENIED`, `CONSENT_STATUS_UNSPECIFIED` (request-level default, event-level overrides).
- `eventTimestamp`: RFC 3339; offsets other than `Z` allowed. Never the upload job's run time.
- **Adjustments** must repeat the destination and at least one identifier, or fail with `NO_IDENTIFIERS_PROVIDED`. Value 0 is a valid restatement (refund/RTS); the count does not change.
- **14-day trial:** a newly connected additional data source reports but does not bid for 14 days, and value updates are disabled during it. Plan RTS restatements to be re-sent after the trial.
- Goals: Google deduplicates only **within one action**. Two actions reporting the same sale in one goal double-count.
- Limits: 2,000 events/request, 10 destinations/request; 300 requests/min and 100,000/day per Cloud project. `429 RESOURCE_EXHAUSTED` names the quota in `ErrorInfo.metadata.quota_limit`: back off with jitter for the per-minute limit; pause until midnight Pacific for the daily one. Up to 10 concurrent requests.
- Session attributes: when no click ID survives (iOS, privacy browsers), capture Google's base64url `session_attributes` at landing (`gad_source`, `gad_campaignid`, `session_start_time_usec`, `landing_page_user_agent`, optional full `landing_page_url` and `landing_page_referrer`; Google recommends storing at least 5 KB for it and enlarging the field rather than truncating) and send it as `adIdentifiers.sessionAttributes`. Never send a placeholder or partial landing URL.
- Upload within 24 h where possible.

Sources: [events:ingest](https://developers.google.com/data-manager/api/reference/rest/v1/events/ingest), [Destination](https://developers.google.com/data-manager/api/reference/rest/v1/Destination), [UserData](https://developers.google.com/data-manager/api/reference/rest/v1/UserData), [formatting](https://developers.google.com/data-manager/api/devguides/concepts/formatting), [Consent](https://developers.google.com/data-manager/api/reference/rest/v1/Consent), [multi-source send](https://developers.google.com/data-manager/api/devguides/events/google-ads/online/send-events), [offline send](https://developers.google.com/data-manager/api/devguides/events/google-ads/offline/send-events), [adjustments](https://developers.google.com/data-manager/api/devguides/events/google-ads/conversion-adjustments), [limits](https://developers.google.com/data-manager/api/devguides/limits), [session attributes](https://support.google.com/google-ads/answer/16194756), [multi-source help](https://support.google.com/google-ads/answer/16542291).
