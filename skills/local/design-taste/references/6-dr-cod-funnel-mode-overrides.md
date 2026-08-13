# 6. DR / COD FUNNEL MODE OVERRIDES

Funnel LPs (petanisejahtera/pesantren class) are direct-response pages for
mobile-first ID/MY ad traffic. Conversion evidence beats taste rules. In
this mode:

**Overridden (allowed and often required):**
- **Repeated CTA:** the order CTA repeats after every major persuasion
  block, plus sticky bottom button on mobile. The one-label rule still
  applies (same wording every time), the one-per-intent COUNT rule does
  not. This overrides the single-CTA-band shape in `copywriting`'s LP
  template; CTA WORDING still follows copywriting's rules.
- **Long-form copy:** story → problem → solution → proof → offer → FAQ.
  The 20-word/25-word caps do not apply; section rhythm does.
- **Urgency/scarcity:** allowed when backed by real data (real stock, real
  promo end). Fabricated countdowns and fake "412 of 800" counters stay
  banned — lying breaks trust and ad-account health.
- **Centered, stacked, symmetric layout:** correct here. VAR stays 2-4;
  fancy asymmetry hurts scan-speed on cheap Android devices.
- Single locked light theme, no toggle, no dark-mode variant (§4.2.1).
- Emotional/hype register within platform ad-policy limits; testimonial
  blocks may be long if scannable.

**NOT overridden (still mandatory):**
- Real product images and verified, consented testimonial evidence. Never
  generate customer portraits, quotes, ratings, or before/after proof.
- Contrast audits, label-above-input forms, inline errors — the order form
  IS the product; a broken form is a dead funnel.
- Performance: this traffic is mid-range Android on mobile data. MOT ≤ 3,
  zero JS animation libraries, LCP < 2.5s on the hero image, CLS < 0.1
  (reserve image space).
- All Section 5 AI-tell bans, the em-dash ban, the copy self-audit.
- All of §4.7 (mobile and touch reality). The 16px input floor is a
  conversion rule here, not a style one.
- Never rename form field names / IDs / slugs that tracking (Meta pixel,
  GTM, Scalev) depends on.
