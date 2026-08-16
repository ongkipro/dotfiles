---
name: volumup
description: "Volumup business and legal reference; repository contracts own product execution"
metadata:
  node_type: memory
  type: project
  originSessionId: cfd5903c-8fda-431d-bd6a-71b30a64c845
---

# Volumup

> Advisory context only. Inspect `ongkipro/volumup` and its `AGENTS.md`,
> `STATUS.md`, `TASKS.md`, `BUILD-LOG.md`, architecture, and ADRs before doing
> implementation work. Verify the checkout path on the active device.

- Product boundary: self-owned multi-store ecommerce for US consumers, using
  US-warehouse dropshipping and print-on-demand fulfillment.
- Historical planning drafts may exist under
  `~/Documents/work/prd/volumup/`; repository-owned contracts outrank them.
- Runtime stack, feature completion, branches, test state, credentials,
  deployment, and the execution queue are deliberately not recorded here.

---
**Durable business/legal context (NOT in the repo — the part worth remembering):**

**The one rule that decides everything technical and legal at once:** *never own inventory situated in
the US* — it drives treaty PE, §865(e)(2), and whether sales-tax nexus attaches at $0. AliExpress
dropship + Printify POD are both PE-free (no owned US inventory); a US 3PL with owned stock is the ONE
channel that crosses this line — attorney-gated, "nanti/maybe", not near-term.

Research found the *business assumptions*, not the architecture, are what's unproven: the US $800 de
minimis is permanently gone; AliExpress has no working resale-exemption path (marketplace facilitator);
`ds.order.create` can't pin the warehouse; supplier sales tax is unpriceable before the order
(`actual_tax_fee` only appears after). **Printify (POD) is a PARALLEL dropship provider, same tier as
AliExpress → fulfillment is MULTI-PROVIDER** (abstraction deferred to Phase 4, ADR-014); Printify DOES
honor a resale cert (closes the ADR-007 double-tax hole without owning inventory), barrier = a state
seller's permit. **ADR-007 = CONDITIONAL upgrade, not accepted** — gate on the anchor-ID question (a
Delaware EIN-only entity has no home-state resale number to anchor MTC multi-state exemption), 2 real
test orders, attorney USTB/ECI review, and a new state income/gross-receipts nexus track (WA B&O / OH
CAT / etc, unshielded by 86-272/treaty PE). Near-term: defer strict-state registrations, eat small COGS
tax. `06-tasks.md` Phase 0 holds 9 preconditions (three can invalidate the plan) — they gate **launch**,
not Phase 1–3 code.

**Ongki's entity context:** Delaware **single-member LLC formed 2026**, foreign-owned, Stripe registered
to it → **Form 5472 + pro forma 1120 due 15 Apr 2027, $25,000/yr penalty uncapped**, triggered merely by
funding the LLC. ITIN (W-7) 9–11 weeks from overseas, gates the protective 1040-NR. Singapore Pte Ltd
option **researched + rejected** (no US–SG treaty → ~44.7%). Entity choice **DEFERRED by Ongki**; market
= US is **DECIDED**.

Related: [[prefer-git-worktree]], [[additive-commits-no-history-rewrite]]
