# Identity Normalization & Advanced Matching Rules

Customer identity matching associates website conversions with Meta user accounts. High Event Match Quality (EMQ) relies on accurate normalization before SHA-256 hashing.

---

## What to Hash vs RAW Context

```text
RAW / UNHASHED FIELDS (DO NOT HASH):
- _fbp (Meta Browser Cookie)
- _fbc (Meta Click Cookie)
- client_ip_address (User IP)
- client_user_agent (User Agent String)

MUST BE NORMALIZED & SHA-256 HASHED:
- em (Email Address)
- ph (Phone Number)
- fn (First Name)
- ln (Last Name)
- ct (City)
- st (State / Region)
- zp (Zip / Postal Code)
- country (Country Code, e.g. "id", "us")
- external_id (First-Party Customer ID)
```

---

## Normalization Implementation (TypeScript)

```typescript
import { createHash } from 'crypto';

export function sha256Hex(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

/**
 * Normalizes email according to Meta standards:
 * - Strip leading/trailing whitespace
 * - Convert to lowercase
 */
export function normalizeEmail(email: string): string {
  const cleaned = email.trim().toLowerCase();
  return sha256Hex(cleaned);
}

/**
 * Normalizes phone number to E.164 numeric representation:
 * - Strip non-digit characters
 * - Replace leading '0' with country code (default Indonesia '62')
 */
export function normalizePhone(phone: string, defaultCountryPrefix = '62'): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = defaultCountryPrefix + cleaned.substring(1);
  }
  return sha256Hex(cleaned);
}

/**
 * Normalizes name/city:
 * - Lowercase, strip punctuation, remove spaces
 */
export function normalizeText(text: string): string {
  const cleaned = text.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return sha256Hex(cleaned);
}
```

---

## `_fbp` and `_fbc` Cookie Rules

- `_fbp`: Format `fb.1.${timestamp}.${randomNumber}`. Read directly from document cookies.
- `_fbc`: Created when traffic lands with `?fbclid=...`. Format `fb.1.${timestamp}.${fbclid}`.
- **Cookie Lifetime**: Ensure first-party cookie expiration is set to 90 days.
- **Pass-through**: Store `_fbp` and `_fbc` in session storage or checkout form state so backend CAPI sends exact matching cookies.
