# Niche Patterns: Category Starting Points

A niche file is the **first hypothesis** for a category, written before live
research: what the visitor is trying to decide, what content the page cannot
do without, what local-market conventions to check, and which claims are
risky. It is not a template, a palette, a font list, or a section order. Live
references inspected for the project overrule it, and the project's own brand
and content overrule both.

Flow: niche file → research queries → inspected reference set (in the project's
design artifact) → composition contract (design-discovery.md §4.1) →
[reference-fidelity.md](../reference-fidelity.md) when a target reference is
matched. Never write project facts or found URLs back into these files.

## Entry structure

Every niche file uses these headings, in this order. Leave a heading with
"none known" rather than inventing content.

1. **Job and decision path:** who arrives, from where (search, marketplace,
   social, WhatsApp share, ad), what they must believe or check before acting,
   and the action itself (buy, book, enquire, trial). Written as
   entry → evaluate → act → after.
2. **Market conventions — VERIFY per project** (Indonesia/Malaysia focus):
   - WhatsApp as a primary or secondary CTA, and what message it pre-fills;
   - marketplace links (Shopee, Tokopedia, TikTok Shop, Lazada) beside or
     instead of on-site checkout;
   - COD availability and how it is shown;
   - regulatory and halal display (BPOM/BPJPH in Indonesia; NPRA/KKM and
     JAKIM in Malaysia) — check the current official rules, never assume a
     number format or logo version;
   - currency format (`Rp 125.000`, no decimals; `RM 49.90`). With
     `Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'})` set
     `maximumFractionDigits: 0`;
   - expected copy length and language mix (Bahasa, English, or both).
   Each is a question for the owner, recorded as confirmed or not applicable.
3. **Must-have content inventory:** the facts and assets without which the
   page cannot do its job. Missing items go to the owner as a list; they are
   never filled with generated stand-ins.
4. **Reference set (to research):** 3-6 live references, each recorded in the
   project artifact with URL, role (target composition / directional /
   interaction / token), access date, what was observed, and what must not
   transfer. The niche file only holds **search queries** to find them.
5. **Recurring patterns:** each written as *problem → pattern that solves it →
   when it does not apply*. A pattern without a problem is decoration.
6. **Category default to escape:** the look a model produces from the category
   name alone. It is calibration for the guessability test
   (invented-info-tells.md), not a ban: the default is fine when the brief
   chooses it for a reason.
7. **Optional style directions:** 2-3 directions, each with fit (which
   audience/brand it suits), risk (what it can break), and accessibility cost
   (contrast, motion, legibility). Described in words, not hex codes.
8. **Mobile notes:** what changes on a phone for this category (most traffic
   in these markets is mobile; confirm with the owner's analytics).
9. **Claim traps:** statements that need evidence or are regulated in the
   category. Copy and legal review belong to `copywriting` and the owner.
10. **Open questions:** what to ask the owner before direction is set.

## Files

| File | Covers |
| --- | --- |
| [skincare-beauty.md](skincare-beauty.md) | skincare, cosmetics, body care, beauty D2C |
| [food-beverage.md](food-beverage.md) | packaged food and drink, cafés and restaurants, catering |
| [local-services.md](local-services.md) | clinics, workshops, salons, contractors, education, local professionals |
| [saas-b2b.md](saas-b2b.md) | B2B software and tools sold to teams |
| [professional-services.md](professional-services.md) | B2B service firms: sales outsourcing, consulting, agencies, accounting, legal, IT services, training |

Add a niche only when a real project needs it, following the same headings.
