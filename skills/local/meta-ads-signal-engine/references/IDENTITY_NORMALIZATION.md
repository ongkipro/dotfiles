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

> **On Cloudflare Workers, Deno, or the browser, use WebCrypto — `node:crypto` needs the `nodejs_compat` flag and is the wrong default on an edge runtime.** Same normalization, async hash:
>
> ```typescript
> export async function sha256Hex(value: string): Promise<string> {
>   const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
>   return Array.from(new Uint8Array(digest))
>     .map((b) => b.toString(16).padStart(2, '0'))
>     .join('');
> }
> ```
>
> Hash the **same normalized source value on both legs**. A browser and server
> that hash different source values describe different people even when both
> hashes look valid. This is especially dangerous for phone normalization and
> `external_id`; they are separate identifiers and must not silently collapse
> into one permanent phone-derived hash.

```typescript
import { createHash } from 'crypto'; // Node runtimes only

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

## First-party browser identity

`_fbp` and `_fbc` are Meta-issued/browser attribution identifiers. Preserve them
raw, do not put them in URLs or logs, and read the latest same-origin cookie at
the server boundary whenever possible.

- `_fbp`: Meta's browser ID. The Pixel mints it.
- `_fbc`: Meta's click ID. Capture a valid `fbclid` landing as
  `fb.<subdomain_index>.<creation_time>.<fbclid>` before the Pixel loads.
- Both: retain only for a deliberate first-party lifetime, then refresh from the
  current browser state; never hash them.

`external_id` is different: it belongs to the advertiser. Prefer an immutable
customer ID. If the flow has no account, mint a random first-party visitor ID
with Web Crypto, validate it server-side, retain it for a deliberate lifetime,
and SHA-256 hash it on both Pixel and CAPI. Never accept it from a URL, use an
order number, or send it raw to Meta. A phone-derived fallback may preserve an
upgrade path, but must be replaced by the durable advertiser identity.

## Email and absent fields

Hash a real email only after trim and lowercase. Never reuse a synthetic payment
provider email as customer identity. Omit an unavailable field entirely: an
empty-string hash, fabricated identity, or broad low-signal field set is worse
than no match key.

---

## Event Match Quality evidence

EMQ is an Events Manager score from 1 to 10, not a threshold table that code can
guarantee. Do not promise an EMQ range, conversion uplift, CPA improvement, or
ROAS outcome from parameter coverage alone.

Measure separately:

1. browser emission and server ingress;
2. CAPI acceptance and event freshness;
3. browser/server deduplication key coverage and overlap;
4. EMQ per event in Events Manager;
5. business impact through a reconciliation, lift study, or approved experiment.

Local tests and browser smoke can prove payload construction and identity parity.
They cannot prove Meta acceptance, matching, attribution, or campaign impact.
