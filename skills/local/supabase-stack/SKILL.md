---
name: supabase-stack
description: Setup dan develop dengan Supabase — auth, database (PostgreSQL), storage, realtime, dan edge functions. Mendukung cloud Supabase dan self-hosted di VPS via Docker. Gunakan untuk project dengan backend serius, multi-user, realtime features, atau yang butuh auth lengkap tanpa reinvent the wheel. Triggers: 'supabase', 'setup supabase', 'auth supabase', 'supabase docker', 'self-hosted supabase', 'supabase schema', 'rls', 'row level security', 'supabase storage'.
---

# Supabase Stack

Full-stack backend pakai Supabase: auth, PostgreSQL, storage, realtime, edge functions.

## Kapan Pakai Supabase vs Cloudflare D1

| Faktor | Supabase | Cloudflare D1 |
|---|---|---|
| Project skala | Medium–Large | Small–Medium |
| Auth built-in | ✅ Lengkap | ❌ Perlu DIY |
| Database | PostgreSQL (powerful) | SQLite (simple) |
| Realtime | ✅ Built-in | ❌ Tidak ada |
| Storage | ✅ S3-compatible | ❌ Tidak ada |
| Deploy target | VPS / Cloud | Cloudflare Edge |
| Self-host | ✅ Docker di VPS | ❌ CF only |
| Cost (cloud) | Free tier ada, lalu $25/mo | Per request |

**Pilih Supabase kalau:** auth multi-user, file storage, realtime, atau PostgreSQL features (full-text, JSONB, triggers).
**Pilih D1 kalau:** edge-first, simple CRUD, Cloudflare Workers ecosystem.

## Setup: Supabase Cloud

```bash
# Install CLI
npm i -g supabase

# Login
supabase login

# Init project (di root repo)
supabase init

# Link ke cloud project
supabase link --project-ref <project-ref>

# Push schema local → cloud
supabase db push

# Pull schema cloud → local
supabase db pull
```

## Setup: Self-Hosted di VPS (Docker)

```bash
# Clone official docker setup
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker

# Copy env
cp .env.example .env

# Edit .env — wajib ganti:
# POSTGRES_PASSWORD, JWT_SECRET, ANON_KEY, SERVICE_ROLE_KEY
# SITE_URL=https://yourdomain.com
# API_EXTERNAL_URL=https://api.yourdomain.com

# Start
docker compose up -d

# Akses Studio
# http://localhost:8000 (atau domain kamu)
```

### Nginx reverse proxy untuk self-hosted

```nginx
server {
    listen 443 ssl;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Schema & Migration

```sql
-- supabase/migrations/001_init.sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users profile (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

## Row Level Security (RLS) — Pola Umum

```sql
-- Read: hanya owner
create policy "owner read" on orders
  for select using (auth.uid() = user_id);

-- Write: hanya owner
create policy "owner write" on orders
  for insert with check (auth.uid() = user_id);

-- Admin bypass
create policy "admin all" on orders
  using (auth.jwt() ->> 'role' = 'admin');

-- Public read
create policy "public read" on products
  for select using (true);
```

## Auth — Integrasi Client

### Next.js (App Router)

```bash
npm i @supabase/supabase-js @supabase/ssr
```

```ts
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  )
}
```

### Astro

```ts
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
)
```

### Auth flows

```ts
// Sign up
const { data, error } = await supabase.auth.signUp({
  email, password,
  options: { data: { username } }
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({ email, password })

// OAuth (Google, GitHub)
await supabase.auth.signInWithOAuth({ provider: 'google',
  options: { redirectTo: `${origin}/auth/callback` }
})

// Sign out
await supabase.auth.signOut()

// Get session (server)
const { data: { session } } = await supabase.auth.getSession()
```

## Storage

```ts
// Upload file
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file, { upsert: true })

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/avatar.png`)

// Delete
await supabase.storage.from('avatars').remove([`${userId}/avatar.png`])
```

Storage bucket policies mirip RLS — set via dashboard atau SQL.

## Realtime

```ts
// Subscribe ke table changes
const channel = supabase
  .channel('orders-changes')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${userId}` },
    (payload) => console.log(payload)
  )
  .subscribe()

// Cleanup
supabase.removeChannel(channel)
```

## Edge Functions

```bash
# Buat function
supabase functions new send-email

# Deploy
supabase functions deploy send-email

# Local dev
supabase functions serve
```

## Environment Variables

```env
# Client-side (public)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Server-side only (private)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Checklist Project Baru

- [ ] Buat project di Supabase (cloud) atau setup Docker (VPS)
- [ ] Init `supabase/` folder di repo dengan `supabase init`
- [ ] Buat migration pertama: tabel utama + RLS
- [ ] Setup auth provider (email, OAuth)
- [ ] Pasang client library di frontend
- [ ] Setup middleware untuk session refresh (Next.js / Astro)
- [ ] Buat storage bucket + policies
- [ ] Test RLS: pastikan user tidak bisa akses data orang lain

## Referensi Cepat

- Docs: supabase.com/docs
- Self-host: supabase.com/docs/guides/self-hosting/docker
- RLS guide: supabase.com/docs/guides/database/row-level-security
- MCP Supabase (kalau pakai): `npx @supabase/mcp-server-supabase@latest`
