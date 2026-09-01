# Repository Visibility

`ongkipro/dotfiles` visibility is not stable and no commit consistently records
a flip in either direction. Verify the live value before trusting any written
claim, including this one:

```bash
gh api repos/ongkipro/dotfiles --jq .visibility
```

## Toggle history (as recorded, may be incomplete)

- **Public 2026-08-17.** Owner instruction, in response to GitHub Actions
  being silently unfunded on the private-repo minute quota (see below).
- **Private 2026-08-23,** per an AGENTS.md line at the time — no commit found
  explaining the change.
- **Public,** confirmed by `gh api` on 2026-08-26 — contradicted the prior
  "private" claim with no commit found explaining that change either.
- **Private 2026-08-27.** Owner instruction, explicit in that session.
- **Public, verified by `gh api` on 2026-09-01** — contradicting the
  "Private 2026-08-27" line above with no commit found explaining the change.
  This is the second time the written history has been overtaken without a
  recorded flip, which is why the instruction at the top of this file is to
  check the live value rather than read this list.

## Why visibility is not a secrets boundary

Going private does not retract exposure from a public window — anything
pushed while public may already be cloned or archived, and a later flip back
to private does not undo that. Going public is permanent the moment something
is pushed, for the same reason. Credentials were never tracked regardless of
visibility; they live in `~/.config/ai-local/`. Keep server addresses, account
balances or credit, hardware serials, and client names out of commits to this
repository at any visibility.

## The real cost of private

A private repo on the Free plan gets ~2,000 GitHub Actions minutes/month,
metered with a per-OS multiplier (macOS runs cost roughly 10x the same
minutes on Linux). A public repo's Actions usage on standard runners is free
and unmetered. Exhausting the private quota does not produce a billing
charge — Actions is blocked instead, silently, until the next billing cycle
or a plan/spending-limit change. That is what happened 2026-08-15 through
2026-08-19: every job failed to start with "recent account payments have
failed or your spending limit needs to be increased," `Core runtime` and
`Development Specification Suite` both went dark for four days, and nothing
surfaced the block to a session working locally — `ai-doctor` had to be asked
to check `gh run list` directly. See `docs/archive/DOTFILES_TASKS_THROUGH_2026-08-17.md`
for the incident as it was tracked at the time.

**While private, watch for the same failure mode recurring**: a run reported
here as CI-green may in fact never have started. Check `gh run list --limit 1`
after a push rather than assuming the workflow ran.
