---
name: formalinads-malaysia-gateway
description: "FormalinADS Malaysia payment gateway identity is SenangPay, not DOKU — and current pivot direction is Malaysia-focused"
metadata:
  node_type: memory
  type: project
  originSessionId: 8c9edae4-bad9-4d9d-9eac-6601e1efc57b
  modified: 2026-08-31T16:17:25.582Z
---

When Paduka Ongki says "doku" in the context of FormalinADS Malaysia payment, he means **DOKU/SenangPay** — verified 2026-08-31 via web search: DOKU (Indonesia) acquired SenangPay (Malaysia) in July 2022 for US$7.5M, and SenangPay now operates as "senangPay — a DOKU company". So "DOKU Malaysia" is a real, correct identity, not a mix-up with the Indonesian entity — they are now the same corporate group. SenangPay itself: founded 2015, based in Shah Alam Malaysia, registered with **Bank Negara Malaysia** as a Merchant Acquiring Services provider, PCI DSS certified, 15,000+ merchants served, supports FPX/cards/e-wallets/BNPL/instalments. Sources: digitalnewsasia.com, fintechnews.my, senangpay.com, technode.global (all retrieved 2026-08-31).

**Why this matters for the project:** `STATUS.md` in the formalinads repo lists "Verified Malaysia-capable gateway selection" as a blocker before Malaysia online payment can be implemented (DEC-005: "Malaysia online payment remains unselected"). SenangPay/DOKU is a BNM-regulated, PCI-DSS-certified Malaysia-native gateway, so the vendor-identity and market-capability half of that blocker is credibly resolved. What remains is Ongki's own merchant account setup/API credentials and the integration work itself — not further doubt about whether the gateway is legitimate for Malaysia.

**How to apply:** Never conflate "doku" with the Indonesian DOKU gateway in this project's context — check which market is being discussed. As of 2026-08-31 Ongki is reconsidering formalinads' launch scope: leaning toward a Malaysia-focused (possibly Malaysia-only) launch instead of the originally planned simultaneous Indonesia+Malaysia multi-tenant MVP, citing COD support + SenangPay availability for Malaysia, optional digital products, and a prior successful Malaysia-only project (mybookcms) built on Cloudflare. He is also questioning whether Coolify/VPS deploys cause downtime vs Cloudflare's zero-downtime deploys — this is being discussed, not yet decided, and is likely a solvable Coolify rolling-deploy configuration issue rather than a platform limitation (the app's Dockerfile already ships a `/api/health` check suited for that).

*Relocated 2026-09-01 from `~/.claude/projects/-home-ongki/memory/`, unedited apart
from this note. That directory is the device-local read-only bootstrap — one
mode-400 file in a mode-500 directory, which `ai-doctor` enforces — so a second
file there broke the check and would never have reached another device. Cross-device
project memory belongs here. See [[formalin]] for the repo itself.*
