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

## AI tooling decisions (diperbarui 2026-07-07)

### pi default model
- Sebelumnya: `ocg/deepseek-v4-pro` (provider 9router) — prefix `ocg/` adalah provider NATIVE pi, bukan 9router → kombinasi tidak valid; model juga sudah hilang dari 9router.
- Sekarang: `cx/gpt-5.4-mini` (provider 9router) — model reasoning mini/hemat, konsisten dengan 9router route. Ganti via `/model` di TUI atau edit `defaultModel` di settings.json.

### 9router autostart per OS
- Linux (systemd --user): `~/.config/systemd/user/9router.service`, headless `custom-server.js`, bind 127.0.0.1:20128, Restart=always, enabled default.target. Jangan jalankan manual tray (`9router --tray`) bareng service — bentrok port.
- macOS (launchd): `~/Library/LaunchAgents/com.9router.autostart.plist`, headless custom-server.js, bind 127.0.0.1:20128, RunAtLoad + KeepAlive.

### Dotfiles-coupled vs machine-coupled config
- Dotfiles-coupled (aman di-sync lintas mesin): `settings.json` (field machine-coupled HARUS di-drop/parameterize), `extensions/*`, `9router/aliases.json`, `9router/runtime-package.json`, `helix/languages.toml`.
- Machine-coupled (JANGAN di-dotfiles mentah-mentah): `~/.pi/agent/models.json` (API key + model availability varies), `~/.pi/agent/auth.json` (oauth token), `~/.pi/agent/sessions/` (history), `~/.9router/{auth,jwt-secret,machine-id,tunnel/}`.
- Pelajaran: `skills` array di settings.json pernah hardcode `/Users/feriromansyah/...` — salah mesin. Solusi: pakai auto-discovery pi (skills di `~/.pi/agent/skills/`) dan JANGAN hardcode absolute path orang lain.

## AI tooling decisions (linux setup, 2026-07-07)

### pi default (per dotfiles, kedua mesin)
- Provider `opencode-go` (native pi), model `minimax-m3`, thinking `high`, theme `dark`. Extension `pi-image-gen` untuk image-gen (lewat 9router). Ganti model via `/model`.

### 9router autostart per OS
- Linux: **systemd --user** `~/.config/systemd/user/9router.service`, headless `custom-server.js`, `127.0.0.1:20128`, `Restart=always`.
- macOS: **launchd** `~/Library/LaunchAgents/com.9router.autostart.plist`, RunAtLoad + KeepAlive.
- JANGAN jalankan `9router --tray` manual bareng service (bentrok port 20128).

### Pitfall: prefix `ocg/` ≠ 9router
- `ocg/` adalah prefix provider NATIVE pi (opencode-go), BUKAN 9router. Jangan set `defaultModel: "ocg/..."` saat `defaultProvider: "9router"` — kombinasi invalid. Model `ocg/*` diakses via provider `opencode-go`.
