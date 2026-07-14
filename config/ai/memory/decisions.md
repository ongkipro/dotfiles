# Decision Memory
> Durable decisions and working assumptions. Update when a decision changes. Do not treat uncertain notes as final facts.

## Development stack decisions

### Linux-first workflow
- Status: active preference.
- Decision: prefer Ubuntu/Linux, terminal-first workflow, tmux, Helix, mise/npm/pipx, and CLI tools.
- Reason: better fit for AI terminal, server/dev workflow, speed, reproducibility, and reduced GUI dependency.
- Avoid: suggesting GUI-heavy workflow as default unless user asks.

### Public frontend direction
- Status: active preference.
- Decision: Astro + Tailwind is preferred for public frontend, SEO blog, content site, affiliate portal, and headless storefront when static/SEO speed matters.
- Reason: performance, SEO, simplicity, static-first architecture, Cloudflare fit.
- Tradeoff: less ideal for very interactive admin dashboards.

### Admin/client dashboard direction
- Status: active preference.
- Decision: Next.js + React + TypeScript + Tailwind + shadcn/ui is preferred for admin panel and client dashboard when interaction complexity is high.
- Reason: component ecosystem, dashboard patterns, stateful UI, auth/admin flows.
- Tradeoff: heavier than Astro for public SEO pages.

### Shopify development direction
- Status: active preference.
- Decision: use Shopify CLI/theme workflow when working with Shopify themes, but user prefers local-dev clarity similar to Astro.
- Reason: Shopify preview/sync can feel less precise than modern Astro dev flow.
- AI should provide concrete commands, preview logic, file mapping, and safe sync instructions.

## Business decisions / preferences

### Tools directory vs broad portal
- Status: prior chosen direction for software/tools affiliate.
- Decision: tools directory/comparison/review approach is preferred over broad unfocused portal/search-engine approach.
- Reason: clearer monetization, easier topical authority, better buyer intent.

### Germany affiliate direction
- Status: active strategic focus.
- Decision: Germany-first affiliate content is a serious track, especially SaaS/tools, productivity, AI office, and Amazon DE office/home-office products.
- Avoid: low-trust ClickBank-style claims, fake income, weird spiritual/magic-cure positioning for German audience.

### KIHeute content positioning
- Status: active decision.
- Decision: KIHeute is for practical AI in office/business workflows, not AI news, AI art, crypto, programming, gaming, student content, or general AI trend commentary.
- Reason: clearer audience pain, stronger affiliate fit, less trend dependency.

### Build systems, not one-offs
- Status: durable preference.
- Decision: favor repeatable systems, SOPs, prompts, AI skills, workflow automation, and reusable assets.
- Reason: user frequently delegates to interns/admins/AI agents and wants compounding leverage.

## Memory governance decisions
- Do not store credentials, API keys, auth tokens, private keys, or raw secrets.
- Do not store family/children biodata in GitHub memory unless user explicitly confirms exact details to store.
- Do not treat conflicting Human Design/personality readings as final facts without verification.
- Prefer separating facts, assumptions, opinions, and unknowns when uncertainty matters.

## AI tooling decisions (konsolidasi 2026-07-14)
> Fakta operasional pi/9router (model aktif, status service) ada di **environment.md**, section "pi.dev + 9router". Di sini hanya KEPUTUSAN + pelajaran yang tahan lama.

### Dotfiles-coupled vs machine-coupled config
- Dotfiles-coupled (aman di-sync lintas mesin): `settings.json` (field machine-coupled HARUS di-drop/parameterize), `extensions/*`, `9router/aliases.json`, `9router/runtime-package.json`, `helix/languages.toml`.
- Machine-coupled (JANGAN di-dotfiles mentah-mentah): `~/.pi/agent/models.json` (API key + model availability varies), `~/.pi/agent/auth.json` (oauth token), `~/.pi/agent/sessions/` (history), `~/.9router/{auth,jwt-secret,machine-id,tunnel/}`.
- Pelajaran: `skills` array di settings.json pernah hardcode `/Users/feriromansyah/...` — salah mesin. Solusi: pakai auto-discovery pi (skills di `~/.pi/agent/skills/`) dan JANGAN hardcode absolute path orang lain.

### Pitfall: prefix `ocg/` ≠ 9router
- `ocg/` adalah prefix provider NATIVE pi (opencode-go), BUKAN 9router. Jangan set `defaultModel: "ocg/..."` saat `defaultProvider: "9router"` — kombinasi invalid. Model `ocg/*` diakses via provider `opencode-go`.

### Pitfall: jangan jalankan `9router --tray` bareng service
- Bentrok port 20128. Pilih salah satu.

### graphify — DITOLAK (2026-07-14), idenya diambil
- Tool: `Graphify-Labs/graphify` (MIT, Python, tree-sitter → knowledge graph). Repo sehat & aktif; **bukan** soal kualitas.
- Ditolak karena: (1) korpus kita kekecilan — README-nya sendiri mengaku di ~6 file rasio token ~1x; angka "71.5x" itu korpus campuran 52 file berisi paper+gambar; (2) `graphify install` **menyunting `~/.claude/CLAUDE.md` + `~/.codex/AGENTS.md` in-place** (`install.py`) — itu symlink ke memori bersama di dotfiles, dipakai 4 CLI; (3) pre-1.0, churn tinggi.
- **Yang diambil:** prinsip "edge menggantung harus kelihatan" (EXTRACTED vs INFERRED). Diterapkan jadi `scripts/lint-links.mjs` di repo kamus — bukan dengan memasang tool-nya.
- Jangan evaluasi ulang kecuali korpus kita berubah drastis (mis. ratusan file docs/paper jadi satu folder riset).

### Anti-pattern memory (pelajaran 2026-07-14)
- **Fakta operasional yang berubah-ubah (status service, default model, versi) jangan disalin ke banyak file.** Pernah terjadi: fakta autostart 9router tersalin 6×, dan SEMUANYA jadi salah begitu service di-disable; default model pi punya 4 jawaban bertentangan di 2 file.
- Aturan: fakta yang bisa dicek dari disk → tulis SATU kali, sebutkan **perintah verifikasinya**, jangan digandakan. Agent yang baca kontradiksi akan menebak.
