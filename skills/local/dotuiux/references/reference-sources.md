# Reference sources

Where to look during `dotuiux` step 2, and what each source may be used for.
Checked 2026-10-31; licences and access change, so recheck a source's terms
before relying on it for client work.

**Rule of thumb:** galleries are mood, chosen by a human; live shipped products,
design systems, and research are patterns the agent may open, measure, and cite.
Learning visual direction from AI-made templates trains toward the average we
are trying to leave.

## Roles

| Source | Use for | Who browses | Never |
|---|---|---|---|
| Live competitor and benchmark sites | UX conventions and teardown metrics | agent, real browser, human pace | brand assets, copy |
| Shopify Theme Store demos | storefront states and flows | agent | theme code or assets |
| Dribbble, Behance, Pinterest | mood for brand-heavy pages | owner pastes 1–3 items | scraping or automation (Dribbble ToS); admin or storefront patterns |
| Awwwards, recent.design, Land-book, Lapa Ninja | motion and composition mood | owner | accessibility or performance patterns |
| v0 templates | structure of a React/shadcn screen while exploring | agent or owner | visual direction; copying code (no licence stated) |
| Mobbin, Refero (paid) | shipped product flows | agent via the vendor's MCP if subscribed | derivative work (Mobbin ToS bans AI derivatives) |

## Shortlist by surface

| Surface | Start with |
|---|---|
| Landing / company profile | live-site teardown; [NN/g articles](https://www.nngroup.com/articles/); owner-picked mood; [Fonts In Use](https://fontsinuse.com/) and [Realtime Colors](https://www.realtimecolors.com/) for type and palette sanity; [GOV.UK patterns](https://design-system.service.gov.uk/patterns/) for contact forms and error pages |
| Storefront | [Baymard](https://baymard.com/research) free articles; [ecomm.design](https://ecomm.design/) or Store Inspo only to find live stores, then open and measure them; GOV.UK form fields |
| Admin | [Carbon patterns](https://carbondesignsystem.com/patterns/overview/) (Apache-2.0), [Primer patterns](https://primer.style/product/ui-patterns/) (MIT), [component.gallery](https://component.gallery/), [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/); Shopify Dev MCP and Polaris web components for Shopify admin |

Travel, fintech, and healthcare have no maintained global gallery: the live-site
teardown is the method there.

## Licence and access traps

- `uxpatterns.dev` is labelled MIT but its licence is non-commercial; do not use
  it or its MCP for client work.
- Atlassian Design System: use and derivatives limited to Atlassian add-ons.
- Polaris React is archived; use Polaris web components.
- Figma Community kits are CC BY 4.0 (attribution required) and show ideal
  data — not a pattern source for admin or storefront.
- regards.design and SaaSUI ban scraping or bulk download; use the offered MCP
  or human browsing.
- Laws of UX carries no citations — cite NN/g or the underlying research.
- Check the "last updated" date on web.dev articles; `web.dev/patterns` is gone.
- Dead or stale: emptystates.com, emptystat.es, pttrns, darkmodelist.com,
  dashboarddesign.io, uxdatabase.io.
- Unofficial design-system MCP aggregators: do not install.
