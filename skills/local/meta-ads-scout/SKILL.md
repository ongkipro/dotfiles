---
name: meta-ads-scout
description: >-
  Research competitor advertising in Meta Ad Library using the official API first and the public
  UI for manual review when the API does not cover the requested market or ad category. Triggers:
  riset ads, facebook ads, meta ads library, cari iklan kompetitor, bedah copywriting fb ads, spy ads.
---

# Meta Ads Scout

Use this skill for competitor-ad research in Meta Ad Library. Keep repository artifacts and reports in English unless the user asks for another language.

## Source and compliance gate

Retrieve the current sources before every run because Graph API versions, fields, access requirements, and geographic coverage change:

- [Meta Ad Library API](https://www.facebook.com/ads/library/api/)
- [Ads Archive Graph API reference](https://developers.facebook.com/docs/graph-api/reference/ads_archive/)
- [Archived Ad field reference](https://developers.facebook.com/docs/marketing-api/reference/archived-ad/)
- [Graph API changelog](https://developers.facebook.com/docs/graph-api/changelog/)
- [Meta Terms](https://www.facebook.com/terms/)

Meta's Terms prohibit automated access or collection from Meta products without prior permission. Do not bypass CAPTCHAs, anti-bot controls, authentication, rate limits, or other technical measures. Do not describe browser automation as stealth or imply that public visibility grants permission to scrape.

## Required flow

1. **Define the research scope.** Confirm the market, ad category, date range, language, and whether the request concerns political/issue ads or general commercial ads.
2. **Check the live API contract.** Read the current Ads Archive reference, Archived Ad field reference, and Graph API changelog. Do not hardcode a Graph API version from this skill. Verify requested country, category, fields, access requirements, and geographic coverage. The current reference says an ad that did not reach any EU location is returned only when it concerns social issues, elections, or politics; re-check that language rather than treating it as a permanent market list.
3. **Use the official API first when eligible.** Use `/ads_archive`, documented fields, cursor pagination, and API error codes. Read an access token from the user's existing secret store or environment; never ask the user to paste it into chat, log it, or place it in a command argument. `scout.js` is an official-API client and requires the currently verified Graph API version explicitly.
4. **Use normal manual review when the API is ineligible or unavailable.** Open the public [Meta Ad Library](https://www.facebook.com/ads/library/) and let the user drive the review. Summarize only what is visible. Do not run browser automation or a scraper as a substitute for missing API coverage.
5. **Do not automate the public UI.** Meta's Terms boundary applies even when a page is publicly visible. User consent is not Meta permission, and this skill provides no browser-collection fallback. `scout_debug.js` is a disabled legacy entry point.
6. **Report provenance and limits.** State whether evidence came from the API or manual UI, the retrieval date, filters used, result limit, truncation status, and unavailable fields. Do not present a partial sample as a complete market census.

For an API-eligible request, first retrieve the current API reference and set the version it documents:

```bash
# META_ACCESS_TOKEN must already be injected by the runtime's secret mechanism.
META_GRAPH_API_VERSION='<current version, for example vNN.N>' \
META_AD_TYPE='ALL' \
META_AD_MAX_RESULTS='25' \
  node ~/dotfiles/skills/local/meta-ads-scout/scout.js "<PRODUCT_KEYWORD>" "<ISO_COUNTRY_CODE>"
```

Prefer injecting `META_ACCESS_TOKEN` through the runtime's existing secret mechanism rather than typing it in an interactive shell. The script sends it in the Authorization header and never includes it in JSON output.

## Analysis output

- **Advertisers observed** — names and source links or library IDs when available.
- **Creative and offer patterns** — evidence-backed themes from the returned copy and media metadata.
- **Coverage limitations** — API eligibility, pagination/sample size, date window, and fields not returned.
- **Draft alternatives** — two or three original copy directions that do not reproduce a competitor's protected creative.

## Failure handling

An empty or malformed result can mean no matching ads, an unsupported API scope, access/rate-limit failure, markup change, consent UI, or anti-automation enforcement. Preserve the actual error and source. Do not label every empty response a rendering delay, silently broaden the query, or switch to scraping.