---
name: supabase-stack
description: 'Set up and develop with Supabase — auth, database (PostgreSQL), storage, realtime, and edge functions. Supports Supabase cloud and self-hosted on a VPS via Docker. Use for projects with a serious backend, multi-user, realtime features, or that need full auth without reinventing the wheel. Triggers: ''supabase'', ''setup supabase'', ''auth supabase'', ''supabase docker'', ''self-hosted supabase'', ''supabase schema'', ''rls'', ''row level security'', ''supabase storage''. NOT for plain Postgres/Drizzle work (house stack) or Cloudflare D1 — here ''rls'' and ''storage'' mean built-in Supabase features, not plain Postgres RLS or R2/D1.'
---

# Supabase Stack

Full-stack backend using Supabase: auth, PostgreSQL, storage, realtime, edge functions.

## When to Use Supabase vs Cloudflare D1

| Factor | Supabase | Cloudflare D1 |
|---|---|---|
| Project scale | Medium–Large | Small–Medium |
| Auth built-in | ✅ Full | ❌ DIY needed |
| Database | PostgreSQL (powerful) | SQLite (simple) |
| Realtime | ✅ Built-in | ❌ None |
| Storage | ✅ S3-compatible | ❌ None |
| Deploy target | VPS / Cloud | Cloudflare Edge |
| Self-host | ✅ Docker on VPS | ❌ CF only |
| Cost (cloud) | Free tier available, then $25/mo | Per request |

**Choose Supabase if:** multi-user auth, file storage, realtime, or PostgreSQL features (full-text, JSONB, triggers).
**Choose D1 if:** edge-first, simple CRUD, Cloudflare Workers ecosystem.

## Setup: Supabase Cloud

```bash
# Install CLI
npm i -g supabase

# Login
supabase login

# Init project (at the repo root)
supabase init

# Link to a cloud project
supabase link --project-ref <project-ref>

# Push schema local → cloud
supabase db push

# Pull schema cloud → local
supabase db pull
```

## Setup: Self-Hosted on VPS (Docker)

```bash
# Clone official docker setup
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker

# Copy env
cp .env.example .env

# Edit .env — must change:
# POSTGRES_PASSWORD, JWT_SECRET, ANON_KEY, SERVICE_ROLE_KEY
# SITE_URL=https://yourdomain.com
# API_EXTERNAL_URL=https://api.yourdomain.com

# Start
docker compose up -d

# Access Studio
# http://localhost:8000 (or your domain)
```

### Nginx reverse proxy for self-hosted

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

## Row Level Security (RLS) — Common Patterns

```sql
-- Read: owner only
create policy "owner read" on orders
  for select using (auth.uid() = user_id);

-- Write: owner only
create policy "owner write" on orders
  for insert with check (auth.uid() = user_id);

-- Admin bypass
create policy "admin all" on orders
  using (auth.jwt() ->> 'role' = 'admin');

-- Public read
create policy "public read" on products
  for select using (true);
```

## Auth — Client Integration

Retrieve the current [Supabase SSR client guide](https://supabase.com/docs/guides/auth/server-side/creating-a-client) and the framework's current request-boundary docs before implementation. `@supabase/ssr` and framework cookie APIs evolve; do not copy an old auth-helper or middleware snippet from memory.

### Next.js App Router

Install `@supabase/supabase-js` and `@supabase/ssr` with the project's existing package manager. Use the current publishable key names:

```bash
NEXT_PUBLIC_SUPABASE_URL=supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=supabase_publishable_key
```

Create both clients under `lib/supabase`:

```ts
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  )
}
```

```ts
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options))
          } catch {
            // Server Components cannot write cookies. The request Proxy refreshes them.
          }
        },
      },
    },
  )
}
```

Then follow the official guide's request-boundary pattern for the project's installed Next.js version rather than maintaining a second snapshot here. Current Next.js documentation uses `proxy.ts`; older supported releases may still use `middleware.ts`. Its session helper must:

1. create a request-scoped server client;
2. mirror refreshed cookies onto both the request and response;
3. preserve each cookie's `options` when applying the `setAll` callback;
4. call `supabase.auth.getClaims()` immediately after client creation; and
5. return that same response object, with a matcher that excludes static assets.

Use `getClaims()` to authorize server pages and data. Use `getUser()` when an up-to-date Auth user record is required. Use `getSession()` only when raw session tokens are needed; never trust its embedded user object for server authorization because cookie-backed storage is user-controlled.

### Astro

The following is a browser-only public client, not SSR auth:

```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
)
```

For cookie-backed Astro auth, enable on-demand rendering and retrieve the current Astro section of the [Supabase SSR guide](https://supabase.com/docs/guides/auth/server-side/creating-a-client). Use `createServerClient`, request cookies, and a request-time authorization check; do not reuse the browser client on the server.

### Auth flows

Browser sign-up, password sign-in, OAuth, and sign-out use the current `supabase.auth` methods. On the server:

```ts
const supabase = await createClient()
const { data: { claims }, error } = await supabase.auth.getClaims()
if (error || !claims) {
  // reject or redirect before reading protected data
}
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

Storage bucket policies are similar to RLS — set via the dashboard or SQL.

## Realtime

```ts
// Subscribe to table changes
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
# Create a function
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
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Server-side only (private)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## New Project Checklist

- [ ] Create a project in Supabase (cloud) or set up Docker (VPS)
- [ ] Init the `supabase/` folder in the repo with `supabase init`
- [ ] Create the first migration: main tables + RLS
- [ ] Set up an auth provider (email, OAuth)
- [ ] Install the client library in the frontend
- [ ] Set up the current request boundary for cookie refresh and authorization (`proxy.ts` on current Next.js; request middleware on Astro)
- [ ] Create a storage bucket + policies
- [ ] Test RLS: make sure a user cannot access other people's data

## Quick Reference

- Docs: supabase.com/docs
- Self-host: supabase.com/docs/guides/self-hosting/docker
- RLS guide: supabase.com/docs/guides/database/row-level-security
- MCP Supabase (if using): `npx @supabase/mcp-server-supabase@latest`
