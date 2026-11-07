---
name: meta-ads-cli
description: >-
  Automate Meta Ads campaigns, ad sets, creatives (image/video/DCO), insights, and catalogs from the terminal via the official meta-ads CLI and dotads-meta. Not Pixel/CAPI (meta-ads-signal-engine) or Ad Library research (meta-ads-scout).
---

# Meta Ads CLI

Two layers: the official `meta` CLI (`pipx install meta-ads`; verified 1.3.1 with SDK 26.0.2 on 2026-11-04; Graph/
Marketing API calls, chunked media upload, DCO/Flexible format, insights,
guidance) and the dotfiles helper `dotads-meta` (injects `META_ACCESS_TOKEN`
from `secrets-env` into the child process, validates a declarative manifest
offline, dry-runs by default, deploys L3→L1 idempotently with SHA-256 media
caching in `.meta-state.json`). Named env profiles automatically prepare BM roots outside dotfiles:
`~/Documents/dotads-meta-report/<bm-name>--bm_<id>/<Account Name> (act_<id>)/`.
Campaigns, notes and Markdown reports stay account-local; reusable assets live
under the BM's `assets/` (optional temporary copies, never auto-deleted).
Internal JSON retains state/provenance. Legacy flat roots remain unchanged.
For onboarding, **the AI prepares the env; the operator fills one token line**.
Follow `references/setup-and-commands.md` §0: preserve existing credentials,
resolve BM metadata once, then run setup and verify the actual directory. Do
not ask the operator to rebuild configuration or treat a detection error as an
invalid token. Env preparation needs authorization; setup/pull do not edit secrets.
Use `setup --workspace-only` offline, and `--bm KEY` when multiple BMs exist.
Preferred env names are `meta_ads_token_<label>` + required
`meta_ads_bm_id_<label>`, with optional `meta_ads_bm_name_<label>`.
Use `--bm autolaris` for `meta_ads_token_autolaris`; selection is case-insensitive.
Existing `META_ACCESS_TOKEN_<KEY>` works with explicit `META_BM_<KEY>_ID`
and optional `_NAME`; preserve its exact `token_env` and select `--bm <KEY>`.
Legacy `META_BM_<KEY>_NAME`, `_ID`, `_ACCESS_TOKEN` stays supported; never define
multiple token formats for one BM or silently rewrite existing token bindings.
Local token presence is not proof of live access.
Never commit client media or campaign state into `~/dotfiles`.

Read only this file up front; open the reference the chosen path names.

**Pick the path first:**

| Task | Do | Reference |
|---|---|---|
| Device/env onboarding, then business/app/System User access | Setup reference §0 first: AI prepares missing env, human fills only token, verify actual folder; provisioning only as needed | `references/setup-and-commands.md` §0–2 |
| Plan or build a campaign from a manifest | §1 → `validate` → `deploy` (dry-run) → show plan → approval → `--apply` | `references/rules-and-tutorial.md`; commands in `setup-and-commands.md` §2–3 |
| Read-only diagnostics, insights, raw `meta` command | `dotads-meta run --brand ./brand.json -- …`; check `--help` first | `setup-and-commands.md` §3 |
| Analyze performance / ROAS | separate observation, threshold, hypothesis | `references/roas-cpr-profit-intelligence.md` |
| How Meta delivery/learning works now, learning phase, 2026 measurement changes, turning evidence into hypotheses, improving ads | Read before `learn record` beyond observation or any optimization advice | `references/algorithm-and-learning.md` |
| Shopee CPAS / Collaborative Ads (marketplace catalog segment, retailer pixel, `1-1-1` Direct-to-App `CAROUSEL_DPA`, Pure Carousel vs Collection `da_collection` / `asset_feed_spec`, in-place creative hot-swap, `InApp_SDK` vs `app_site_visit`, `catalog_segment_*` results, settlement economics) | Read before planning, reading or judging any campaign that sends traffic to Shopee | `references/cpas-collaborative-ads.md`; Recipe 5 in `references/rules-and-tutorial.md` |
| Indonesia market baseline (explicit `ID` market only) | `dotads-meta baseline --market ID` | `references/indonesia-market.md` |
| Five-window account history / observational learning | `history --account act_ID --plan`, then authorized read or selected imports; full returned Markdown evidence feeds scoped account memory, never automatic winners/spend | `references/account-workspace-runtime.md` §Five-window account history |
| Account learning lifecycle / private cross-device handoff | `learn list/record/export/import --account act_ID`; exact evidence and stage protocols, same BM/account; offline bundles only, no automatic transfer | `references/account-workspace-runtime.md` §Account learning and private cross-device handoff |
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
  CORE, every time. The only exception is a dated standing approval that the
  owner wrote himself (never an agent) in that account's `NOTES.md`, naming one
  account and one spend-reducing action class (pause, or a budget decrease; never
  `--activate`, a budget increase or new objects) and an expiry. Apply it only with
  a before/after read logged in the same `NOTES.md`; an entry an agent cannot
  attribute to the owner counts as absent. Detection rules (stop-loss, leak
  response, comment hygiene) are decision thresholds: they produce a proposal.
- **Paused by default.** `deploy --apply` forces `PAUSED` on every object
  unless `--activate` is passed; pass `--activate` only when the user asks to
  start spend now.
- **Token path.** Only through `dotads-meta`; never print `secrets.env` or
  put `ACCESS_TOKEN` in a command argument.
- **Budgets are minor currency units** (`5000` = `$50.00`); verify the
  account currency before applying. CBO and ABO budgets never coexist.
- **Campaign label (`dotads: ` prefix).** Every campaign created through `dotads-meta` (`deploy` or `run -- ads campaign create`) must carry the `dotads: <campaign_name>` prefix (`dotads-meta` warns during `validate` and auto-prefixes `dotads: ` at creation time).
- **Flags come from the installed binary**, not blog posts: `meta ads
  <resource> <action> --help`.

## 2. Hand-offs

Pixel/CAPI/EMQ and 2026 Pixel changes → `meta-ads-signal-engine`; Ad Library research →
`meta-ads-scout`; headline/body/CTA rules → `copywriting`
(`references/meta-ads.md`: market locale, soft CTA, no link/price, combination
safety); creative batching → `content`. Copy is a draft until the §1 gates pass.
