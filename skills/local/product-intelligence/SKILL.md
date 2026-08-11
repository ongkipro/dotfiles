---
name: product-intelligence
description: Decision-first orchestration for turning an uncertain business or software idea into evidence-backed market, product, UX, and specification direction before implementation. Use for end-to-end idea evaluation, market/demand/pricing work tied to a product decision, domain and workflow definition, or an evidence-backed implementation proposal. Not for settled implementation, standalone PRD authoring, pack audits, isolated fact lookups, visual polish, or coding.
---

# Product Intelligence

Own the transition from an ambiguous idea to an approved, evidence-backed product direction. Keep one decision and evidence context, then hand each activated artifact to its existing specialist owner.

## Trigger boundary

Use this skill to:

- evaluate or develop a business or software idea end to end;
- research users, demand, competitors, substitutes, pricing, sizing, or trends for a pending product decision;
- determine roles, entities, lifecycle, permissions, workflows, information architecture, experience states, technical concerns, or future-change boundaries before implementation;
- turn uncertain product direction into an evidence-backed implementation proposal.

Do not use it for:

- a clearly bounded implementation task with settled requirements;
- a standalone PRD or task breakdown, owned by [`prd-taskbreaker`](../prd-taskbreaker/SKILL.md);
- an existing specification-pack traceability audit, owned by [`development-spec-suite`](../development-spec-suite/SKILL.md);
- an isolated market fact lookup with no product decision;
- visual polish after product behavior is settled;
- code implementation or runtime verification.

## Decision brief

Before prescribing artifacts or solutions, record:

- permanent context ID, pending decision, accountable owner, and deadline or horizon;
- risk if wrong, target actor/population and geography, current alternatives, and product state;
- goals, non-goals, scope, constraints, appetite, acceptable uncertainty, and exclusions;
- go, hold, and stop thresholds; required claims; and decision-changing evidence;
- research breadth, source and cost limits, stop conditions, and review trigger.

Every unresolved field is explicitly `Unknown` or an owner-held `Decision`. A `Decision` records owner, options, recommended default, supporting evidence, trade-offs, and consequence; evidence may inform it but cannot select policy. Never infer business policy, appetite, thresholds, permissions, or exclusions.

## Eight phases

1. **Resolve** — inspect relevant repository/runtime truth; frame the decision, scope, constraints, appetite, unknowns, exclusions, and stop conditions.
2. **Evidence** — establish the canonical source and claim ledger, keep desk and customer evidence distinct, and use only bounded independent research slices.
3. **Model** — model the applicable market, roles, entities, lifecycle, permissions, workflows, information architecture, experience states, and technical/operational concerns.
4. **Decide** — obtain accountable human decisions for market boundary, target segment, value proposition, pricing/revenue assumptions, thresholds, business policy, and costly-to-reverse choices.
5. **Specify** — select the smallest artifact route and activate only applicable domain specialists.
6. **Review** — perform deterministic structural checks and a separate semantic contradiction, evidence-fit, and coverage review.
7. **Approve** — obtain explicit implementation approval from the accountable human.
8. **Build and prove** — only after approval, hand off through normal implementation ownership, collect scoped `TEST-*`/`EVID-*`, and reconcile accepted canonical artifacts.

Stop after phase 7 unless approval is explicit. Research/planning approval is not implementation approval. If a stop threshold is met, stop; if evidence is insufficient, report the gap, owner, and next discriminating evidence rather than manufacturing certainty.

## Outputs and owner boundaries

- Apply the claim and proof rules in [Evidence and Claim Contract](references/evidence-contract.md). Every recommendation states the exact claim or decision, canonical status, separate evidence kind, supporting and refuting IDs, confidence with reason, limitation/applicability, consequence, practical implication, next evidence or decision owner, and time-based review trigger when applicable.
- Apply [Market Intelligence](references/market-intelligence.md) only when the pending decision requires market, customer, demand, pricing, sizing, competitor, substitute, or trend evidence.
- Use [Product and UX Handoff](references/product-handoff.md) for the field-level interface into product-workflow specialists. Visual work starts only after product policy and behavior are sufficient.
- Use [Adaptive Artifact Routing](references/artifact-routing.md) for bounded versus multi-domain packs, canonical ownership, approval gates, and brownfield reconciliation.

This skill owns framing, applicability, bounded research contracts, synthesis, contradiction resolution, and the approval boundary. It does not own specialist methodology, canonical domain facts, artifact content after handoff, implementation, or proof. Preserve existing accepted identifiers and owners; reference rather than copy specialist rules.