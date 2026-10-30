---
name: meta-ads-cli
description: >-
  Automate Meta Ads campaigns, ad sets, creatives (image/video/DCO), insights, and catalogs from the terminal via the official meta-ads CLI and dotads-meta. Not Pixel/CAPI (meta-ads-signal-engine) or Ad Library research (meta-ads-scout).
---

# Meta Ads CLI

Two layers: the official `meta` CLI (`pipx install meta-ads==1.2.0`; Graph/
Marketing API calls, chunked media upload, DCO/Flexible format, insights,
guidance) and the dotfiles helper `dotads-meta` (injects `META_ACCESS_TOKEN`
from `secrets-env` into the child process, validates a declarative manifest
offline, dry-runs by default, deploys L3→L1 idempotently with SHA-256 media
caching in `.meta-state.json`). Per-account workspaces live outside dotfiles
in `~/Documents/dotads-meta-report/act_<id>--<slug>/` (`brand.json`,
`campaigns/*.json`, `media/`, `memory/`, git-ignored `.meta-state.json`).
Never commit client media or campaign state into `~/dotfiles`.

Read only this file up front; open the reference the chosen path names.

**Pick the path first:**

| Task | Do | Reference |
|---|---|---|
| First-time business/app/System User token, device bootstrap, workspace scaffold | §1 then the reference | `references/setup-and-commands.md` §1–2 |
| Plan or build a campaign from a manifest | §1 → `validate` → `deploy` (dry-run) → show plan → approval → `--apply` | `references/rules-and-tutorial.md`; commands in `setup-and-commands.md` §2–3 |
| Read-only diagnostics, insights, raw `meta` command | `dotads-meta run --brand ./brand.json -- …`; check `--help` first | `setup-and-commands.md` §3 |
| Analyze performance / ROAS | separate observation, threshold, hypothesis | `references/roas-cpr-profit-intelligence.md` |
| Indonesia market baseline (explicit `ID` market only) | `dotads-meta baseline --market ID` | `references/indonesia-market.md` |
| Account reporting workspace | runtime guide; the revision-3 design doc is historical | `references/account-workspace-runtime.md` |
| Operator onboarding / AI-terminal handoff | English contract; Bahasa guide for humans | `references/terminal-control.md`, `GUIDE.id.md` |
| A claim about API version, algorithm, or a mysterious error | source record + the 10 traps, then current official page and installed `--help` | `references/api-and-evidence.md` |
| Local repair or offline validation | inspect manifest/code, run the smallest offline check; no account access needed | — |

## 1. Gates specific to this tool

- **Dry-run first.** `dotads-meta validate <campaign.json>` and
  `dotads-meta deploy <campaign.json>` (dry-run) must be shown — budget
  summary, Advantage+ alignment, step plan — before any `--apply`.
- **Live mutation.** `deploy --apply` and raw `meta ads <resource>
  create|update|delete` change a live ad account: explicit user approval per
  CORE, every time.
- **Paused by default.** `deploy --apply` forces `PAUSED` on every object
  unless `--activate` is passed; pass `--activate` only when the user asks to
  start spend now.
- **Token path.** Only through `dotads-meta`; never print `secrets.env` or
  put `ACCESS_TOKEN` in a command argument.
- **Budgets are minor currency units** (`5000` = `$50.00`); verify the
  account currency before applying. CBO and ABO budgets never coexist.
- **Flags come from the installed binary**, not blog posts: `meta ads
  <resource> <action> --help`.

## 2. Hand-offs

Pixel/CAPI/EMQ → `meta-ads-signal-engine`; Ad Library research →
`meta-ads-scout`; headline/body/CTA rules → `copywriting`
(`references/meta-ads.md`: market locale, soft CTA, no link/price, combination
safety); creative batching → `content`. Copy is a draft until the §1 gates pass.
