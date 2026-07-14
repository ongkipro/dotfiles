# Skills & Capability Map
> Durable skill profile for AI CLI. Use this to calibrate explanation depth, avoid over-explaining basics, and choose practical execution paths.

## Operating profile
- Role: full-stack website development + full-stack digital marketing.
- Core mode: business system architect, not just task operator.
- Strong preference: build reusable systems, workflows, SOPs, prompts, AI skills, automation, dashboards, and scalable web assets.

## Development
- Web stack focus: Astro, Tailwind, Shopify/headless Shopify, Next.js for admin/client dashboards when needed, Cloudflare Workers, VPS, Git, Linux terminal workflow.
- Shopify focus: standard Shopify store, Liquid/theme work, headless storefront, Storefront API, checkout flow, product/category structure, SEO, conversion, tracking.
- Preferred public frontend: Astro + Tailwind for SEO/static/headless projects.
- Preferred admin/client dashboard direction: Next.js + React + TypeScript + Tailwind + shadcn/ui when dashboard complexity needs React.
- Infrastructure interests: Cloudflare Workers/R2/D1/Queues, VPS, Supabase/PostgreSQL, queue systems, scraping, API architecture, multi-domain publishing.

## Marketing & conversion
- Strong areas: Meta Ads, Google Ads, landing page copywriting, funnel strategy, product research, conversion optimization, tracking/attribution, ecommerce positioning.
- Evaluates ideas by profit, execution difficulty, compliance risk, scalability, maintenance cost, and speed to market.
- Prefers direct, critical analysis over agreeable brainstorming.

## SEO & content
- Focus areas: Shopify SEO, Astro/static SEO, German SEO articles, Medium SEO, Pinterest SEO, affiliate SEO, indexing strategy, internal linking, semantic page structure, image optimization.
- Article preference: dynamic templates that can render guide, comparison, review, and FAQ content while remaining SEO-friendly.
- Avoid claiming secret Google algorithm knowledge; use evidence labels and source-backed reasoning when current facts matter.

## Affiliate & monetization
- Affiliate interests: Germany-first affiliate, SaaS/tools affiliate, Amazon DE office products, Digistore24, Impact, CJ, Awin, PartnerStack, Amazon Associates.
- Preferred monetization direction: tools directory, comparison/review content, AI productivity content, office/home-office products, SEO/product research portals.
- Previously preferred tools-directory approach over broad portal/search-engine approach for affiliate software/tools.

## Skill plumbing (sumber tunggal)
- **Sumber tunggal:** `~/dotfiles/skills/local/` — **33 skill** per 2026-07-14 (dulu 43; lihat "Dedup 2026-07-14" di bawah). Repo jezweb `~/.agents/repos/shared-skills/` **TIDAK ADA di `cuan`** — klaim "104 skill" itu usang.
- **Konsumen terverifikasi (2026-07-14)**, semuanya symlink → `dotfiles/skills/local`: `~/.claude/skills`, `~/.pi/agent/skills`, `~/.agents/local-skills`.
- ⚠️ **`~/.gemini/skills` dan `~/.codex/skills` TIDAK ADA.** Gemini CLI sudah dihapus (2026-07-13). Jangan tulis "5 konsumen" lagi.

## Dedup 2026-07-14 — 43 → 33 skill
- **Dihapus (100% pointer rusak, nol konten):** `cloudflare-worker-toolkit`, `shopify-ai-toolkit-router`. Keduanya menunjuk `/home/fantastico/…` (user yang tak ada) dan ke ~26 skill yang tak pernah ada.
- **Dihapus:** `ai-terminal-project-runner`. Isinya = (a) default yang sudah dilakukan harness, (b) routing table ke skill hantu, (c) safety gates. **Safety gates-nya DIANGKAT ke `AGENTS.md` → section "Approval gates — ALWAYS ON"**, karena kebijakan wajib tidak boleh bergantung pada model memilih memanggil skill. Script-nya diselamatkan → `dotfiles/bin/inspect-project`.
- **Digabung:** 7 skill `9router-*` → `9router/references/*.md`. Satu deskripsi di system prompt, bukan delapan.
- **SENGAJA TIDAK digabung:** `copywriting` vs `content` — ter-faktor benar (rules vs workflow), dan `shopify-listing/references/copywriting.md` itu prompt subagent purpose-built, bukan salinan. Jangan "rapikan" lagi.
- **Prinsip:** kebijakan yang harus SELALU aktif → `AGENTS.md`. Pengetahuan dalam yang dipanggil sesuai kebutuhan → skill. Router murni → tidak boleh ada.
- **`skill-update` adalah satu-satunya cara sinkronisasi.** Dia fetch + `reset --hard` repo jezweb, hapus symlink terkelola, lalu relink kelima base. Pastikan repo jezweb bersih sebelum menjalankan — perubahan lokal di sana akan hilang.
- **`git pull` dotfiles TIDAK membuat symlink.** Skill baru dari device lain (mis. `vultr`) hanya muncul sebagai file; wajib `skill-update` setelah pull agar terlihat oleh CLI.
- **Jangan pakai `claude plugin install`** untuk skill yang ingin dipakai lintas-CLI — itu hanya mendaftarkan ke Claude Code dan menciptakan sumber keempat. Skill = direktori berisi `SKILL.md` di `dotfiles/skills/local/`.
- Kalau `skill-update` mencetak `Backed up existing path: ... -> *.backup.<ts>`, artinya ada direktori asli (duplikat) yang menghalangi symlink. Bandingkan dengan versi dotfiles; kalau identik, hapus backup-nya.
- Riwayat: 2026-07-10 sebelas skill (`cloudflare`, `wrangler`, `agents-sdk`, `durable-objects`, `workers-best-practices`, `sandbox-sdk`, `cloudflare-email-service`, `cloudflare-one`, `cloudflare-one-migrations`, `web-perf`, `turnstile-spin`) masih berupa direktori asli terduplikasi di beberapa konsumen dan tidak ter-sync antar-device; sudah dipindah ke dotfiles. `content`, `copywriting`, `shopify-memory` ada di dotfiles tapi tidak pernah ter-symlink sehingga tidak bisa dipanggil.

## AI workflow
- Tools in active scope: Claude Code, Codex, pi.dev, Antigravity (`agy`), local skills. (9Router ada tapi MATI — lihat environment.md.)
- Skill (`SKILL.md`) dibagikan lewat symlink; Memory dibagikan terpisah lewat `~/.config/ai/` (symlink ke `dotfiles/config/ai/`).
- Goal: standardized AI terminal workflow with shared memory, skills, project context, and repeatable execution rules.
- AI should help as critical thinking partner, architect, implementer, auditor, and workflow designer.

## Team leverage
- Often designs systems that can be operated by interns, admins, clients, or AI agents.
- Known context: has discussed using SMK interns for affiliate/content execution and systemized workflows.

## Calibration rules for AI
- Do not explain beginner web/marketing concepts unless needed.
- For strategic questions, start with biggest weakness or bottleneck when material.
- For technical questions, give concrete architecture, file structure, command flow, and risk notes.
- For business ideas, check market, margin, compliance, distribution, data/tracking, and execution capacity.

## Local-only installations (macOS-specific, NOT in dotfiles sync)
- **Ponytail** (DietrichGebert/ponytail) — coding minimalism skill + extension. Installed on this Mac only.
  - Source: `~/.pi/agent/external/ponytail` (clone)
  - Symlinks: `~/.pi/agent/skills/ponytail{,-audit,-debt,-gain,-help,-review}` + `~/.pi/agent/extensions/ponytail`
  - **Why local-only:** eksperimen pribadi, tidak mau propagate ke Linux main via dotfiles sync.
  - **How to update later:** `cd ~/.pi/agent/external/ponytail && git pull` (symlink tetap valid).
  - **Aman dari `skill-update`:** symlink target di `~/.pi/agent/external/` (luar `$REPO_DIR` & `$LOCAL_SKILLS_DIR`).
- **Konvensi umum:** skill/extension yang "coba-coba" atau "pribadi" → install ke `~/.pi/agent/external/<nama>/` + symlink manual. Skill yang sudah "approved/default" → taruh di `~/dotfiles/skills/local/` agar ter-sync via `skill-update`.
