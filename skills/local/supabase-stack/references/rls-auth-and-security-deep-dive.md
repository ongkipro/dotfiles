# RLS, Auth, Multi-Tenancy, and pgTAP Security Deep Dive

Authoritative reference for Supabase Row-Level Security (RLS) performance, multi-tenant organization isolation, Custom Access Token Auth Hooks, MFA (`aal2`) enforcement, anonymous user boundaries, and automated pgTAP verification.

---

## 1. RLS Performance & Planner Optimization

Poorly written RLS predicates execute per row and cause full-table-scan timeouts under load. Follow these three rules from `supabase-postgres-best-practices`:

### Rule A: Wrap `auth.uid()` and `auth.jwt()` in a scalar `(select ...)`
Wrapping context functions in `(select ...)` forces PostgreSQL to evaluate the function once per statement as an `InitPlan` rather than once per row (up to 100x faster on large tables).

```sql
-- ❌ Slow: evaluated per row
create policy "orders_select_slow" on public.orders
  for select to authenticated
  using (auth.uid() = user_id);

-- ✅ Fast: evaluated once per query via InitPlan
create policy "orders_select_fast" on public.orders
  for select to authenticated
  using ((select auth.uid()) = user_id);
```

### Rule B: Index every column referenced in an RLS predicate or Foreign Key
PostgreSQL does not automatically index foreign keys or RLS filter columns. Every `user_id`, `org_id`, or `team_id` in a `USING` clause needs a B-tree (or composite) index:

```sql
create index orders_user_id_idx on public.orders (user_id);
create index orders_org_status_idx on public.orders (org_id, status);
```

### Rule C: Avoid recursive RLS joins with private `SECURITY DEFINER` helpers
Joining a membership table (`org_members`) directly inside an RLS policy triggers `org_members`'s own RLS policy on every row. Instead, create a `SECURITY DEFINER` function in an **unexposed schema (`private`)** with an explicit `search_path = ''`, verify `(select auth.uid())` inside the body, and revoke `EXECUTE` from `PUBLIC`/`anon`:

```sql
create schema if not exists private;

create or replace function private.user_org_ids()
returns setof uuid
language sql
security definer
stable
set search_path = ''
as $$
  select org_id
  from public.org_members
  where user_id = (select auth.uid())
    and status = 'active';
$$;

-- CRITICAL: Postgres grants EXECUTE to PUBLIC by default on new functions.
revoke execute on function private.user_org_ids() from public, anon;
grant execute on function private.user_org_ids() to authenticated;

-- Use in tenant table policy (InitPlan array/set lookup against indexed org_id):
create policy "tenant_member_read" on public.invoices
  for select to authenticated
  using (org_id in (select private.user_org_ids()));

create policy "tenant_member_update" on public.invoices
  for update to authenticated
  using (org_id in (select private.user_org_ids()))
  with check (org_id in (select private.user_org_ids()));
```

---

## 2. Supabase Security Checklist (Non-Negotiable Traps)

1. **Never use `user_metadata` (`raw_user_meta_data`) for authorization.**
   Any signed-in user can mutate their own `user_metadata` via `supabase.auth.updateUser({ data: { role: 'admin' } })`. Store roles, tenant claims, and entitlements in `app_metadata` (`raw_app_meta_data`) or a dedicated RBAC table, and inject them via a Custom Access Token Auth Hook.
2. **`TO authenticated` alone is authentication without authorization (BOLA / IDOR).**
   `TO authenticated USING (true)` allows any logged-in user (including an attacker who signs up for a free account) to read or mutate every tenant's rows. Always combine `TO authenticated` with a row-ownership or tenant predicate.
3. **`UPDATE` requires both `SELECT` visibility and `USING` + `WITH CHECK`.**
   - Without a matching `SELECT` policy, `UPDATE ...` silently affects `0 rows` without throwing an error.
   - Without `WITH CHECK`, an authenticated user can update a row's `user_id` or `org_id` to transfer ownership to another tenant.
4. **Never use deprecated `auth.role()`.**
   Specify target Postgres roles in the policy clause (`TO authenticated`, `TO anon`). Note that **anonymous sign-ins** (`supabase.auth.signInAnonymously()`) also use the `authenticated` Postgres role! When anonymous sign-ins are enabled, guard permanent-user policies with:
   ```sql
   using (
     (select auth.uid()) = user_id
     and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) is false
   )
   ```
5. **Views bypass RLS by default.**
   In PostgreSQL 15+, always declare views over RLS-protected tables with `security_invoker = true`:
   ```sql
   create view public.billing_summary
   with (security_invoker = true) as
     select org_id, sum(amount_cents) as total_cents
     from public.invoices
     group by org_id;
   ```
6. **Data API exposure (`GRANT`) vs RLS.**
   Depending on a project's Data API settings, SQL-created tables may require explicit `GRANT SELECT, INSERT, UPDATE, DELETE ON public.table_name TO authenticated;` before PostgREST exposes them. Never grant table access to `anon` or `authenticated` without enabling RLS in the same migration.
7. **Deleting a user does not revoke active JWTs until expiry.**
   Keep access-token TTL short (e.g., 900–3600s), revoke sessions before deletion, and for high-risk financial/admin mutations check that the JWT's `session_id` claim still exists in `auth.sessions`.

---

## 3. Custom Access Token Auth Hook & MFA (`aal2`) Enforcement

### Custom Access Token Hook (RBAC Claims in JWT)
Instead of querying role tables on every request, attach verified claims to the JWT at token-issuance time using a Postgres Auth Hook:

```sql
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
set search_path = ''
as $$
declare
  claims jsonb;
  user_role text;
begin
  select role into user_role
  from public.user_roles
  where user_id = (event ->> 'user_id')::uuid;

  claims := event -> 'claims';
  if user_role is not null then
    claims := jsonb_set(claims, '{app_metadata,user_role}', to_jsonb(user_role));
  end if;

  return jsonb_set(event, '{claims}', claims);
end;
$$;

grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook(jsonb) from authenticated, anon, public;
```

### MFA (`aal2`) Enforcement in RLS
When Multi-Factor Authentication (TOTP/Phone) is required for sensitive tables (e.g., payout settings, API key rotation), enforce `aal2` directly in a `RESTRICTIVE` RLS policy:

```sql
create policy "require_mfa_for_payouts"
  on public.payout_accounts
  as restrictive
  for all
  to authenticated
  using (((select auth.jwt()) ->> 'aal') = 'aal2');
```

---

## 4. Automated RLS Verification with pgTAP (`supabase test db`)

Never ship RLS policies by eyeballing SQL. Add a pgTAP test under `supabase/tests/database/<feature>_rls.test.sql` and run `supabase test db`:

```sql
begin;
select plan(4);

-- Seed two isolated users and one tenant record owned by User A
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'user_a@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'user_b@example.com');

insert into public.orders (id, user_id, total_cents) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 150000);

-- 1. Anonymous role sees 0 rows
set local role anon;
select is(
  (select count(*)::int from public.orders),
  0,
  'anon cannot read any orders'
);

-- 2. Authenticated User A sees their own order
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
select is(
  (select count(*)::int from public.orders),
  1,
  'User A reads own order'
);

-- 3. Authenticated User B sees 0 rows (cross-tenant isolation)
set local "request.jwt.claims" = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
select is(
  (select count(*)::int from public.orders),
  0,
  'User B cannot read User A order'
);

-- 4. User B cannot insert an order impersonating User A
select throws_ok(
  $$insert into public.orders (user_id, total_cents)
    values ('11111111-1111-1111-1111-111111111111', 50000)$$,
  '42501',
  null,
  'User B blocked from inserting row with User A user_id'
);

select * from finish();
rollback;
```
