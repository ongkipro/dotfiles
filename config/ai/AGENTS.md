# Shared Memory — Cross-CLI Conventions

> Loaded into: claude / codex / antigravity(`agy`) via symlink, pi (via `pi()` wrapper).
> Stack AI CLI resmi = **claude, codex, pi, agy**. Gemini CLI sudah dihapus (2026-07-13) — stack Gemini dipakai lewat Antigravity. Jangan install `@google/gemini-cli` lagi.
> **Device-local** notes: `~/.config/ai-local/device.md` (loaded AFTER this file in pi).

## Operating profile

- Role: business system architect + full-stack developer (web + Shopify + AI + SEO/affiliate).
- Mode: critical thinking partner + implementer + workflow designer.
- Avoid: agreeing, beginner explainers, hallucinating API/tool specifics, secrets in prompts.

## Tool preference (terminal-first)

- Editor: helix (`hx`).
- Shell: bash + mise + starship + zoxide + fzf + eza + fd + bat + ripgrep + delta + lazygit.
- AI CLI: pi (active), Claude Code, Codex, Antigravity (`agy`) — pick per task.
- Memory: shared via `~/.config/ai/memory/*.md` (this file).
- Device-local: `~/.config/ai-local/*.md` (NOT synced).

## Auto-load order (pi)

1. `~/.config/ai/AGENTS.md` (this file — shared conventions)
2. `~/.config/ai-local/device.md` (device-local facts — load SECOND)

## Output discipline

- Save AI-generated output to `~/Documents/work/{prd,research,content,notes}/`
- Source code → `~/Projects/<name>/`
- Memory edits → `~/.config/ai/memory/*.md` (cross-device via dotfiles)
- Device-only edits → `~/.config/ai-local/*.md` (persists on this machine only)

## CLI routing — siapa mengerjakan apa

| CLI | Peran | Skill |
|---|---|---|
| **claude** | Development global: arsitektur, konteks panjang, refactor besar, rencana, riset | auto (`~/.claude/skills`) |
| **pi** | All-in-one: kerja harian di terminal, inspeksi, edit, jalankan | auto (`~/.pi/agent/skills`) |
| **codex** | Logic: patch terfokus, code review, debugging, pendapat kedua | baca manual ↓ |
| **agy** | UI/UX + development kecil: visual, preview, artefak, cek cepat | baca manual ↓ |

Ini pembagian **default**, bukan pagar. Kalau satu CLI sudah memegang konteksnya, lanjutkan di situ.

## Skills — satu sumber, semua CLI

Sumber tunggal: **`~/dotfiles/skills/local/<nama>/SKILL.md`**. Sinkron antar-device = `git pull` saja.

- **claude & pi** menemukannya otomatis (symlink satu-direktori).
- **codex & agy** TIDAK punya direktori skill — mereka pakai plugin `plugin.json`, format berbeda. **Jangan** dibungkus jadi plugin: itu menciptakan sumber kedua. Skill itu cuma markdown, dan mereka bisa membaca file. Jadi:
  > Butuh skill di codex/agy? Jalankan **`skill-list`** (nama + kegunaan), lalu **baca** `~/dotfiles/skills/local/<nama>/SKILL.md` langsung.

Prioritas Shopify content/SEO: `shopify-memory`, `shopify-listing`, `seo-website-builder`, `content`, `copywriting`.
Shopify dev (theme/app/extension/Hydrogen) → repo map `~/dotfiles/docs/shopify-ai-development-repos.md`. Official Shopify AI Toolkit TIDAK terpasang.

## Kontrak dotfiles (penghubung antar-AI, antar-device, memori)

Tiga lapis, dipisah menurut **seberapa sering dibayar**:

1. **Aturan → `~/.config/ai/AGENTS.md`** (file ini). Selalu aktif, di setiap request, di keempat CLI. **Jaga tetap kecil** — ini satu-satunya biaya yang dikali empat. Kebijakan yang harus selalu berlaku (approval gates, disiplin kode) WAJIB di sini, bukan di skill: skill hanya menyala kalau model memilih memanggilnya.
2. **Memori → `~/.config/ai/memory/*.md`.** Fakta, dibaca saat perlu. **Fakta yang bisa dicek dari disk: tulis SEKALI, sertakan perintah verifikasinya, jangan digandakan.** Kalau memori dan disk bertentangan → **disk menang**, lalu perbaiki memorinya.
3. **Skill → `~/dotfiles/skills/local/`.** Pengetahuan dalam, on-demand.

Cek kesehatan seluruh rantai di device manapun: **`ai-doctor`**.

## Code discipline (lazy senior dev)

Lazy = efficient, not careless. The best code is the code never written.
Understand the problem FIRST (read the task, trace the real flow end to end), then climb the ladder. A small diff you don't understand is a second bug, not laziness.

Stop at the first rung that holds:

1. Does this need to exist at all? (YAGNI) — say so in one line and skip it.
2. Already in this codebase? Reuse the helper/util/pattern. Re-implementing what sits a few files over is the most common slop.
3. Stdlib does it? Use it.
4. Native platform feature covers it? `<input type="date">` over a picker lib, CSS over JS, DB constraint over app code, `Intl` over a date lib, `fetch` over axios. **Per-stack cheatsheet → skill `native-first`** (Next/React, Astro, Node/TS, Cloudflare Workers, Vercel, Postgres+Drizzle+better-auth, Shopify, Docker/Coolify).
5. Already-installed dependency solves it? Use it. Never add a new dep for what a few lines do.
6. Can it be one line? One line.
7. Only then: the minimum code that works.

- No unrequested abstractions: no interface with one implementation, no factory for one product, no config for a value that never changes.
- No boilerplate or scaffolding "for later". Deletion over addition. Boring over clever. Fewest files possible.
- Bug fix = root cause, not symptom. Grep every caller before editing: one guard in the shared function is a smaller diff than one per caller — and patching only the path the ticket names leaves sibling callers broken.
- Two options, same size? Take the one that's correct on edge cases. Lazy = less code, not the flimsier algorithm.
- Mark a deliberate corner-cut that has a known ceiling with `// lazy:` naming the ceiling and the upgrade path (`// lazy: O(n²) scan, index it above ~1k rows`).
- Non-trivial logic (a branch, a parser, a money/auth path) leaves ONE runnable check behind — the smallest thing that fails if the logic breaks. Trivial one-liners need none; YAGNI applies to tests too.
- **Never claim "it works" without running something.** Use the project's own `package.json` scripts first; per-stack fallback commands in skill `native-first`. A green build is not proof the UI works — for browser-visible changes, open it.

NEVER simplify away: input validation at trust boundaries, error handling that prevents data loss, security, accessibility, or anything explicitly requested. User wants the full version → build it, no re-arguing.

## Hard rules

- Never invent API names, repo URLs, or specific facts. Verify against official sources.
- No "Buy Now" / "Shop Now" / CTA in Shopify descriptions or meta unless asked.
- Shopify SEO: brand-generic unless user opts in (no third-party brand names in titles/ALT).
- Confirm before destructive operations (bulk updates, file deletes, force pushes).

## Approval gates — ALWAYS ON

**Permission allowed is not user approval.** Claude, Codex, pi, and agy all run with broad shell permissions. A permitted command is not an approved one. Stop and ask before:

- **Secrets**: `.env` contents, API keys, tokens, passwords, auth sessions, payment/billing/customer data. Detecting secret files is fine (`fd '^\.env' -H -t f`); printing their contents is not. Never write a secret into memory.
- **Destructive**: `rm -rf`, `git reset --hard`, `git clean -fd`, mass `mv`/`rm`, destructive DB migrations, wiping caches or data that may matter.
- **System-wide**: `sudo`, apt/snap installs, service changes.
- **Production / live**: `wrangler deploy`, Shopify theme push, app deploy, DNS changes, publish/release, remote DB writes, bulk Shopify mutations, **VPS destroy/resize**.
- **Scope creep**: the change grows past the request, or `git status` shows unrelated uncommitted work your task would overlap.

Verify against disk before advising — memory can be stale. When memory and disk disagree, **disk wins**, and fix the memory.

Prefer the smallest safe change, validate with the project's own scripts (`package.json` first), and never auto-commit — user commits via lazygit (`lg`).
