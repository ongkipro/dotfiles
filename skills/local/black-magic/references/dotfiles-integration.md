# Dotfiles Integration, CLI-First Recipes & Sibling Handoffs

This reference defines how `black-magic` operates inside `~/dotfiles` across all 5 AI CLI runtimes (`claude`, `codex`, `agy`, `pi`, and `omp`), how to keep it synchronized with upstream `morluto/rea`, and how to hand off structured REA `Evidence` to specialist `dotfiles` skills for clean-room reconstruction.

---

## 1. Boundary & Ethical Guardrails (`CORE.md`)

1. **Owned Source vs Shipped Artifacts:**
   - If you already have the complete source repository on disk, **do not** run REA. Route to `codebase-navigation` (`rg` + `graphifyy`) for source-level AST and call-graph tracing.
   - Use `black-magic` when the target is a shipped artifact or runtime behavior not established by local source: production web apps, `.har`/`.saz`/`.qlog`/`.pcap` captures, Electron `.asar` bundles, minified JS trees, Android `.apk`s, `.sqlite` snapshots, `.wasm` modules, EVM bytecode, firmware images, or native ELF/PE/Mach-O/Go/Rust/Unity IL2CPP binaries.
2. **Defensive & Authorized Scope Only:**
   - Permitted: interoperability analysis, API contract discovery from user-supplied captures, competitor UX/architecture benchmarking, debugging opaque third-party SDKs, security auditing of owned/authorized targets, and clean-room feature reconstruction.
   - Prohibited: DRM/license circumvention, credential theft, unauthorized active intrusion, or exploit payload generation.
3. **Output & Secret Isolation:**
   - Never write `--save-evidence`, `export-evidence-bundle`, `extract-firmware`, or `.rea` session directories inside a tracked application repository (`~/Projects/<slug>/`). Always route reverse-engineering artifacts to `~/Documents/work/research/<slug>/`.
   - Keep `header_values: false` by default in browser/network captures and declare any sensitive tokens in `secrets` so REA redacts them before writing `Evidence`. Never pass raw secrets from `~/.config/ai-local/secrets.env` in CLI arguments.

---

## 2. CLI-First Execution (Zero Idle MCP Overhead)

Standalone `rea setup` registers global MCP servers that inject **220+ tool schemas** into every conversation across `claude`, `codex`, `agy`, and `omp`. In `~/dotfiles`, **CLI-first execution is the default**:

- Prefer an installed `rea` binary if present; otherwise run `npx -y rea-agents@6.7.0 <command> ... --json` (or `@latest` when checking newer releases).
- Every CLI command returns the canonical REA `Evidence` envelope (`id`, `kind`, `confidence`, `source`, `summary`, `data`, `limitations`, `unknowns`) on stdout.
- Use MCP registration only for temporary, explicitly approved sessions when performing multi-step stateful native decompilation (Ghidra/IDA) where keeping the analysis database open across calls avoids repeated cold imports.

### High-Frequency CLI Recipes

```bash
# 1. Environment & provider readiness (read-only)
npx -y rea-agents@6.7.0 doctor --json

# 2. HAR / SAZ / mitmproxy / aioquic qlog API & auth surface extraction
npx -y rea-agents@6.7.0 inspect-web-network-capture /abs/path/capture.har \
  --detail summary \
  --save-evidence ~/Documents/work/research/<slug>/har-evidence.json \
  --json

# 3. JavaScript / Electron ASAR or bundle tree analysis (summary-first)
npx -y rea-agents@6.7.0 analyze-javascript-application /abs/path/app.asar \
  --detail summary \
  --save-evidence ~/Documents/work/research/<slug>/js-evidence.json \
  --json

# 4. Trace a feature from an entry symbol or route seed
npx -y rea-agents@6.7.0 trace-application-feature /abs/path/app.asar \
  --seed "checkout" \
  --direction both \
  --max-depth 4 \
  --json

# 5. Compare two versions of a JS/Electron bundle
npx -y rea-agents@6.7.0 compare-javascript-applications \
  /abs/path/v1/app.asar /abs/path/v2/app.asar --json

# 6. Check Electron packaged fuses before attempting --inspect
npx -y rea-agents@6.7.0 inspect-electron-fuses /abs/path/ElectronApp --json

# 7. Passive / scenario browser capture (DOM, computed styles, storage, network)
npx -y rea-agents@6.7.0 capture-browser-scenario \
  --url "https://example.com" \
  --actions '[{"type":"wait","ms":1500}]' \
  --json

# 8. Local SQLite snapshot inspection (uses Node.js >=24.15 native DatabaseSync)
npx -y rea-agents@6.7.0 inspect-sqlite-database /abs/path/snapshot.sqlite \
  --schema-scope database \
  --json

# 9. Android APK manifest, permissions, entry points, and DEX inventory
npx -y rea-agents@6.7.0 inspect-android-package /abs/path/app.apk --json

# 10. Native ELF / Go / Rust / Unity IL2CPP / PE / WASM target-free inspection
npx -y rea-agents@6.7.0 inspect-go-binary /abs/path/binary --json
npx -y rea-agents@6.7.0 inspect-rust-binary /abs/path/binary --json
npx -y rea-agents@6.7.0 inspect-il2cpp-metadata /abs/path/global-metadata.dat --json
npx -y rea-agents@6.7.0 inspect-pe-resources /abs/path/app.exe --json
npx -y rea-agents@6.7.0 inspect-wasm-artifact /abs/path/module.wasm --json

# 11. Reconstruction coverage & behavioral parity verification
npx -y rea-agents@6.7.0 verify-reconstruction-coverage \
  --evidence ~/Documents/work/research/<slug>/js-evidence.json \
  --target /abs/path/reconstructed-src \
  --json
```

---

## 3. Upstream Auto-Sync (`rea-skill-sync`)

`skills/local/black-magic/` is a **managed fork** (`.source` + `.local-fork`) synchronized deterministically by `bin/rea-skill-sync`.

- **Why a managed fork:** `skills/local/_refresh-vendored.sh` skips any skill containing `.local-fork` so that a generic raw refresh never overwrites the `name: black-magic` frontmatter, the `< 240 char` `Not for` Codex boundary, or this `references/dotfiles-integration.md` guide.
- **How `rea-skill-sync` works:**
  - Syncs 100% of upstream `.agents/skills/reverse-engineer-anything/SKILL.md` body and all upstream `references/*.md` files (including any new `references/*.md` files added in future `morluto/rea` releases).
  - Preserves the `black-magic` frontmatter (`name: black-magic` + front-loaded `Not for` clause) and appends the `## Dotfiles integration and sibling handoffs` section to `SKILL.md`.
  - Updates `.source` and `.local-fork` with the upstream `rea-agents` package version, skill version, CLI command count (`src/cliCommandNames.ts`), and upstream commit SHA.

### Sync & Drift Commands

```bash
# Check if local black-magic is in sync with a local upstream clone (read-only)
rea-skill-sync --check --upstream-dir ~/Documents/work/research/rea-2026-10-20/rea-upstream

# Pull latest morluto/rea commits in the local clone and sync black-magic
rea-skill-sync --upstream-dir ~/Documents/work/research/rea-2026-10-20/rea-upstream --pull

# Check or sync directly against GitHub (morluto/rea main) without a local clone
rea-skill-sync --check --remote
rea-skill-sync --remote

# Emit machine-readable sync status JSON
rea-skill-sync --check --upstream-dir ~/Documents/work/research/rea-2026-10-20/rea-upstream --json
```

After `rea-skill-sync` updates any file under `skills/local/black-magic/`, run `skill-check black-magic` and `skill-map --check`.

---

## 4. Sibling Handoff Pipeline (Deconstruct $\rightarrow$ Specify $\rightarrow$ Reconstruct)

Standalone `rea` stops once it produces `Evidence`. In `~/dotfiles`, chain the extracted `Evidence` directly into the canonical specialist skill owner:

| Extracted REA Evidence / Artifact | Next `dotfiles` Owner | Handoff Contract |
|---|---|---|
| **`api-surface` / HTTP endpoints & auth headers** from `inspect-web-network-capture` (`.har`/`.saz`) or `analyze-javascript-application` | `openapi-spec` | Convert observed paths, methods, query params, status codes, and auth schemes into a validated OpenAPI 3.1/3.2 contract (`docs/openapi.yaml`). Mark unobserved error shapes as unknowns rather than inventing status codes. |
| **SQLite schema & table samples** from `inspect-sqlite-database` or browser IndexedDB/localStorage `environment-state` | `postgres-drizzle` or `supabase-stack` | Translate extracted table definitions, foreign keys, and state shapes into normalized Drizzle ORM schemas (`postgres-drizzle`) or Supabase declarative schemas + RLS policies (`supabase-stack`). |
| **DOM snapshot, computed CSS tokens, and scroll/timeline animations** from `capture-browser-scenario` / `inspect-browser-styles` | `design-taste`, `gsap-core`, `gsap-scrolltrigger`, `shadcn-ui` | Extract typography scale, OKLCH/HSL color tokens, layout grid, and motion choreography into a clean design specification (`design-taste` + `gsap-*`) or operator table/dashboard layout (`admin-dashboard` + `shadcn-ui`). |
| **E-commerce cart, variant, and checkout handoff flows** from storefront HAR/DOM captures | `storefront-ux`, `storefront-development`, `hydrogen-development` | Map observed variant state transitions, cart drawer requests, and checkout redirects into `storefront-ux` state matrices and `storefront-development` / `hydrogen-development` implementation. |
| **Ad pixel & server-side tracking payloads** (`/tr`, `/g/collect`, TikTok `/pixel/track`, `_fbp`, `_fbc`, `gclid`, `ttclid`, `event_id`) in HAR captures | `meta-ads-signal-engine`, `google-ads-signal-engine`, `tiktok-ads-signal-engine`, `hydrogen-headless-tracking` | Audit deduplication `event_id` parity, Advanced Matching SHA-256 fields, Consent Mode v2 flags (`gcs`/`gcd`), and cookie lifetime preservation against the signal-engine contracts. |
| **ELF/PE mitigations, Electron fuses, Android manifest permissions, CSP headers, and auth flows** | `application-security`, `better-auth-security` | Feed static mitigation evidence (`inspect-binary-layout`, `inspect-electron-fuses`, `inspect-android-package`) and captured session/cookie flags into `application-security` for reachable exploit & hardening review. |
| **Multi-layer feature reconstruction** from an existing app or binary | `prd-taskbreaker` $\rightarrow$ `full-stack-development` $\rightarrow$ `testing-engineering` + `ui-validation` | Turn the REA finding ledger into EARS requirements (`prd-taskbreaker`), implement cleanly across layers (`full-stack-development`), verify coverage with `verify-reconstruction-coverage` (`black-magic`), and prove browser behavior with Playwright (`ui-validation`). |
