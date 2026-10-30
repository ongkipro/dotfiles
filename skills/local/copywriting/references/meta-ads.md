# Meta Ads Copy — Market-aware Rules

Owner-approved house rules for Meta (Facebook/Instagram) ad text fields only.
Everything here is a **house rule** unless it cites Meta; never present it to a
client or teammate as a Meta requirement. Platform limits, policy wording, and
field behavior change: recheck Meta's current help and the installed
`meta ads <resource> <action> --help` before treating anything as a hard limit.

## Scope

- Applies to: primary text (`bodies`), headline (`titles`), optional
  description (`descriptions`), and the CTA button (`call_to_action`;
  multi-asset sets use `call_to_actions`) of a Meta ad creative, including
  Flexible Format and DCO asset sets.
- Does **not** apply to: Shopify titles, descriptions, meta fields, ALT, tags,
  landing pages, organic social posts, or any non-ad copy. Those keep the
  `SKILL.md` hard rules unchanged, including no CTA.
- Execution (manifests, validate, dry-run, approval, `--apply`) stays in
  `meta-ads-cli`; localization method stays in `writer`. Copy strings in
  `meta-ads-cli` recipes are schema placeholders, not compliant copy.

## Brief before writing

Confirm and record in the draft header; ask only when a missing item changes
the copy:

1. **Market and locale** — one per ad set: e.g. `ID` → Indonesian (`id-ID`),
   `MY` → Malaysian Malay (`ms-MY`) or English (`en-MY`) as the owner states.
   Never ship one Malay/Indonesian variant to both markets.
2. **Verified facts** — product, specs, materials, benefits, proof; source for
   each claim. No source → no claim.
3. **Destination and CTA button** — what the click opens (product page, form,
   message) and the chosen `call_to_action` enum.
4. **Asset plan** — single ad or Flexible Format/DCO; how many primary texts,
   headlines, and descriptions; whether a description is used at all.
5. **Category risk** — health, finance, weight, beauty results, employment,
   housing, alcohol, or other regulated/sensitive categories → escalate (below).

## House rules (owner-approved)

1. **Soft CTA allowed — optional, in ad text only.** At most one low-pressure
   invitation per primary text, at the end, e.g. invite to explore, choose, or
   compare; omit it when the text already reads complete.
   Forbidden: hard pressure (`beli sekarang`, `buruan`, `order now`), fake or
   unverified urgency/scarcity (`stok terbatas`, `hari ini saja`), and
   guilt/fear hooks. The button does the hard action; the text does not repeat it.
2. **No link or landing-page mentions.** No URL, `klik link`, `link di bio`,
   `cek website`, `swipe up`, `tap the button below`, or wording that describes
   the destination. The button and destination carry that.
3. **No price mentions.** No amounts, currency, discount percentages, `murah`,
   `harga`, `diskon`, `promo`, `gratis ongkir`, or price comparisons. A request
   to add one is an owner escalation, not a writer decision.
4. **No invented claims.** Same as `SKILL.md` rule 5. No superlatives
   (`terbaik`, `#1`), results, ratings, or social proof without a source.
5. **No universal algorithm formula.** Do not claim that a length, emoji
   count, hook style, or number of variants "wins" in Meta delivery. Treat
   such ideas as hypotheses for `meta-ads-cli` experiments.
6. **No automatic publication.** Copy is a draft; going live follows the
   `meta-ads-cli` validate → dry-run → explicit approval gate.

## Fields

Lengths below are **house targets** for readability before truncation, not
Meta limits; check the current ad-format preview.

| Field | House target | Rule |
|---|---|---|
| Primary text | hook in the first ~125 chars; total ≤ ~400 | Hook → 1–3 benefit/detail lines → optional soft CTA. Must read complete if cut after the first line; a claim in the hook carries its qualifier before that cut. |
| Headline | ≤ ~40 chars | Product or benefit; no price, no link, no CTA verb. |
| Description | ≤ ~30 chars, **optional** | Placement-dependent and often hidden. Never put the only key fact, qualifier, or disclaimer here; omit rather than pad. |
| CTA button | enum from the installed CLI | Pick the enum that matches the destination; the button label is rendered by Meta per locale (per the current Ads Manager preview; recheck), not written by us. |

## Variants: different reasons to buy, not synonyms

When a set needs several primary texts or headlines, make each one a distinct,
verified angle rather than a reworded copy of the same sentence:

| Angle | Leads with | Example (verified folding rack) |
|---|---|---|
| Use | the job it does | `Satu rak untuk barang yang sering dipakai.` |
| Situation | when/where it fits | `Buat sudut dapur yang sempit tapi harus rapi.` |
| Detail | material, mechanism, size | `Rangka baja, dilipat tanpa alat.` |
| Doubt | an objection, answered with fact | `Takut makan tempat? Dilipat tipis, muat di sela lemari.` |

The count follows available facts and testable budget; do not pad to a
number. Every angle still obeys the house rules above.

## Field example (`id-ID`, verified facts only)

```
Primary text: Satu rak untuk barang yang sering dipakai. Bisa dilipat saat
              tidak diperlukan, jadi ruang tetap mudah ditata. Lihat
              detailnya kalau cocok buat dapurmu.
Headline:     Mudah dipakai, ringkas disimpan
Description:  (omitted — the fold feature is already in the primary text)
CTA button:   enum chosen for the destination
```

## Combination safety (Flexible Format / DCO)

With multiple text assets, Meta's delivery may pair any primary text with any
headline and description, and placements may show or hide fields (per the
current Ads Manager preview and the installed CLI help; recheck). Every asset
must therefore be **self-contained**:

- Each primary text, headline, and description stands alone and is true with
  every other asset in the set — no "see above", "as mentioned", numbering, or
  sentence split across fields.
- One product/offer and one locale per set. Never mix ID and MY variants, or
  two products, in the same asset set.
- No contradictions between assets (different colors, sizes, or benefits
  stated as exclusive).
- A qualifier stays in the same field as the claim it limits; never rely on a
  description to carry it.
- At most one soft CTA per combination: put it in primary text, keep headlines
  and descriptions CTA-free so pairs never stack two invitations. The soft CTA
  must suit every button in `call_to_actions`.
- Before handoff, check the full matrix (`bodies × titles × descriptions`, plus
  description omitted) for meaning, repetition, and length.

## Locale (ID vs MY)

Write natively for the market; do not convert one variant into the other by
word swaps. Method: `writer` → `references/two-way-localization.md`; vocabulary
traps (`gratis`/`percuma`, `bisa`/`boleh`, `butuh`, `senang`, …): `writer` →
`references/ads.md`. Mark native-reader review pending when unsure.

Soft CTA examples (adapt, don't copy verbatim):

- `id-ID`: `Pilih warna favoritmu.` · `Temukan ukuran yang pas buatmu.`
- `ms-MY`: `Pilih warna kegemaran anda.` · `Cari saiz yang sesuai untuk anda.`
- `en-MY`: `Find the colour that suits you.` (British spelling)

## Policy risks (cite Meta, recheck current wording)

Meta's Advertising Standards
(<https://transparency.meta.com/policies/ad-standards/>) restrict, among
others, ad text that asserts or implies a viewer's personal attributes
(health, body, finances, religion, etc.) and misleading or exaggerated claims.
The Health and Wellness standard is category-dependent: it bars appearance
shaming, cure claims for listed diseases, and timeframe-result promises that
lack a qualifier or disclaimer, while allowing some 18+ cosmetic before/after
depictions. Check the current page per product rather than banning or assuming
the format. Rewrite "Kamu gemuk?" style hooks into product-centred statements.
A policy pass is a review step, not an approval guarantee; only Meta's review
decides delivery.

## Reading results (hand-off to `meta-ads-cli`)

Copy that reads natively is not proven until it is tested. When results come
back, keep three questions apart: did it earn attention (CTR, hook/hold), did it
cause the intended action (the objective's event), and did it produce business
value (lead quality, paid or delivered orders; see `meta-ads-cli` →
`references/roas-cpr-profit-intelligence.md`). A high CTR alone proves nothing;
compare like with like (placement, creative, attribution window, conversion
lag, sample size) before calling one angle better.

## Escalate to the owner

- Regulated or sensitive category, or any health/financial/result claim.
- Request to mention price, discount, link, or urgency.
- New market/locale with no native-reader review available.
- Any change to non-ad copy rules (the Shopify no-CTA rule stays as is).

## QA gate (Meta ad copy)

- [ ] Market, locale, and register stated; one locale per asset set
- [ ] No link, LP, URL, or destination wording
- [ ] No price, discount, or unverified urgency/scarcity
- [ ] At most one soft CTA, in primary text; headline/description CTA-free
- [ ] Every claim sourced; qualifiers in the same field as the claim
- [ ] Combination matrix checked, including description omitted
- [ ] Policy-risk pass done; house rules not labelled as Meta rules
- [ ] Draft only — live changes go through `meta-ads-cli` approval
