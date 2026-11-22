# Dotfiles Integration, CLI-First Recipes & Sibling Handoffs

This reference defines how `black-magic` operates inside `~/dotfiles` across all 5 AI CLI runtimes (`claude`, `codex`, `agy`, `pi`, and `omp`), how to keep it synchronized with upstream `morluto/rea`, and how to hand off structured REA `Evidence` to specialist `dotfiles` skills for clean-room reconstruction.

Pinned release for every recipe below: `rea-agents@6.10.1` (npm `latest`, tag `rea-agents-6.10.1`, 2026-11-20). Node floor for that release: `^22.23.4 || ^24.22.1 || >=26.12.1` (unchanged from 6.8.0; Node 23 and 25 are unsupported). On 2026-11-23, against the unpacked 6.10.1 package: all 34 commands in the recipes resolve and all 57 flags used are listed in their command's `--help`; the claims marked *measured* below were also run on a synthetic input. Re-verify after the next `rea-skill-sync`.

---

## 1. Boundary & Ethical Guardrails (`CORE.md`)

1. **Owned Source vs Shipped Artifacts:**
   - If you already have the complete source repository on disk, **do not** run REA. Route to `codebase-navigation` (`rg` + `graphifyy`) for source-level AST and call-graph tracing.
   - Use `black-magic` when the target is a shipped artifact or runtime behavior not established by local source: production web apps, `.har`/`.saz`/mitmproxy/`.qlog`/`.pcap` captures, Electron `.asar` bundles, minified JS trees, Android `.apk`/`.aab`, `.sqlite` snapshots, `.wasm` modules, EVM bytecode, firmware images, PyInstaller/Node SEA/Bun executables, GGUF/safetensors model files, or native ELF/PE/Mach-O/Go/Rust/Unity IL2CPP binaries.
2. **Defensive & Authorized Scope Only:**
   - Permitted: interoperability analysis, API contract discovery from user-supplied captures, competitor UX/architecture benchmarking, debugging opaque third-party SDKs, security auditing of owned/authorized targets, clean-room feature reconstruction, and agent environments (AgentEnv bundles) recorded from an instance the user owns or is allowed to mutate.
   - Prohibited: DRM/license circumvention, credential theft, unauthorized active intrusion, or exploit payload generation.
3. **Output & Secret Isolation:**
   - Never write `--evidence_output`, `evidence-export`, `extract-firmware`, `recover-javascript-sources`, `environment-build`/`environment-export` bundles, or `.rea` session directories inside a tracked application repository (`~/Projects/<slug>/`). Route reverse-engineering artifacts to `~/Documents/work/research/<slug>/`.
   - REA never overwrites an `--evidence_output` file and refuses a non-empty bundle directory; choose a fresh path per run.
   - Keep `header_values` off by default in browser captures. Declare every credential as a scenario `secrets` entry (`{secret_id, environment_variable}`) so REA redacts it; the variable must exist in the environment that starts REA. Never pass raw values from `~/.config/ai-local/secrets.env` as CLI arguments; use `secrets-env run -- npx -y rea-agents@6.10.1 ...` when a capture needs one.
   - `inspect-web-network-capture` already excludes standard auth headers (`Authorization`, `Cookie`, `Set-Cookie`) and URL userinfo. Custom key headers, query tokens and tokens in bodies remain; mark them with `--sensitive-value <literal>` for ordinary analysis. Environment views refuse captures inspected with `--sensitive-value`, so scrub a HAR before building an environment from it.

---

## 2. CLI-First Execution (Zero Idle MCP Overhead)

Standalone `rea setup` registers a stdio MCP server advertising 263 tool schemas (6.10.1 catalog, the `tool_count` in the release's own SKILL.md; 229 in 6.8.0) into every conversation across `claude`, `codex`, `agy`, `pi`, and `omp`. In `~/dotfiles`, **CLI-first execution is the default**:

- Prefer an installed `rea` binary if present; otherwise run `npx -y rea-agents@6.10.1 <command> ... --json` from a trusted directory outside the target, with absolute target paths. Use `@latest` only to check a newer release.
- `rea doctor --json` on this workstation (measured 2026-11-23 on 6.10.1) reports `registration:*` and `skill:identity` as `config_drift` and five analysis engines (`hopper`, `ghidra`, `ida-registration`, `jadx`, `kuna-installation`) as `missing_analysis_engine`, with `node` and `host` healthy; no client has REA registered. That is the intended CLI-first state, not a defect; do not run `rea setup` to "fix" it. Only `missing_analysis_engine` rows matter, and only for the lane a task needs (Ghidra via `GHIDRA_INSTALL_DIR`: **12.2 or newer on the 12.x line and a JDK of 25 or newer**. The 6.10.1 release rejects 12.1.x because its bridge does not compile there (it verified exactly 12.2, and 12.2 PUBLIC has a known jump-table defect on clang `-O0` switches that 12.2.1 fixes); `jadx-headless-mcp` 0.7.1 JAR via `REA_JADX_MCP_JAR` (the pin the release prints, with its SHA-256; `main` has moved to 0.8.0, so follow the release); Kuna via `REA_KUNA_COMMAND` (the release was verified with Kuna 1.1000; the 1.833 in the earlier text is superseded); IDA via `REA_IDA_MCP_CONFIG`; Hopper has no engine check message of its own, so read its doctor row). REA installs none of these, and none is installed here.
- Use MCP registration only for temporary, explicitly approved sessions when a multi-step stateful native session (Ghidra/IDA/Kuna `open_binary` ... `close_binary`) must stay open across calls. When registering, no schema-profile variable is needed any more: `REA_MCP_INPUT_SCHEMA_PROFILE` accepts only `compact` (the default) and `full` was removed in 6.9.0-6.10.0, and `REA_MCP_OUTPUT_SCHEMA_PROFILE` is `off` unless set to `compact` (measured in the release's own error text). `rea mcp --http --port <n>` serves the same catalog over streamable HTTP at `/mcp` to one local client. Measured in 6.10.1: it binds `127.0.0.1` by default (`--host` or `MCP_HOST` overrides), uses an ephemeral port when none is given, and refuses a non-loopback bind unless `--allowed-hosts` or `MCP_ALLOWED_HOSTS` names the hosts clients will use. `rea mcp add --command` registers a local stdio launcher only and performs no package acquisition or server execution.

### New in the synced skill (v63): what it asks of the agent

- `references/desktop-build.md` (new, 860 lines) builds an AgentEnv bundle of a Linux desktop app by driving it on a *build computer*. Its tools are MCP-only and it needs a Linux host with Docker, `agentenv` and REA's packed runtime, so it is unreachable in the CLI-first setup above and stays so unless a task explicitly authorizes MCP registration (`rea setup --client <client> --desktop-build`).
- It tells the building agent to accept no licence on anyone's behalf, to keep credentials out of the bundle (secrets are typed by handle from `~/.config/rea/build-secrets/`, never pasted), and to refuse downloading a vendor's page itself. Treat those as REA's rules for that lane; they do not widen what `CORE.md` allows here. Never put real personal data in a seed.
- The synced `SKILL.md` still shows `npx -y rea-agents@latest ...` in two places (upstream's tarball pins them to `@6.10.1`). In this repository an unpinned `npx -y` is not a default: use `@6.10.1`, as the recipes below do, and see the pin rule appended to `SKILL.md`.

### Output contract (read before the recipes)

- Global `--format <toon|json|yaml|md|jsonl>` selects the **output** format; `--json` is the short form. A command's own positional `format` argument (for example `har`) is unrelated and must stay positional. Passing `--format har` fails with `INVALID_OUTPUT_VALUE`.
- Every command returns the canonical `Evidence` envelope on stdout; stage logs go to stderr. Fields: `evidence_id` (`ev_` + SHA-256 of the canonical JSON, excluding local paths, so the same artifact yields the same ID on any machine), `subject`, `provider`, `operation`, `parameters`, `raw_result`, `normalized_result`, `confidence` (`observed|derived|inferred` only), `authority` (`shipped-artifact|controlled-replay|historical-reference|external-service|analyst-inference`), `limitations[]`, `relationship_coverage`, `locations[]`, `evidence_links[]`. There is no `unknown` confidence; unknowns live in `limitations` and coverage fields, so quote those when reporting gaps.
- `--detail summary` requires `--evidence_output <absent-file>`; the complete Evidence is written there and stdout carries the summary plus `parent_evidence_id`. Project further pages from the saved file with `inspect-analysis-view` and `{"source":{"kind":"evidence-file","path":...}}`; never paste Evidence back inline.
- Without `--detail summary`, redirect the complete JSON (`--json > file.json`); a real application's Evidence can be hundreds of megabytes.
- `--format jsonl` works only for an array or one explicit `rows|items|records|occurrences` collection (select with `--filter-output`); otherwise it returns an `unreadable_output` control record. Use `--format json` for whole documents.
- `--token-limit <n>` / `--token-offset <n>` page only the human formats (`toon`, `md`); they are rejected with `json`/`jsonl`/`yaml`. `--timings` writes one `{"rea_timings":...}` record to stderr; `--schema` prints the command's JSON Schema; every JSON positional (`<inputJson>`, manifest and evidence paths) accepts inline JSON, a file path, or `-` for stdin (8 MiB cap).
- Skill text versus release: with the sync pinned to the `rea-agents-6.10.1` tag, the vendored skill (v63) is the skill the release ships, plus the dotfiles section. The npm tarball differs from the tag in exactly three lines: frontmatter `tool_count: 263`, and the two `npx -y rea-agents@latest` examples pinned to `@6.10.1`. Do not sync from `main`: on 2026-11-22 it was 785 commits ahead of the tag, and the `main` skill already describes behavior the release lacks (Hex-Rays `.idb`/`.i64` input, the JADX 0.8.0 pin). All five commands that were absent from 6.8.0 (`compare-artifacts`, `guidance`, `guided-workflows`, `inspect-android-jni-bindings`, `validate-browser-scenario`) exist in 6.10.1; the release lists 204 CLI commands in `--help` (the figure `.source` cannot derive from source and records as `unknown`). Still confirm any command with `npx -y rea-agents@6.10.1 <command> --help` before relying on it.

### High-Frequency CLI Recipes

```bash
R="npx -y rea-agents@6.10.1"
OUT=~/Documents/work/research/<slug>

# 1. Environment & provider readiness (read-only; registrations are expected "missing")
$R doctor --json

# 2. HAR / Fiddler SAZ / mitmproxy / aioquic qlog: API & auth surface (positional format!)
$R inspect-web-network-capture /abs/path/capture.har har \
  --detail summary --evidence_output $OUT/har-evidence.json --json
$R inspect-analysis-view "{\"source\":{\"kind\":\"evidence-file\",\"path\":\"$OUT/har-evidence.json\"},\"view\":{\"kind\":\"api-surface\",\"offset\":0,\"limit\":50}}" --json
#   other view kinds on the same file: summary, environment-manifest, environment-state,
#   environment-coverage; add --sensitive-value <literal> to the inspect step for custom tokens.

# 3. JavaScript / Electron ASAR or extracted bundle tree (summary-first)
$R analyze-javascript-application /abs/path/app.asar \
  --detail summary --evidence_output $OUT/js-evidence.json --json
$R inspect-analysis-view "{\"source\":{\"kind\":\"evidence-file\",\"path\":\"$OUT/js-evidence.json\"},\"view\":{\"kind\":\"page\",\"collection\":\"modules\",\"offset\":0,\"limit\":32}}" --json

# 4. Feature trace / version comparison / reconstruction coverage take a workflow JSON
#    (inline or file). Read references/javascript-applications.md for the exact shapes;
#    print the schema first instead of guessing fields:
$R trace-application-feature --schema
$R compare-application-versions --schema
$R evaluate-reconstruction-coverage --schema

# 5. Electron packaged fuses before any --inspect attempt
$R inspect-electron-fuses /abs/path/ElectronApp --json

# 6. Scripted browser capture (DOM, accessibility, storage, network); scenario JSON per
#    references/environments.md and references/runtime-observation.md
$R capture-browser-scenario $OUT/scenario.json --json > $OUT/scenario-evidence.json

# 7. Live page JS bundles via CDP (chromium --remote-debugging-port=9222 on a page you own)
$R list-browser-targets http://127.0.0.1:9222 --json
$R analyze-web-bundle http://127.0.0.1:9222 <targetId> --fetch-source-maps \
  --detail summary --evidence_output $OUT/bundle-evidence.json --json
$R recover-javascript-sources /abs/path/chunk.js $OUT/recovered --json   # wakaru lane; never executes

# 8. SQLite snapshot (Node >=24.15 native DatabaseSync); copy a quiescent db+WAL pair first
$R inspect-sqlite-database /abs/path/snapshot.sqlite --schema-scope database --json
$R inspect-sqlite-database /abs/path/snapshot.sqlite --table orders --column id --column status --row-limit 50 --json

# 9. Android: manifest/components/permissions, then signing identity (v1/v2/v3/v3.1 schemes)
$R inspect-android-package /abs/path/app.apk --json
$R inspect-apk-signature /abs/path/app.apk --detail summary --evidence_output $OUT/apk-sig.json --json

# 10. Target-free native/packaged inspection (no Ghidra/IDA needed)
$R inspect-go-binary /abs/path/binary --json
$R inspect-rust-binary /abs/path/binary --json
$R inspect-il2cpp-metadata /abs/path/global-metadata.dat --json
$R inspect-native-exports /abs/path/lib.so --json
$R inspect-elf-notes /abs/path/binary --json            # GNU build-id, ABI tag
$R inspect-pe-imports /abs/path/app.exe --json           # DLLs, ordinals, import hash
$R inspect-pe-certificates /abs/path/app.exe --json      # Authenticode identity (not verification)
$R inspect-pe-load-config /abs/path/app.exe --json       # TLS callbacks, CFG/SafeSEH declarations
$R inspect-pe-resources /abs/path/app.exe --json
$R inspect-wasm-artifact /abs/path/module.wasm --json    # needs REA_WABT_BIN_DIRECTORY
$R inspect-desktop-application /abs/path/install-dir --detail summary --evidence_output $OUT/desktop.json --json
$R inspect-python-pyc /abs/path/module.pyc --json
$R inspect-model-artifact /abs/path/model.gguf --json    # header only; --hash full streams weights
$R inspect-byte-entropy /abs/path/file --json            # packed/encrypted region triage

# 11. Agent environment (AgentEnv bundle) from a HAR: dry-run, then build into an absent dir
$R environment-build /abs/path/session.har --dry-run --name <env-name> --json
$R environment-build /abs/path/session.har $OUT/agentenv --name <env-name> --json
#   run: agent-env run $OUT/agentenv   (AgentEnv framework 0.9.1334 + Docker, user-installed;
#   the Dockerfile installs rea-agents@6.10.1 (measured) and serves MCP over streamable HTTP on port 18765)
#   serve without Docker: $R environment-serve $OUT/agentenv/envs/<env-name>/manifest.json \
#     --evidence $OUT/agentenv/envs/<env-name>/evidence.json --port 8765
#   fidelity: $R environment-compare <manifest.json> --evidence <capture.json> --probe <probe.json> --json
#   writes are served only when a later recorded read confirmed the effect; withheld reasons:
#   no-state-target, no-call, body-unusable, no-observation, unexplained-change, contradicted,
#   side-effect, unconfirmed, incomplete-entities, unknown-clock (hints in references/environments.md)

# 12. Dynamic lanes (explicit authorization; mutate or attach to a process)
$R instrument-with-frida spawn /abs/path/program --script-file $OUT/hook.js --duration-ms 3000 --json
$R capture-process --help     # read the contract before any attach
```

Measured on 2026-11-23 against the unpacked 6.10.1 package with a synthetic 2-record HAR (one GET, one POST, scratch directory under `/tmp`, no network): `--format har` fails with `INVALID_OUTPUT_VALUE` (the accepted values are now `toon, json, yaml, md, jsonl, csv, tsv`); recipe 2 wrote the evidence file and the `api-surface` view returned two endpoint groups with the GET and POST; recipe 11 `--dry-run` reported `tool_count: 1`, `coverage.reads.state: 1`, `writes.served: []` and the one write withheld as `no-observation`, and the real build wrote `README.md`, `envs/<name>/{env.toml,Dockerfile,manifest.json,evidence.json}`, `artifacts/check_<name>/verify.py` and `tasks/smoke.json`. The earlier 6.8.0 figures (2 endpoints, `tool_count: 2`) came from a different synthetic file and are not comparable.

---

## 3. Upstream Auto-Sync (`rea-skill-sync`)

`skills/local/black-magic/` is a **managed fork** (`.source` + `.local-fork`) synchronized deterministically by `bin/rea-skill-sync`.

- **Why a managed fork:** `skills/local/_refresh-vendored.sh` skips any skill containing `.local-fork` so that a generic raw refresh never overwrites the `name: black-magic` frontmatter, the `< 240 char` `Not for` Codex boundary, or this `references/dotfiles-integration.md` guide.
- **How `rea-skill-sync` works:**
  - Syncs 100% of upstream `.agents/skills/reverse-engineer-anything/SKILL.md` body and all upstream `references/*.md` files, including files that first appear upstream (for example `references/environments.md`, added with 6.8.0).
  - Preserves the `black-magic` frontmatter (`name: black-magic` + front-loaded `Not for` clause) and appends the `## Dotfiles integration and sibling handoffs` section to `SKILL.md`.
  - Updates `.source` and `.local-fork` with the upstream `rea-agents` package version, skill version, CLI command count, and upstream commit SHA. The count comes from `src/contracts/cliCommandNames.ts` (`src/cliCommandNames.ts` before rea-agents 6.10.0). From 6.10.0 that file lists only part of the commands (the rest come from contracts declaring `cli: true`), so `.source` then records `primary_cli_commands: unknown` instead of a partial tally.
- **After every sync:** the pinned version in this file, the recipes above, and the `development-kit` ecosystem-adoption row are hand-maintained. Re-run the smoke commands in section 2 against the new pin and fix any renamed flag before committing.

### Sync & Drift Commands

```bash
# Check if local black-magic is in sync with a local upstream clone (read-only)
rea-skill-sync --check --upstream-dir <a clone of morluto/rea checked out at the tag you are pinning, e.g. rea-agents-6.10.1>

# Pull latest morluto/rea commits in the local clone and sync black-magic
rea-skill-sync --upstream-dir <clone at the pinned tag>   # no --pull: a pull moves a tag checkout to a branch tip

# Check or sync directly against GitHub without a local clone. Pin the release tag: `main` runs
# hundreds of commits ahead of npm and its skill text describes behavior the release lacks.
rea-skill-sync --check --remote --ref rea-agents-6.10.1
rea-skill-sync --remote --ref rea-agents-6.10.1

# Emit machine-readable sync status JSON
rea-skill-sync --check --remote --ref rea-agents-6.10.1 --json
```

After `rea-skill-sync` updates any file under `skills/local/black-magic/`, run `skill-check black-magic`, `skill-map --check`, and `rea-skill-sync-test`.

---

## 4. Sibling Handoff Pipeline (Deconstruct → Specify → Reconstruct)

Standalone `rea` stops once it produces `Evidence`. In `~/dotfiles`, chain the extracted `Evidence` directly into the canonical specialist skill owner:

| Extracted REA Evidence / Artifact | Next `dotfiles` Owner | Handoff Contract |
|---|---|---|
| **`api-surface` view** from `inspect-web-network-capture` / `analyze-web-bundle` / `analyze-javascript-application` routes | `openapi-spec` | Convert observed paths, methods, query params, status codes, and auth schemes into a validated OpenAPI 3.1/3.2 contract (`docs/openapi.yaml`). Mark unobserved error shapes as unknowns rather than inventing status codes. |
| **AgentEnv bundle** (`environment-build`) of a third-party or legacy API | `testing-engineering`, `agents-sdk` | Serve the bundle (`environment-serve` or `agent-env run`) as a deterministic contract fixture for integration tests and agent evals; only writes the recording confirmed are served, so withheld writes stay explicit test gaps, never mocks. |
| **SQLite schema & table samples** from `inspect-sqlite-database`, or browser IndexedDB/localStorage from a scenario capture | `postgres-drizzle` or `supabase-stack` | Translate extracted table definitions, foreign keys, and state shapes into normalized Drizzle schemas (`postgres-drizzle`) or Supabase declarative schemas + RLS policies (`supabase-stack`). |
| **DOM/accessibility snapshot, computed styles, and motion timing** from `capture-browser-scenario` | `design-taste`, `gsap-core`, `gsap-scrolltrigger`, `shadcn-ui` | Extract typography scale, color tokens, layout grid, and motion choreography into a clean design specification (`design-taste` + `gsap-*`) or operator table/dashboard layout (`admin-dashboard` + `shadcn-ui`). |
| **E-commerce cart, variant, and checkout handoff flows** from storefront HAR/DOM captures | `storefront-ux`, `storefront-development`, `hydrogen-development` | Map observed variant state transitions, cart requests, and checkout redirects into `storefront-ux` state matrices and `storefront-development` / `hydrogen-development` implementation. |
| **Ad pixel & server-side tracking payloads** (`/tr`, `/g/collect`, TikTok `/pixel/track`, `_fbp`, `_fbc`, `gclid`, `ttclid`, `event_id`) in HAR captures | `meta-ads-signal-engine`, `google-ads-signal-engine`, `tiktok-ads-signal-engine`, `hydrogen-headless-tracking` | Audit deduplication `event_id` parity, Advanced Matching SHA-256 fields, Consent Mode v2 flags (`gcs`/`gcd`), and cookie lifetime preservation against the signal-engine contracts. |
| **Static integrity & mitigation evidence**: `inspect-apk-signature`, `inspect-pe-certificates`, `inspect-pe-load-config`, `inspect-pe-imports`, `inspect-elf-notes`, `inspect-binary-layout`, `inspect-electron-fuses`, Android manifest permissions, CSP/session headers | `application-security`, `better-auth-security` | Feed signer identity, linker-declared mitigations, import surface, fuse state and captured cookie/session flags into `application-security` for reachable-exploit and hardening review. REA reports identity and self-consistency, never a trust verdict; the security skill owns that judgment. |
| **Multi-layer feature reconstruction** from an existing app or binary | `prd-taskbreaker` → `full-stack-development` → `testing-engineering` + `ui-validation` | Turn the REA finding ledger into EARS requirements (`prd-taskbreaker`), implement cleanly across layers (`full-stack-development`), score coverage with `evaluate-reconstruction-coverage` (`black-magic`), and prove browser behavior with Playwright (`ui-validation`). |

---

## 5. Ecosystem Position (rechecked 2026-11-23)

`morluto/rea` is the dominant agent reverse-engineering project on GitHub (MIT; about 474k stars and 116k forks, last push 2026-11-22). The alternatives in the current ecosystem are either engines REA already drives as providers (`mrexodia/ida-pro-mcp`, headless JADX, Ghidra, Hopper, Kuna, Rizin, Frida, GDB, objdump) or narrower single-lane MCP servers (GhidraMCP, Binary Ninja MCP, Charles/Android proxy MCPs, JS-reverse CDP hooks). `LING71671/open-reverselab` (Apache-2.0 as of 2026-11-23, about 1.4k stars; it was GPL-3.0 when this section was written on 2026-10-30) adds Windows-centric dynamic lanes (x64dbg, Procmon, YARA) and CTF web tooling; it is a parallel platform, not a REA extension. Deliberate non-adoption: no second RE skill, no third-party RE platform vendored into dotfiles (licence was not the only reason: its lanes are Windows-centric and outside this skill's scope; re-evaluate on need, not on licence), no WAF-evasion or anti-detection browser lanes. Revisit when a task needs x64dbg scripting or Binary Ninja, which REA does not provide.
