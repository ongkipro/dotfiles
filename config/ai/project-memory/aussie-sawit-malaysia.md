---
name: aussie-sawit-malaysia
description: AUSSIE Sawit Malaysia active project reference; repository status remains authoritative
metadata:
  node_type: memory
  type: project
---

# AUSSIE Sawit Malaysia

> **Authority: the active repository, not memory.** Read
> `~/Projects/aussiemalaysia/STATUS.md`, that repository's `AGENTS.md`, and its
> task documents before implementation. If memory differs from repository
> contracts or executable behavior, repository disk wins.

## Project identity

- Product/site: **AUSSIE Sawit Malaysia** at `aussiesawit.my`, a Malaysia-focused COD storefront for palm-tree care products.
- Active repository: `ongkipro/aussiemalaysia`; expected checkout convention: `~/Projects/aussiemalaysia/`. Verify the checkout on the current device.
- Do not confuse it with the older `ongkipro/aussie-malaysia` / `~/Projects/aussie-malaysia` codebase. That older path described a Scalev-based implementation and is not the active project's status authority.
- Storefront language is primarily Bahasa Melayu; the admin surface may use English or Indonesian according to the repository's current implementation.

## Stable architecture orientation

The last durable architecture direction was an Astro storefront and admin on Cloudflare Workers, with D1 as the order system of record, R2 for media, KV for integration tokens, Cloudflare Access for admin identity, and EasyParcel for Malaysian fulfillment. The project deliberately moved away from Scalev. Treat every detail as orientation until confirmed in the active repository.

Before changing orders, pricing, shipping, COD reconciliation, EasyParcel, tracking, analytics, admin authorization, or deployment:

1. Read the active repository's status and architecture documents.
2. Inspect the real schema, bindings, routes, and tests rather than copying dated names from memory.
3. Preserve server-authoritative pricing and shipping checks, order-attempt capture, idempotency, audit history, and secret isolation when those invariants still exist in current code.
4. Keep credentials out of memory and the repository; use the project's documented local and production secret mechanisms.

## Historical record

The former 2026-07 session log, including superseded architecture, dated build claims, deferred actions, and contradictory resume notes, is preserved verbatim in [AUSSIE_SAWIT_MALAYSIA_MEMORY_ARCHIVE_2026-07.md](../../../docs/AUSSIE_SAWIT_MALAYSIA_MEMORY_ARCHIVE_2026-07.md). It is intentionally **not selectable memory** and must not be used for current project status.
