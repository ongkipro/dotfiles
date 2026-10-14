# Supabase AI Vectors (`pgvector`), Queues (`pgmq`), and Cron (`pg_cron` + `pg_net`)

Use Supabase's built-in PostgreSQL extensions before introducing external vector databases (Pinecone/Qdrant), message brokers (Redis/SQS), or cron runners.

---

## 1. AI & Vector Search (`pgvector`)

### Schema & Index Selection (`vector` vs `halfvec`, HNSW)
- Store embeddings in `extensions.vector(dimensions)` or `extensions.halfvec(dimensions)` (16-bit float cuts index memory by 50% with near-identical recall for 1536–3072 dim models).
- Prefer **HNSW** (`using hnsw`) over IVFFlat: HNSW works immediately on empty tables without a training step and adapts as rows are inserted.
- Match the index operator class to the distance operator:
  - Normalized embeddings (OpenAI `text-embedding-3-*`): inner product `<#>` with `vector_ip_ops` (fastest) or cosine `<=>` with `vector_cosine_ops`.
  - Unnormalized embeddings: cosine `<=>` with `vector_cosine_ops` or L2 `<->` with `vector_l2_ops`.

```sql
create extension if not exists vector with schema extensions;

create table public.document_chunks (
  id bigint generated always as identity primary key,
  org_id uuid not null references public.organizations(id) on delete cascade,
  content text not null,
  fts tsvector generated always as (to_tsvector('simple', coalesce(content, ''))) stored,
  embedding extensions.halfvec(1536) not null,
  created_at timestamptz not null default now()
);

alter table public.document_chunks enable row level security;

create index document_chunks_org_idx on public.document_chunks (org_id);
create index document_chunks_fts_idx on public.document_chunks using gin (fts);
create index document_chunks_embedding_hnsw_idx
  on public.document_chunks
  using hnsw (embedding extensions.halfvec_cosine_ops);
```

### Hybrid Search RPC with Reciprocal Rank Fusion (RRF)
Combine full-text search (`tsvector` exact keyword match, SKUs, codes) with semantic vector search (`pgvector`) in a single `SECURITY INVOKER` RPC so RLS automatically scopes results to the caller's tenant:

```sql
create or replace function public.hybrid_search_chunks(
  query_text text,
  query_embedding extensions.halfvec(1536),
  match_count int default 10,
  full_text_weight float default 1.0,
  semantic_weight float default 1.0,
  rrf_k int default 50
)
returns setof public.document_chunks
language sql
stable
security invoker
set search_path = ''
as $$
with full_text as (
  select
    id,
    row_number() over (order by ts_rank_cd(fts, websearch_to_tsquery('simple', query_text)) desc) as rank_ix
  from public.document_chunks
  where fts @@ websearch_to_tsquery('simple', query_text)
  limit least(match_count, 30) * 2
),
semantic as (
  select
    id,
    row_number() over (order by embedding operator(extensions.<=>) query_embedding) as rank_ix
  from public.document_chunks
  order by embedding operator(extensions.<=>) query_embedding
  limit least(match_count, 30) * 2
)
select d.*
from full_text
full outer join semantic on full_text.id = semantic.id
join public.document_chunks d on d.id = coalesce(full_text.id, semantic.id)
order by
  coalesce(1.0 / (rrf_k + full_text.rank_ix), 0.0) * full_text_weight +
  coalesce(1.0 / (rrf_k + semantic.rank_ix), 0.0) * semantic_weight
  desc
limit least(match_count, 30);
$$;
```

---

## 2. Durable Message Queues (`pgmq`)

Supabase Queues wraps `pgmq` (PostgreSQL Message Queue). Messages stay inside Postgres with visibility timeouts (`vt`), atomic reads (`FOR UPDATE SKIP LOCKED` under the hood), and archival history.

```sql
create extension if not exists pgmq;

-- Create a queue (creates pgmq.q_webhook_outbox and pgmq.a_webhook_outbox)
select pgmq.create('webhook_outbox');

-- Enqueue a JSON payload (optional delay in seconds)
select pgmq.send(
  queue_name => 'webhook_outbox',
  msg        => '{"event":"order.paid","order_id":"ord_123"}'::jsonb,
  delay      => 0
);

-- Worker claims up to 10 messages with a 30-second visibility timeout (vt)
select * from pgmq.read(
  queue_name => 'webhook_outbox',
  vt         => 30,
  qty        => 10
);

-- Archive a processed message (moves to pgmq.a_<queue> for audit trail)
select pgmq.archive('webhook_outbox', msg_id => 42);

-- Or delete permanently
select pgmq.delete('webhook_outbox', msg_id => 42);
```

### Dead-Letter / Poison-Message Rule
Each `pgmq.read` increments `read_ct` on the message. In your worker or Edge Function, check `if (msg.read_ct > 5)` before processing; move poison messages to an alert/dead-letter table and `pgmq.archive()` them so they do not loop indefinitely.

---

## 3. Scheduled Jobs (`pg_cron` + `pg_net` + Supabase Vault)

Use `pg_cron` for recurring SQL maintenance (partition rollovers, stale reservation cleanup, materialized view refresh) or pair it with `pg_net` and `supabase_vault` to trigger Edge Functions securely without hardcoding secrets in migration files.

```sql
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

-- 1. Store project URL and secret key in Vault (run once per environment, never hardcode in git):
-- select vault.create_secret('https://xxx.supabase.co', 'project_url');
-- select vault.create_secret('sb_secret_...', 'edge_cron_secret');

-- 2. Schedule an Edge Function call every 5 minutes:
select cron.schedule(
  'process-webhook-outbox-every-5m',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url')
           || '/functions/v1/process-outbox',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'edge_cron_secret')
    ),
    body := jsonb_build_object('triggered_at', now())
  ) as request_id;
  $$
);

-- Inspect cron execution history and failures:
-- select * from cron.job_run_details order by start_time desc limit 20;
```
