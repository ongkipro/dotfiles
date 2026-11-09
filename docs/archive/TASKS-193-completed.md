# TASK-193 — completed

Moved from `TASKS.md` on 2026-11-05 (TASK-194 housekeeping).

### TASK-193: CPAS (Shopee Collaborative Ads) knowledge for dotads-meta
- **Requirement:** REQ-META-CPAS-KNOWLEDGE (owner 2026-11-05: dig into Shopee to Meta via CPAS for skill, memory, system and working method; CPAS differs from ordinary ads).
- **Risk Level:** R1.
- **Allowed Paths:** `skills/local/meta-ads-cli/**`, `config/ai/memory/meta-ads.md`, `TASKS.md`, `CHANGELOG.md`, `docs/archive/TASKS-192-completed.md`, `docs/DOTFILES_SITEMAP.md`.
- **Protected Paths:** `config/ai/project-memory/tokophi-repo-private-ruling.md`.
- **Canonical Contract Owners:** `meta-ads-cli/references/cpas-collaborative-ads.md`; private research report `~/Documents/work/research/Shopee CPAS Meta ads system/`.
- **Accepted Invariants:** claims labeled Meta/Shopee/third-party/local with sources; no invented fees or guaranteed results; provider/code unchanged (design only).
- **Regression Checks:** `skill-check meta-ads-cli`, link check, `ai-policy-lint`, `system-map --check`, `security-check`.
- **Reopen Conditions:** Meta changes the Collaborative Ads fields or Shopee changes fee rules.
- **Non-Scope:** provider/CLI implementation; live accounts; commit/push.
- **Escalation Conditions:** a claim needs a live account read or a credential.
- **Ledger:** RUN-20261105T102402Z-288c8103 PASS; commit 21e44fc.
