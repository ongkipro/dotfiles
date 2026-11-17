---
name: geraiexpress-cfv2-architecture
description: Canonical pointer for GeraiExpress v2 (geraiexpress-cfv2): 100% Cloudflare Serverless + geraimitra.com SaaS zone + retired v1 Vultr VPS + co-hosted partner-relay on 99ribu-prod.
metadata:
  node_type: memory
  type: project
---

# GeraiExpress v2 (`geraiexpress-cfv2`) — Architecture & Domain Pointer

Canonical repository: `~/Projects/geraiexpress-cfv2` (`github.com/ongkipro/geraiexpress-cfv2`, private).
The legacy Next.js/PostgreSQL repository `~/Projects/geraiexpress` is frozen history — never develop new features there.

## Locked Architecture & Domain Topology (`DEC-201..235`, `ADR-0001..0006`)
- **Core / Sales Platform Domain:** `geraiexpress.com` (`geraiexpress.com`, `www.`, `app.`, `owner.`, `hooks.`, `mail.`, `relay.`).
- **Outlet White-Label & Cloudflare for SaaS Zone (`DEC-234`):** **`geraimitra.com`** (replaced `gerai.cc` on 2026-11-17) — `<slug>.geraimitra.com` (prod), `<slug>-stg.geraimitra.com` (staging), `cname.geraimitra.com` (CNAME target), `fallback.geraimitra.com` (originless fallback), `probe.geraimitra.com` (health probe).
- **100% Cloudflare Serverless Runtime:** one Hono Worker + Vite React 19 Static Assets (`app.` & `owner.`) + Hono JSX SSR (`geraiexpress.com` & `*.geraimitra.com`), D1 control plane (`DB`), per-tenant SQLite `GeraiVaultDO`, `PartnerQuotaDO`, R2 (`BUCKET`), Queues + Cron, KV (`CACHE_KV` area search only — never host routing), and Cloudflare Email Sending (`EMAIL`, `DEC-227`).
- **Retired Dedicated Vultr VPS & Co-Hosted Relay (`DEC-235`):** the dedicated `geraiexpress` Vultr VPS (`139.180.142.31`), firewall group, and SSH key were permanently deleted on 2026-11-17. The stateless 66-line Mengantar Partner API static-IPv4 forwarder (`infra/partner-relay`, zero Mengantar secrets) co-hosts on `99ribu-prod` Coolify (`149.28.129.53` Vultr Reserved IPv4; see `~/.config/ai-local/fleet-inventory.md`).
- **Independent Reviewer Rule:** default to **GPT-6.1 Sol** (`9router-fantastico/cx/gpt-6.1-sol`).

Always read `~/Projects/geraiexpress-cfv2/STATUS.md`, `DECISIONS.md`, and `docs/SYSTEM-MAP.md` for current state.
