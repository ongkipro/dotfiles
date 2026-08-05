---
name: antigravity-cli-agy
description: "Antigravity CLI di Mac = binary `agy` (bukan `gemini`); subcommand-nya `plugin`, bukan `extensions`"
metadata: 
  node_type: memory
  type: reference
  originSessionId: ef4c798a-d351-4318-8a07-3088786a86d4
  modified: 2026-08-01T06:01:22.631Z
---

Antigravity CLI di Mac ini adalah binary **`agy`** (di `~/.local/bin/agy`; v1.1.8 per 2026-08-01). Gemini CLI (`gemini`) TIDAK terinstall — dan sudah diputuskan tidak dipasang.

**Jebakan: "⚠ Eligibility Check ... failed to get profile picture: TLS handshake timeout" itu KOSMETIK, bukan auth rusak.** Yang gagal cuma cache `peopleInfo` (avatar dari `lh3.googleusercontent.com`), tapi `server_oauth.go` menaikkannya jadi `Validation failed` sehingga terlihat seperti login bermasalah. Cek log `~/.gemini/antigravity-cli/log/cli-*.log`: kalau ada `OAuth: authenticated successfully` + `loadCodeAssist`/`fetchAvailableModels` sukses, sesi tetap sehat dan model tetap jalan. Fix = restart `agy` (bukan re-login, bukan hapus token). Verifikasi cepat: `agy -p "reply with exactly: OK"`. Timeout serupa juga pernah kena endpoint telemetry `play.googleapis.com/log` — pola yang sama, sama-sama transient.

**Jebakan:** perintah yang beredar di internet berbentuk `gemini extensions install <url>`. Itu tidak jalan di sini. `agy` tidak punya subcommand `extensions`. Yang benar:

    agy plugin install <github-url>     # bisa langsung URL repo
    agy plugin list / uninstall / disable
    agy plugin import [gemini|claude]   # serap ekosistem tetangga

`agy` menelan repo ber-`gemini-extension.json` maupun `.claude-plugin/` — itu sebabnya Gemini CLI jadi mubazir. State (conversation, log) disimpan di `~/.gemini/antigravity-cli/`, jadi folder `~/.gemini` ada meski Gemini CLI tidak terpasang.

Model yang diekspos `agy models`: Gemini 3.5 Flash, Gemini 3.1 Pro, Claude Sonnet 4.6, Claude Opus 4.6, GPT-OSS 120B.

**Keputusan (2026-07-12):** tidak memasang Gemini CLI — sisi Gemini sudah ditutup `agy`, sisi "model apa pun murah" sudah ditutup 9router. CLI kelima = biaya rawat (symlink `ai-memory-link`, `skill-update`) tanpa manfaat baru.

Plugin terpasang: `worktrunk` saja (verify with `agy plugin list`; lihat [[worktrunk-worktree-tooling]]). Ponytail was removed because its persistent rules duplicate shared `AGENTS.md`; the useful review workflow now lives in the owned `lean-code-review` skill.
