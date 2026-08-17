# Trust boundaries and plain PostgreSQL RLS

This reference covers PostgreSQL roles and row-level security mechanics. Use
`application-security` for the cross-stack threat model and credential/role hardening.
Use `supabase-stack` for Supabase Auth/JWT helpers, service roles, platform migrations,
and other Supabase-owned behavior.

## Start with the trust model

Record:

1. which authenticated principal chooses the tenant and how that claim is verified;
2. database login roles versus assumed roles, migrations, jobs, support/admin, and
   application traffic;
3. tables and operations in scope, including indirect access through views/functions;
4. fail-closed behavior when tenant context is absent, malformed, stale, or unauthorized;
5. how a pooled connection receives and clears request/transaction context;
6. which roles can own tables, use `BYPASSRLS`, alter policy, or execute privileged code.

RLS is defense in depth only if untrusted application input cannot select a more
privileged role or tenant context. Parameterized queries prevent value injection; they
do not authenticate a tenant claim.

## Relational tenant integrity first

Put `tenant_id` on every tenant-owned row unless ownership is unambiguously derived and
enforced. Prefer composite keys/FKs where they make cross-tenant references impossible.
RLS controls visibility and write eligibility; it does not replace referential integrity
or tenant-scoped uniqueness.

Do not rely on every application query remembering `WHERE tenant_id = ...`. Keep an
explicit filter where it improves query plans/readability, but regard the policy as the
trust-boundary enforcement when RLS is the chosen control.

## PostgreSQL policy semantics to verify

- With RLS enabled and no applicable policy, access is default-deny.
- Policies are scoped by command and role. `USING` controls which existing rows are
  visible/targetable; `WITH CHECK` controls rows produced by `INSERT`/`UPDATE`.
- Multiple policies can combine permissively or restrictively. Review the effective set,
  not one policy in isolation.
- Table owners normally bypass RLS. Superusers and roles with `BYPASSRLS` bypass it.
  `FORCE ROW LEVEL SECURITY` changes owner behavior, subject to PostgreSQL semantics.
- Referential-integrity checks and privileged functions/views may behave outside the
  caller's expected row visibility. Retrieve the target-version documentation and test
  the actual access path.

Never run the application as a superuser, migration owner, table owner, or role with
`BYPASSRLS`. Separate migration credentials from runtime credentials.

## Session context and pooling

If policy expressions use a custom setting or role-derived context:

- set it only from a verified server-side claim, never directly from request input;
- prefer transaction-local context and wrap set + queries in the same transaction when
  compatible with the chosen pool/driver;
- validate the parsed value and fail closed for missing/empty/malformed context;
- prove no state persists to the next borrower after commit, rollback, error, and reuse;
- do not assume transaction pooling preserves session `SET`, prepared statements, temp
  tables, advisory locks, or LISTEN state.

Exact Drizzle transaction APIs and driver behavior are version-sensitive. Retrieve them
for the installed packages. If the runtime cannot guarantee context affinity for the
whole operation, change the connection/RLS design rather than adding an application
comment.

## Policy verification matrix

Use two tenants plus a privileged maintenance path on an isolated database. Verify each
applicable cell through the same database role and query path as production:

| Context | Read own | Read other | Insert own | Insert other | Update/move tenant | Delete |
|---|---:|---:|---:|---:|---:|---:|
| tenant A | allow | deny/empty | allow | deny | deny | contract |
| tenant B | allow | deny/empty | allow | deny | deny | contract |
| missing | deny/empty | deny/empty | deny | deny | deny | deny |
| malformed | deny/error | deny/error | deny/error | deny/error | deny/error | deny/error |
| maintenance | explicit | explicit | explicit | explicit | explicit | explicit |

Also test `INSERT ... RETURNING`, upsert conflict paths, joins/subqueries, bulk writes,
foreign-key failures, prepared statements if used, transaction rollback, and sequential
pool borrowers. Test table-owner behavior separately so a privileged test connection
cannot create false confidence.

## Error and observability boundaries

Do not translate every RLS denial into “not found” without the product/security contract;
visibility hiding and authorization errors have different audit needs. Do not log tenant
secrets, SQL parameters, tokens, or row contents. Provide `observability-engineering`
with safe dimensions such as operation, relation class, policy-denied category, SQLSTATE,
and latency while controlling cardinality and exposure.

Security-definer functions, dynamic SQL, mutable `search_path`, grants, default
privileges, and extension trust are `application-security` review points. Keep functions
invoked by policies small, schema-qualified, and tested under the real caller role.
