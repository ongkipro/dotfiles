# Source Ledger

Accessed 2026-08-17. This skill makes orchestration and evidence-boundary claims,
not framework API claims. Repository instructions, installed versions, project
scripts, machine-readable contracts, and the activated specialist skill are the
first authorities. Use the primary sources below only for a current claim that
crosses the orchestration boundary.

| Domain | Current primary source | Use here |
|---|---|---|
| Next.js App Router | [Next.js App Router documentation](https://nextjs.org/docs/app) | Confirm current framework boundaries after `nextjs-development` is activated. |
| Astro | [Astro documentation](https://docs.astro.build/) | Confirm current rendering, routing, and integration behavior after `astro-development` is activated. |
| Cloudflare Workers | [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/) | Confirm current runtime, binding, and deployment behavior after the relevant Cloudflare skill is activated. |
| PostgreSQL | [PostgreSQL current documentation](https://www.postgresql.org/docs/current/) | Confirm database behavior after `postgres-drizzle` is activated. |
| Drizzle ORM | [Drizzle ORM documentation](https://orm.drizzle.team/docs/overview) | Confirm current ORM and migration APIs after `postgres-drizzle` is activated. |
| Supabase | [Supabase documentation](https://supabase.com/docs) | Confirm current database, Auth, RLS, Storage, Realtime, or Edge Function behavior after `supabase-stack` is activated. |
| REST contracts | [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) | Confirm the current specification after `openapi-spec` is activated. |
| Application security | [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/) | Primary verification-control reference for `application-security`; not a substitute for project threat modeling. |
| Observability | [OpenTelemetry documentation](https://opentelemetry.io/docs/) | Confirm current telemetry conventions/APIs after `observability-engineering` is activated. |
| GitHub Actions | [GitHub Actions documentation](https://docs.github.com/en/actions) | Confirm current workflow syntax, permissions, and hosted behavior after `github-actions` is activated. |

Framework, provider, CLI, action, and library APIs are volatile. Recheck them
against installed versions and current official documentation before emitting a
command, configuration key, or code API. Each specialist's own source ledger and
project-local evidence supersede this routing index for domain detail.
