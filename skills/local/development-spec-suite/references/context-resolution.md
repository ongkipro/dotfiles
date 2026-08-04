# Context Resolution

Collect facts before selecting documents. Keep these dimensions separate: product surface; legal/operating entities; target markets; user/data-subject locations; storage, processing, backup, analytics, model, and remote-support locations; processors/subprocessors; sector and age groups; commerce/payment/tax roles; AI provider/deployer role; locales/accessibility; and customer contracts.

## Depth

| Profile | Typical scope |
|---|---|
| `lean` | Bounded feature, library, CLI, automation, prototype, small internal tool |
| `product` | Maintained user-facing web/mobile/desktop product or service |
| `platform` | Multi-component/public/multi-tenant/marketplace/critical service |

`saas` is a compatibility alias for `platform + multi-tenant + identity` only.

## Overlays

Activate only when facts trigger them: `multi-tenant`, `identity`, `public-api`, `custom-domain`, `localized-ui`, `commerce`, `personal-data`, `cross-border`, `regulated-sector`, `ai-system`, `high-availability`, `mobile-desktop`, `extension-plugin`, and `data-analytics`.

Use identifiers:

- `CTX-*`: observed fact or bounded assumption.
- `OVR-*`: overlay activation/deactivation decision.
- `JUR-*`: jurisdiction/sector applicability decision.
- `XFER-*`: cross-border data-flow/transfer record.
- `LOC-*`: locale/regional product contract.

Unknown is not “not applicable.” A language, IP address, hosting region, vendor certification, or payment currency alone does not prove legal applicability. Record owner, evidence, status, effective/publication date, retrieval date, and recheck trigger. Re-run selection after a new market, entity, data type, processor, region, AI model, payment/tax role, contract, or law status.
