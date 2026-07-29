---
name: reference_agent_space_scope
description: Model scope akses space AI Agent (single/multiple/all) + chokepoint
metadata: 
  node_type: memory
  type: reference
  originSessionId: 870b6145-c08c-4c8e-977c-8b5e01adcffd
---

Scope akses space agen (live 2026-06-26): kolom `agentDefinition.accessScope` ("single"|"multiple"|"all", **nullable=legacy**) + `scopeSpaceIds` (JSON string array). Chokepoint TUNGGAL `scopedSpaceIds(ctx)` di `backend/src/lib/agent/tools.ts` — dipakai semua read tool agen (chat & scheduler via runner). Logika: all→semua space ws; multiple→scopeSpaceIds; single→[homeSpaceId|scopeSpaceIds[0]]; null(legacy)→homeSpaceId?[it]:akses-user.

Scope **OTORITATIF** (agen baca lintas space walau user yg chat tak punya akses). Pembuatan/ubah ke multiple/all **DIGATE admin** (agent.ts create+patch). Agen lama (accessScope null) sengaja tak di-backfill → perilaku lama dipertahankan. `homeSpaceId` tetap = "home" tempat agen menulis/kerja otonom.

UI: pemilih Single/Beberapa/Semua di `create-agent-dialog.tsx`. Catatan: MCP connector claude.ai = surface token terpisah, tak ikut scope ini.
