# CAPI Graph API v22.0 Sender & Outbox Pattern

Meta Conversions API (CAPI) allows server-side transmission of conversion events directly to Meta's servers (`https://graph.facebook.com/v22.0/{pixel_id}/events`).

---

## TypeScript CAPI Sender Implementation

```typescript
import { createHash } from 'crypto';

interface CapiEventPayload {
  event_name: string;
  event_time: number; // Unix timestamp in seconds
  event_id: string;
  event_source_url?: string;
  action_source: 'website' | 'system_generated' | 'app' | 'physical_store';
  user_data: {
    em?: string[]; // SHA-256 hashed
    ph?: string[]; // SHA-256 hashed
    fn?: string[]; // SHA-256 hashed
    ln?: string[]; // SHA-256 hashed
    external_id?: string[]; // SHA-256 hashed
    fbp?: string; // RAW
    fbc?: string; // RAW
    client_ip_address?: string; // RAW
    client_user_agent?: string; // RAW
  };
  custom_data?: {
    currency?: string;
    value?: number;
    content_ids?: string[];
    contents?: Array<{ id: string; quantity: number }>;
    content_type?: 'product' | 'product_group';
    order_id?: string;
  };
}

interface SendCapiParams {
  pixelId: string;
  accessToken: string;
  testEventCode?: string;
  events: CapiEventPayload[];
}

export async function sendCapiEvents({
  pixelId,
  accessToken,
  testEventCode,
  events
}: SendCapiParams): Promise<{ success: boolean; data?: any; error?: any }> {
  const url = `https://graph.facebook.com/v22.0/${pixelId}/events?access_token=${accessToken}`;

  const body = {
    data: events,
    ...(testEventCode ? { test_event_code: testEventCode } : {})
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const result = await res.json();
    if (!res.ok) {
      console.error('[META-CAPI-ERROR]', result);
      return { success: false, error: result };
    }
    return { success: true, data: result };
  } catch (err) {
    console.error('[META-CAPI-NETWORK-ERROR]', err);
    return { success: false, error: err };
  }
}
```

---

## Transactional Event Outbox Schema (PostgreSQL)

To guarantee zero event loss during network glitches or Meta API rate limits (HTTP 429), use an Outbox queue:

```sql
CREATE TABLE capi_event_outbox (
    id BIGSERIAL PRIMARY KEY,
    event_id VARCHAR(128) NOT NULL UNIQUE,
    event_name VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, failed
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 5,
    last_error TEXT,
    next_retry_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_capi_outbox_pending ON capi_event_outbox (status, next_retry_at) WHERE status = 'pending';
```

---

## Outbox Retry Worker (TypeScript)

```typescript
export async function processOutboxQueue(db: any, pixelId: string, accessToken: string) {
  // Pick up to 50 pending events due for retry
  const pendingEvents = await db.query(
    `SELECT * FROM capi_event_outbox 
     WHERE status = 'pending' AND next_retry_at <= NOW() AND attempts < max_attempts 
     ORDER BY id ASC LIMIT 50`
  );

  if (!pendingEvents.rows.length) return;

  for (const row of pendingEvents.rows) {
    const res = await sendCapiEvents({ pixelId, accessToken, events: [row.payload] });

    if (res.success) {
      await db.query(`UPDATE capi_event_outbox SET status = 'sent', updated_at = NOW() WHERE id = $1`, [row.id]);
    } else {
      const isRateLimit = res.error?.error?.code === 4 || res.error?.error?.code === 17;
      const isInvalidToken = res.error?.error?.code === 190;
      
      // Exponential backoff: 2^attempts * 60 seconds (1m, 2m, 4m, 8m, 16m)
      const backoffMinutes = Math.pow(2, row.attempts + 1);
      const nextRetry = isRateLimit ? 'NOW() + INTERVAL '\''15 minutes'\''' : `NOW() + INTERVAL '${backoffMinutes} minutes'`;
      
      const finalStatus = (row.attempts + 1 >= row.max_attempts || isInvalidToken) ? 'failed' : 'pending';

      await db.query(
        `UPDATE capi_event_outbox 
         SET attempts = attempts + 1, status = $1, last_error = $2, next_retry_at = ${nextRetry}, updated_at = NOW() 
         WHERE id = $3`,
        [finalStatus, JSON.stringify(res.error), row.id]
      );
    }
  }
}
```

---

## CAPI Integration Strategy: Direct CAPI vs CAPI Gateway

| Dimension | Direct CAPI (Recommended) | CAPI Gateway (AWS/Cloudflare) |
| --- | --- | --- |
| **Control** | Full control over payloads, outbox retries, and COD event triggers | Zero-code, automatic proxying from browser pixel |
| **Custom Funnels** | Perfect for custom landing pages, Astro/Next.js, Scalev, D1 | Limited to standard web pixel traffic |
| **COD Confirmation** | Allows firing Purchase ONLY after backend admin confirmation | Fires on browser thank-you page load (High COD risk) |
| **Maintenance** | Handled in codebase via TypeScript SDK / Outbox Worker | Requires managing AWS/Cloudflare container instance |
