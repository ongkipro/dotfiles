# Advanced Storage, Scale Realtime, and Edge Functions

Production patterns for Supabase Storage (resumable TUS uploads, signed upload URLs, image transforms), Realtime at scale (`realtime.broadcast_changes` vs `postgres_changes`), and Edge Functions (`Deno.serve`, `@supabase/server`, background work, webhook HMAC verification).

---

## 1. Storage Production Patterns

### Standard vs Resumable Uploads (TUS Protocol)
- Use standard `supabase.storage.from(bucket).upload(...)` only for files **<= 6 MB**.
- For videos, PDFs, exports, or unstable mobile connections (**> 6 MB**), use **TUS resumable uploads** (`tus-js-client` or Uppy) against `https://<project-ref>.storage.supabase.co/storage/v1/upload/resumable` (6 MB chunk size required by Supabase Storage).

### Delegated Client Uploads via Signed Upload URLs
When the server must validate file quota, naming, or business state before allowing an upload, mint a one-time signed upload token on the server and upload directly from the browser:

```ts
// Server Action / Route Handler (after verifying user & quota):
const { data, error } = await supabase.storage
  .from('invoices')
  .createSignedUploadUrl(`${orgId}/${invoiceId}.pdf`)

// Browser client uploads directly to Storage using the one-time token:
await supabase.storage
  .from('invoices')
  .uploadToSignedUrl(data.path, data.token, file)
```

### Storage RLS Completeness
- `storage.objects` is default-deny.
- **`upsert: true` requires `INSERT` + `SELECT` + `UPDATE` policies** on `storage.objects`. Granting only `INSERT` allows first upload but silently fails when replacing a file.
- For private buckets, never use `getPublicUrl()`; generate short-lived read URLs with `createSignedUrl(path, 300)` (or transform on the fly via `{ transform: { width: 800, quality: 80 } }`).

---

## 2. Realtime at Scale: Broadcast vs `postgres_changes`

### Why `postgres_changes` Bottlenecks
`postgres_changes` processes every WAL change on a single replication thread and evaluates RLS **once per subscribed user**. If 500 users subscribe to a table and 1 row is inserted, Supabase executes 500 permission checks sequentially.

### Decision Matrix
| Pattern | Mechanism | Best For | Scale Ceiling |
|---|---|---|---|
| **Database Broadcast** (`realtime.broadcast_changes`) | DB trigger pushes event to a named private channel; RLS runs once on `realtime.messages` at channel join | Multi-user dashboards, live order boards, chat rooms, notifications | Tens of thousands of concurrent subscribers |
| **Client Broadcast & Presence** | Ephemeral WebSocket pub/sub + CRDT state (`channel.track()`) | Typing indicators, live cursors, online operator rosters | High throughput (no DB write) |
| **`postgres_changes`** | Direct WAL replication subscription | Low-concurrency single-user state or prototypes | Keep below ~500–3,000 concurrent subscribers |

### Database Broadcast Pattern (`private: true` channel + `realtime.messages` RLS)
```sql
-- 1. Authorize channel subscription via RLS on realtime.messages:
create policy "org_members_can_listen_to_org_topic"
  on "realtime"."messages"
  for select
  to authenticated
  using (
    realtime.topic() like 'org:%'
    and split_part(realtime.topic(), ':', 2)::uuid in (select private.user_org_ids())
  );

-- 2. Trigger function broadcasting row changes to topic `org:<org_id>`:
create or replace function public.broadcast_order_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform realtime.broadcast_changes(
    'org:' || coalesce(new.org_id, old.org_id)::text,
    tg_op,
    tg_op,
    tg_table_name,
    tg_table_schema,
    new,
    old
  );
  return null;
end;
$$;

create trigger orders_broadcast_trigger
  after insert or update or delete on public.orders
  for each row execute function public.broadcast_order_changes();
```

Client subscription (must set `{ config: { private: true } }`):
```ts
const channel = supabase
  .channel(`org:${orgId}`, { config: { private: true } })
  .on('broadcast', { event: 'INSERT' }, (payload) => handleInsert(payload))
  .on('broadcast', { event: 'UPDATE' }, (payload) => handleUpdate(payload))
  .subscribe()
```

---

## 3. Edge Functions Production Patterns

### Modern Deno Entrypoint & Import Rules
- Always use built-in `Deno.serve(async (req) => ...)` (never import `serve` from old `deno.land/std` URLs).
- Prefix all package imports with `npm:` or `jsr:` (e.g., `import { createClient } from 'npm:@supabase/supabase-js@2'`).
- Use `EdgeRuntime.waitUntil(promise)` for non-blocking post-response tasks (telemetry, audit logging) so response latency stays low without dropping the promise on isolate shutdown.

### Webhook Signature Verification (`verify_jwt = false`)
External webhooks (Stripe, DOKU, AutoLaris, Shopify) do not send a Supabase user JWT. Set `verify_jwt = false` for the webhook function in `supabase/config.toml` and verify the raw body HMAC using Web Crypto `crypto.subtle.verify`:

```toml
# supabase/config.toml
[functions.payment-webhook]
verify_jwt = false
```

```ts
// supabase/functions/payment-webhook/index.ts
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const signature = req.headers.get('x-webhook-signature') ?? ''
  const rawBody = await req.text() // MUST read raw text before JSON.parse for HMAC

  const isValid = await verifyHmacSha256(
    Deno.env.get('WEBHOOK_SIGNING_SECRET')!,
    rawBody,
    signature,
  )
  if (!isValid) {
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const event = JSON.parse(rawBody)
  // Process idempotently using event.id ...
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
```
