# Parallel research, scraping and browser work

> Shared memory, loaded on demand. Status of the scraping defaults: **proposal**, awaiting owner confirmation
> (2026-11-07). The parallel-agent rules follow `memory/development.md` and `docs/parallel-ai-dev-machine.md`.

## Parallel research agents
- Research agents are read-only: no edits, no mutations, no credentials, no `~/.ssh` or `.env`. Findings return as
  text with sources; the owning session decides and acts.
- Give each agent a bounded packet: the question, the sources to prefer, a stop condition and where to save output
  (`~/Documents/work/research/<topic>/`). Do not hand over the whole repository.
- At most three subagents at a time from one terminal; a subagent that only reads is cheap, one that runs builds or a
  browser is not and goes through `heavy-run`.
- A subagent's `web_search` may be unavailable: run searches in the parent and pass the results on.
- Label every claim in the result as sourced (URL, date, kind of source), inferred, or measured locally. Do not present an
  inference as a source, and do not decide "not needed" from what this machine already has.

## Source order
1. Official documentation and the project's own repository.
2. Official API or SDK. Prefer it to scraping (`memory/development.md`).
3. Forums and issue trackers for practice and failure reports.
4. Blogs and vendor pages last, and say so: vendors sell the thing they describe.
Check the date. Verify any claim that changes a decision against the primary source before relying on it.

## Scraping defaults (proposal, not yet an owner rule)
- Only when no official API or export exists, or when scraping is the explicit task.
- Read `robots.txt` and the site's terms first; respect disallow rules and any stated crawl delay.
- Identify honestly with a descriptive User-Agent; do not rotate identities or evade blocks, rate limits, CAPTCHAs or logins.
- Bound the load: one request at a time per domain unless the site says otherwise, a delay between requests, back off on
  429 and 5xx, a hard cap on pages per run.
- Cache what was fetched (URL, time, content hash) so a page is not requested twice; save raw pages outside the repository.
- Collect the least data that answers the question. No personal data, no private or logged-in areas, no paywalled
  content, unless the owner decides so explicitly and the lawful basis is clear.
- Store results and the access log under `~/Documents/work/research/<topic>/`, never in a tracked repository, and never
  commit raw scraped pages or credentials.
- A scraper that needs a browser uses the native `agent_browser` tool with its session, not ad-hoc scripts, and obeys the same limits.

## Browser concurrency
- One browser run at a time per machine for end-to-end suites (`heavy-run --lock browser-e2e`); interactive browser tools
  are separate and light but still count toward memory.
- A page, an element or a result seen once is evidence of that moment only; record the URL and time.

## Not decided here
Legal advice, a specific site's terms, and any collection of personal data are owner decisions, not defaults.
