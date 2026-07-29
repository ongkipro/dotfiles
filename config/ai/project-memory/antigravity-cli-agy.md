---
name: antigravity-cli-agy
description: "Antigravity CLI di Mac = binary `agy` (bukan `gemini`); subcommand-nya `plugin`, bukan `extensions`"
metadata: 
  node_type: memory
  type: reference
  originSessionId: ef4c798a-d351-4318-8a07-3088786a86d4
---

Antigravity CLI di Mac ini adalah binary **`agy`** (~143 MB, di `~/.local/bin/agy`, v1.1.1). Gemini CLI (`gemini`) TIDAK terinstall — dan sudah diputuskan tidak dipasang.

**Jebakan:** perintah yang beredar di internet berbentuk `gemini extensions install <url>`. Itu tidak jalan di sini. `agy` tidak punya subcommand `extensions`. Yang benar:

    agy plugin install <github-url>     # bisa langsung URL repo
    agy plugin list / uninstall / disable
    agy plugin import [gemini|claude]   # serap ekosistem tetangga

`agy` menelan repo ber-`gemini-extension.json` maupun `.claude-plugin/` — itu sebabnya Gemini CLI jadi mubazir. State (conversation, log) disimpan di `~/.gemini/antigravity-cli/`, jadi folder `~/.gemini` ada meski Gemini CLI tidak terpasang.

Model yang diekspos `agy models`: Gemini 3.5 Flash, Gemini 3.1 Pro, Claude Sonnet 4.6, Claude Opus 4.6, GPT-OSS 120B.

**Keputusan (2026-07-12):** tidak memasang Gemini CLI — sisi Gemini sudah ditutup `agy`, sisi "model apa pun murah" sudah ditutup 9router. CLI kelima = biaya rawat (symlink `ai-memory-link`, `skill-update`) tanpa manfaat baru.

Plugin terpasang: `worktrunk` saja (verify with `agy plugin list`; lihat [[worktrunk-worktree-tooling]]). Ponytail was removed because its persistent rules duplicate shared `AGENTS.md`; the useful review workflow now lives in the owned `lean-code-review` skill.
