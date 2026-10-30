# Completed task record — TASK-159

Moved from `TASKS.md` on 2026-10-30 after the delivery ledger recorded PASS
(`RUN-20261030T072206Z-6964ce12` implementation, `RUN-20261030T081658Z-3bba7422`
polish, `RUN-20261030T115747Z-e406a0d8` whole-reference review). Evidence lives
in `.delivery/`; this file is the historical contract.

## TASK-159: Market-aware Meta Ads copy
- **Requirement:** REQ-META-COPY: owner-approved soft CTA; no link/LP/price; locale-native.
- **Risk Level:** R2.
- **Allowed Paths:** copywriting `SKILL.md` + `references/meta-ads.md`, meta-ads-cli `SKILL.md`, writer `references/ads.md`, `skills/local/README.md`, `docs/DOTFILES_SITEMAP.md`, `TASKS.md`.
- **Canonical Contract Owners:** copywriting rules; writer locale; meta-ads-cli execution.
- **Accepted Invariants:** Meta-only CTA exception; Shopify no-CTA; no invented claim, algorithm formula, or auto-publish.
- **Regression Checks:** skills, policy, self-test, diff; independent ID/MY, description, combination, policy, Shopify review.
- **Reopen Conditions:** policy drift, locale mix, lost qualifiers, house rules sold as Meta rules.
- **Non-Scope:** live accounts, campaigns, SDK, commit/push.
- **Escalation Conditions:** regulated category, price/link opt-in, non-ad rule change.
