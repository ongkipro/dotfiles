# Official Meta sources for ads automation: what exists, what is not a skill, how we use it

Reviewed 2026-11-18. This file records provenance, so nobody mistakes a third-party package for an official Meta skill.

Labels: **[Meta]** an official page or repository was read. **[third-party]** not published by Meta. **[inference]** our analysis. **[unverified]** not read or not reproduced.

## 1. Finding: we found no official Meta "skill" pack for ads

[Meta] The official agent-facing surfaces are documentation and servers, not `SKILL.md` packs:

| Surface | What it is | Where |
|---|---|---|
| Ads CLI | The `meta` command; `meta-ads` 1.3.1 on PyPI; Homebrew `facebook/fb` | `developers.facebook.com/documentation/ads-commerce/ads-ai-connectors/ads-cli/` |
| Ads MCP server | Hosted at `https://mcp.facebook.com/ads`; 106 tools listed for our token | `.../ads-mcp-server/` |
| Doc index for machines | `llms.txt`. No line in it contains the word "skill"; its Ads AI connector entries are the CLI pages and the MCP pages | `developers.facebook.com/documentation/ads-commerce/llms.txt` |
| Catalogue of API Solutions | Markdown build blueprints "for use with AI coding assistants" | `github.com/facebookincubator/catalogue-of-api-solutions` |

How strong this finding is:

- The documentation evidence is solid. The docs we read name the CLI and the MCP server as the connectors.
- The GitHub evidence is weak. The `facebook` organisation listing returned a single repository, so that scan is unreliable. For `facebookincubator` we read only the 100 most recently updated repositories, and one of them is ads-related (the catalogue). We therefore say we **found none**, not that Meta publishes none.

[third-party] Many repositories and directories describe themselves as "Meta Ads skills" or "Meta Ads MCP". Examples: `kelpi-ai/meta-ads-skills`, `bartlomiejborzucki/meta-ads-agent`, AdsAgent, AdAdvisor, Windsor. None is published by Meta, and we **did not review or import any of them**.
We excluded them because their publisher and maintenance are unknown and we have not audited their code. Of the ones we saw, AdsAgent describes itself as a hosted MCP service, which would send account data to a non-Meta host. They also duplicate material our skills already own.

## 2. The one official AI-assistant asset: Catalogue of API Solutions

[Meta] `facebookincubator/catalogue-of-api-solutions`. The latest commit we read is dated 2026-09-16. The repository holds 28 Markdown files under `solutions/` (Quality Assurance, Signals Health, Catalogue Health, Value Rules Engine, Opportunity Score, Creators, creative fatigue, and others) plus `CONVENTIONS.md`, a domain primer.

**Licence: the solutions are CC BY-NC 4.0 (attribution, non-commercial).** The README tells readers to read the licence before reusing or adapting the solutions. It links `solutions/LICENSE.md`, but that path returns 404; the licence text is at `solutions/LICENSE`.
[inference] Our dotfiles support a business that sells through ads, so whether a non-commercial licence permits copying into them is a question for the owner. **Default: link and summarise in our own words; do not copy blueprint text.** Copying needs the owner's decision.

What is useful to us:

- **Entity model.** Business → ad account → campaign → ad set → ad → creative. Owned and client assets come from separate edges (`owned_ad_accounts` and `client_ad_accounts`; the same pairing exists for catalogs). Our mismatch between the BM profile label and the account's owning business (cpas playbook §3) is an instance of this.
- **Status.** Read `effective_status`, not `status`. Create objects `PAUSED` by default. Both match our existing gates.
- **Minor currency units.** Budgets and spend use the currency's minor unit. This matches our existing rule.
- **Access.** Under Standard Access some permissions return only test or sample data, and real assets need Advanced Access through App Review. This matters only if we run the MCP server through our own app for assets we do not own.
- **Rate limits.** Business Use Case limits apply. Back off near the limit and read the error code before retrying.
- **Pixel and dataset.** The two names are interchangeable in APIs and fields.
- **Quality Assurance blueprint.** It lists best practices, overspend risk and naming taxonomy as checks, and suggests comparing `spend` from Insights with the budget to see pacing. It also describes the Ad Rules Engine (`adrules_library`), and says its trigger-based rules are **API-only, not visible or editable in Ads Manager**.
  [inference] That visibility gap argues against using the Rules Engine for our spend protection without an owner decision, because the owner could not see or edit the rule in the dashboard.

What it does not cover: a search of all 28 solution files, `CONVENTIONS.md` and the README found no match for Collaborative Ads, CPAS, catalog segment, `is_pca_unified`, Shopee, or `omnichannel_object`. The bare word "omnichannel" appears once in the Signals Health blueprint, in a data-quality score threshold; we searched only four files for that word. **The catalogue gives no guidance on the CPAS configuration problem.**

## 3. Gap against our skills

| Official material | Our owner |
|---|---|
| CLI usage and flags | `setup-and-commands.md`; checked against the docs on 2026-11-18 (`cpas-shopee-id-ui-playbook.md` §6) |
| MCP server tools | `cpas-shopee-id-ui-playbook.md` §6b and `bin/dotads-meta-mcp` |
| Entity model, status, minor units, paging | `SKILL.md` §1 and `api-and-evidence.md` |
| Signals and dataset health | `meta-ads-signal-engine` |
| Competitor creative research | `meta-ads-scout` |
| Collaborative Ads and Shopee | `cpas-collaborative-ads.md`, `cpas-shopee-id-ui-playbook.md` |

No gap needs an official skill. The open questions need measurement, not borrowing: whether `ads_duplicate_entity` preserves CPAS fields, and how to read app purchases for a pixel-only ad set.

## 4. Before adding any outside Meta ads skill

1. Confirm that Meta published it: an official `developers.facebook.com` page, or a Meta-owned GitHub organisation. A directory listing, a marketplace badge, or "official MCP" wording in a third-party README is not proof.
2. Read the licence first. Do not copy text under a non-commercial or share-alike licence into the dotfiles without the owner's decision.
3. Read the whole package. Reject it if it sends account data to a non-Meta host, asks for a token outside `secrets-env`, or has a write path with no approval gate.
4. Map it to an existing owner skill and extend that skill. Do not add a rival skill.
5. Pin the commit and date, and keep the attribution line.

## 5. Sources

- [Meta] `developers.facebook.com/documentation/ads-commerce/llms.txt`; the Ads CLI and Ads MCP pages (see the cpas playbook §6 and §6b); `github.com/facebookincubator/catalogue-of-api-solutions` (README, `CONVENTIONS.md`, `solutions/foundational/quality-assurance.md`, `solutions/LICENSE`).
- [Meta Business Help] "Manage ads from an AI agent with Meta ads AI connectors" (`facebook.com/business/help/1456422242197840`). Read only as a search excerpt, not in full.
