# Meta Ads Scout Status

Project: Meta Ads Scout
Path: `~/dotfiles/skills/local/meta-ads-scout`

## Implemented contract

- [x] Official Meta Ad Library API is the first programmatic path.
- [x] Graph API version and coverage are retrieved from current Meta documentation; the caller supplies the verified version rather than relying on a brittle pin.
- [x] General-commercial research outside current API coverage falls back to ordinary manual Ad Library review, not automation.
- [x] `scout.js` uses the official `/ads_archive` API, cursor pagination, bounded results, and structured API errors.
- [x] Browser collection, stealth behavior, CAPTCHA bypass, and raw-page debug behavior are disabled.
- [x] CLI output remains complete JSON on both success and failure and does not expose the token or paging URL.

## Runtime evidence

- [ ] Exercise `scout.js` against the official API with a user-owned eligible app and token when such credentials are available.

Do not mark runtime evidence complete based on a DOM-only smoke test, a fake token, or user consent to scrape. Preserve the API response/error, retrieval date, current documentation/version check, filters, and coverage limits as evidence.