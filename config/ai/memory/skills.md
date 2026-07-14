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

## Dotfiles = penghubung AI ↔ device ↔ memori (kontrak, 2026-07-14)

Tiga lapis, dipisah menurut **seberapa sering dibayar**:

| Lapis | Lokasi | Kapan dibaca | Aturan |
|---|---|---|---|
| **1. Aturan** | `~/.config/ai/AGENTS.md` | SELALU, tiap request, di 4 CLI | **Jaga kecil** (target ≤120 baris) — biayanya dikali empat. Kebijakan wajib (approval gates, disiplin kode) HARUS di sini, bukan di skill. |
| **2. Memori** | `~/.config/ai/memory/*.md` | saat perlu | Fakta yang bisa dicek dari disk → tulis SEKALI + sertakan perintah verifikasinya. **Disk menang atas memori** kalau bertentangan. |
| **3. Skill** | `~/dotfiles/skills/local/` | on-demand | Pengetahuan dalam. Router murni dilarang. |

**Penyebut terkecil 4 CLI**: semuanya baca `AGENTS.md`, semuanya bisa baca file + jalankan shell. Jadi protokol antar-AI = **AGENTS.md kasih tahu di mana barangnya; sisanya cuma file.** JANGAN pakai sistem plugin per-CLI (bikin sumber kedua).

**Cek kesehatan seluruh rantai di device manapun: `ai-doctor`** (`dotfiles/bin/ai-doctor`). Memeriksa repo, AGENTS.md ke tiap CLI, memori, symlink skill, symlink menggantung, security guard, dan status login CLI. FAIL = rusak, WARN = jalan tapi belum lengkap.

## CLI routing — siapa mengerjakan apa (2026-07-14, dari user)
- **claude** = development global: arsitektur, konteks panjang, refactor besar, rencana, riset. Skill: OTOMATIS.
- **pi** = all-in-one: kerja harian di terminal. Skill: OTOMATIS.
- **codex** = logic: patch terfokus, code review, debugging, pendapat kedua. Skill: baca manual.
- **agy** = UI/UX + development kecil: visual, preview, artefak. Skill: baca manual.
- ⚠️ **codex BELUM login di `cuan`** (`~/.codex/auth.json` tak ada) — Linux ini baru diinstall, masih persiapan. Jalankan `codex login` sebelum mengandalkan codex. Bukan bug.
- **codex & agy tidak punya direktori skill** — sistem mereka plugin (`plugin.json`), format beda. `agy plugin validate` menolak `SKILL.md` kita. **Jangan dibungkus jadi plugin** = sumber kedua + beban sync. Cukup: jalankan `skill-list`, lalu baca `~/dotfiles/skills/local/<nama>/SKILL.md` langsung.

## Skill plumbing — MODEL: symlink SATU-DIREKTORI (2026-07-14)

```
~/.claude/skills       ─┐
~/.pi/agent/skills     ─┼─→ ~/dotfiles/skills/local/   (33 skill)
~/.agents/local-skills ─┘
```

- **Sumber tunggal:** `~/dotfiles/skills/local/`. Repo jezweb SUDAH DIBUANG (`~/.agents/repos/shared-skills` tak pernah ada di `cuan`; klaim "104 skill" itu usang).
- 🔑 **SINKRON LINTAS DEVICE = `git pull` SAJA.** Tidak ada langkah tambahan. Skill baru muncul sendiri; skill yang dihapus hilang sendiri — di semua CLI sekaligus. Catatan lama *"`git pull` TIDAK membuat symlink, wajib `skill-update`"* kini **SALAH** — itu berlaku untuk model per-skill yang sudah dibuang.
- `skill-update` sekarang **cuma dipakai SEKALI per mesin baru** (dan dipanggil otomatis oleh `install.sh` / `install-macos.sh`). Idempoten — aman dijalankan ulang, no-op kalau sudah benar. Perlu lagi hanya kalau pasang CLI baru.
- `skill-new` / `skill-remove` **tidak lagi perlu sync** — langsung aktif/hilang di semua CLI.
- ⚠️ `~/.gemini/skills` dan `~/.codex/skills` **TIDAK ADA** dan bukan target. Gemini CLI dihapus 2026-07-13. `skill-update` sengaja MELEWATI CLI yang belum terpasang, bukan membuatkan foldernya.

### ☠️ Bug destruktif yang sudah diperbaiki — jangan dihidupkan lagi
`skill-update` versi LAMA memakai model **symlink per-skill**. Kalau target (`~/.claude/skills`) ternyata sudah berupa symlink satu-direktori ke sumber, `backup_conflict()` akan **`mv` setiap direktori skill ASLI di dalam dotfiles** jadi `*.backup.<ts>`, lalu bikin symlink yang menunjuk dirinya sendiri → `Too many levels of symbolic links`. **Seluruh 33 skill lenyap.** Sudah direproduksi di sandbox (2026-07-14).
- Versi baru punya guard keras: **menolak menyentuh path apa pun yang resolve ke DALAM `skills/local`**.
- Catatan lama *"kalau `skill-update` mencetak `Backed up existing path` itu artinya ada duplikat, hapus saja backup-nya"* → **BERBAHAYA, itu justru bunyi bencananya.** Sudah tidak berlaku.

### Device baru / laptop lain — cukup ini
```bash
git clone git@github.com:ongkipro/dotfiles.git ~/dotfiles
cd ~/dotfiles && ./install.sh        # macOS: ./install-macos.sh
# selesai — skill, AGENTS.md, memory sudah ter-link ke semua CLI yang terpasang.
```
Sesudahnya, update = `git pull` saja. Kalau pasang CLI baru belakangan (mis. baru install Claude Code): `skill-update` sekali.

## Dedup 2026-07-14 — 43 → 33 skill
- **Dihapus (100% pointer rusak, nol konten):** `cloudflare-worker-toolkit`, `shopify-ai-toolkit-router`. Keduanya menunjuk `/home/fantastico/…` — user yang **TIDAK ADA** — dan ke ~26 skill yang tak pernah ada.
- **Dihapus:** `ai-terminal-project-runner`. Isinya = (a) default yang sudah dilakukan harness, (b) routing table ke skill hantu, (c) safety gates. **Safety gates-nya DIANGKAT ke `AGENTS.md` → section "Approval gates — ALWAYS ON"**, karena kebijakan wajib tidak boleh bergantung pada model memilih memanggil skill. Script-nya diselamatkan → `dotfiles/bin/inspect-project`.
- **Digabung:** 7 skill `9router-*` → `9router/references/*.md`. Satu deskripsi di system prompt, bukan delapan.
- **SENGAJA TIDAK digabung:** `copywriting` vs `content` — ter-faktor benar (rules vs workflow), dan `shopify-listing/references/copywriting.md` itu prompt subagent purpose-built, bukan salinan. Jangan "rapikan" lagi.
- **Prinsip:** kebijakan yang harus SELALU aktif → `AGENTS.md`. Pengetahuan dalam yang dipanggil sesuai kebutuhan → skill. Router murni → tidak boleh ada.

## Skill `native-first` (baru, 2026-07-14)
- Menjawab SATU pertanyaan: **"platform-nya sudah punya ini belum?"** — dipanggil sebelum `npm i`, sebelum bikin abstraksi/wrapper, sebelum pilih cara validasi.
- 8 reference: `next-react`, `astro`, `node-ts`, `cloudflare`, `vercel`, `data` (Postgres+Drizzle+better-auth), `shopify`, `selfhost` (Docker/Coolify/Vultr). Baca SATU sesuai stack, jangan semua.
- Isinya juga **perintah validasi terkecil per stack** + gotcha yang sudah pernah kita bayar (Nixpacks gagal utk monorepo, `next start` tak melayani `public/uploads`, `@tokophi/db` throw saat build).
- ⚠️ **PHP/Laravel SENGAJA TIDAK ada** — nol jejak PHP di semua project (2026-07-14). "CMS ala WordPress" (`volumecms`) itu **Next.js**, bukan PHP. Jangan tambah panduan PHP tanpa project PHP nyata.
- Trigger sengaja SEMPIT (momen keputusan: mau install / mau bikin abstraksi / mau validasi), BUKAN "semua tugas dev" — trigger lebar itu dosa `ai-terminal-project-runner` yang sudah dibuang.
- **Jangan pakai `claude plugin install`** untuk skill yang ingin dipakai lintas-CLI — itu hanya mendaftarkan ke Claude Code dan menciptakan sumber kedua. Skill = direktori berisi `SKILL.md` di `dotfiles/skills/local/`.
- Riwayat: 2026-07-10 sebelas skill Cloudflare/web-perf masih berupa direktori asli terduplikasi di beberapa konsumen; sudah dipindah ke dotfiles. Sejak model satu-direktori (2026-07-14), duplikasi semacam itu tak bisa terjadi lagi.

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
