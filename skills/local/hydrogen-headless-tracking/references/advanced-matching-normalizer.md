# Advanced Matching & Identity Normalization Engine (EMQ 8.5+)

> **Historical blueprint, not a canonical provider contract.** Never infer a
> country code or submit identity data without an accepted legal/consent basis.
> Retrieve the current provider normalization specification and follow
> [Tracking delivery contract](delivery-contract.md) before implementation.

> Event Match Quality (EMQ) in Meta Ads directly influences how efficiently Meta matches browser/server events with real user accounts. Without proper normalization, EMQ drops below 4.0, starving the ad algorithm of conversion data.

---

## 1. Normalization & Hashing Rules

| Parameter | Meta Key | Normalization Rule | Example Input | Output to Meta |
| :--- | :--- | :--- | :--- | :--- |
| **Email** | `em` | Trim leading/trailing whitespace, lowercase, SHA-256 | `  Budi@Gmail.COM ` | `sha256("budi@gmail.com")` |
| **Phone** | `ph` | Strip non-digits (`+`, `-`, spaces). Convert leading `0` to country code (`62`). SHA-256 | `+62 812-3456-7890` or `081234567890` | `sha256("6281234567890")` |
| **First Name** | `fn` | Trim, lowercase, strip punctuation, SHA-256 | `Budi ` | `sha256("budi")` |
| **Last Name** | `ln` | Trim, lowercase, strip punctuation, SHA-256 | `Santoso` | `sha256("santoso")` |
| **City** | `ct` | Trim, lowercase, remove punctuation/spaces, SHA-256 | `Jakarta Selatan` | `sha256("jakartaselatan")` |
| **State / Province** | `st` | 2-letter code or lowercase name, SHA-256 | `DKI Jakarta` | `sha256("dkijakarta")` |
| **Zip / Postal** | `zp` | Trim, lowercase, remove spaces, SHA-256 | `12340 ` | `sha256("12340")` |
| **Country** | `country` | 2-letter lowercase ISO country code, SHA-256 | `ID` or `Indonesia` | `sha256("id")` |
| **Browser Cookie** | `fbp` | Raw string (DO NOT HASH) | `fb.1.1719882900.1234567890` | `fb.1.1719882900.1234567890` |
| **Click ID Cookie** | `fbc` | Raw string (DO NOT HASH) | `fb.1.1719882900.IwAR...` | `fb.1.1719882900.IwAR...` |
| **IP Address** | `client_ip_address` | Raw IPv4/IPv6 from request header (DO NOT HASH) | `180.252.12.34` | `180.252.12.34` |
| **User Agent** | `client_user_agent` | Raw string from request header (DO NOT HASH) | `Mozilla/5.0 ...` | `Mozilla/5.0 ...` |

---

## 2. Normalization Implementation (`app/lib/normalizer.server.ts`)

```typescript
// app/lib/normalizer.server.ts
import {createHash} from 'node:crypto';

export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

/**
 * Normalizes email according to Meta Ads spec
 */
export function normalizeEmail(email?: string | null): string | null {
  if (!email) return null;
  const cleaned = email.trim().toLowerCase();
  return cleaned ? sha256(cleaned) : null;
}

/**
 * Normalizes phone number to E.164 digits without '+'
 * Handles Indonesian local format (08xx -> 628xx) and international formats
 */
export function normalizePhone(phone?: string | null, defaultCountryCode = '62'): string | null {
  if (!phone) return null;
  
  // 1. Strip all non-digit characters
  let digits = phone.replace(/\D/g, '');
  if (!digits) return null;

  // 2. Replace leading zero with default country code
  if (digits.startsWith('0')) {
    digits = defaultCountryCode + digits.slice(1);
  }

  // 3. Hash the resulting digits string
  return sha256(digits);
}

/**
 * Normalizes text fields (names, cities, postal codes)
 */
export function normalizeText(text?: string | null, stripSpaces = false): string | null {
  if (!text) return null;
  let cleaned = text.trim().toLowerCase();
  if (stripSpaces) {
    cleaned = cleaned.replace(/\s+/g, '');
  }
  return cleaned ? sha256(cleaned) : null;
}

export interface RawCustomerData {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  province?: string | null;
  zip?: string | null;
  countryCode?: string | null;
  externalId?: string | null;
  fbp?: string | null;
  fbc?: string | null;
}

/**
 * Builds a Meta-compliant user_data object for Conversions API
 */
export function buildMetaUserData(
  customer: RawCustomerData,
  clientIp?: string | null,
  clientUserAgent?: string | null,
) {
  const userData: Record<string, any> = {};

  if (customer.email) userData.em = [normalizeEmail(customer.email)];
  if (customer.phone) userData.ph = [normalizePhone(customer.phone)];
  if (customer.firstName) userData.fn = [normalizeText(customer.firstName)];
  if (customer.lastName) userData.ln = [normalizeText(customer.lastName)];
  if (customer.city) userData.ct = [normalizeText(customer.city, true)];
  if (customer.province) userData.st = [normalizeText(customer.province, true)];
  if (customer.zip) userData.zp = [normalizeText(customer.zip, true)];
  if (customer.countryCode) userData.country = [normalizeText(customer.countryCode.toLowerCase())];
  if (customer.externalId) userData.external_id = [sha256(customer.externalId.trim())];

  // Raw attribution cookies and browser telemetry
  if (customer.fbp) userData.fbp = customer.fbp;
  if (customer.fbc) userData.fbc = customer.fbc;
  if (clientIp) userData.client_ip_address = clientIp;
  if (clientUserAgent) userData.client_user_agent = clientUserAgent;

  return userData;
}
```
