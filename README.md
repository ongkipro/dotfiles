# dotfiles

Shared developer configuration and AI tooling for Linux and macOS.
Canonical policy, owned skills, and reviewed references support Claude Code,
Codex, Antigravity, Pi, and OMP through their native adapters.

Start with the [AI context guide](config/ai/README.md),
[system map](docs/DOTFILES_SITEMAP.md), and
[adaptive workflow](docs/adaptive-ai-system.md).
The [whole-system reliability notes](docs/research/dotfiles-reliability-sources.md)
map audit findings to regression suites, community sources, and recovery steps.
[Tasks](TASKS.md), [status](STATUS.md), and `.delivery/` own current execution
contracts and evidence; the [changelog](CHANGELOG.md) records adoption notes.

## Device setup and updates

Use [Linux setup](docs/linux-dev-setup.md) or
[macOS setup](docs/macos-install-step-by-step.md) for a new device.
Existing devices use `dotsync pull`; normal background autopull also reconciles
context, skill, and executable links. See [device sync](docs/ai-memory-sync.md).
When adopting a Node pin update, follow the [npm-global migration checks](docs/research/dotfiles-reliability-sources.md#node-upgrades-and-npm-globals); changing the pin alone does not move existing CLIs.

## Local AI workflows

- `delivery-learning stage` records an explicit reusable lesson proposal;
  successful delivery completion harvests a private candidate for review.
- `ai-recall` searches selected curated references and verified historical
  evidence with citations through a private SQLite FTS5 index.
- `ai-schedule` runs explicitly registered offline checks via a due tick or
  foreground loop. It installs no service or real job automatically.
- `dotads-meta` validates and plans Meta Ads workspaces; live mutations retain
  their separate approval requirements.

Usage and recovery are in the [adaptive workflow](docs/adaptive-ai-system.md#verified-learning-recall-and-scheduled-checks)
and the [Meta Ads skill](skills/local/meta-ads-cli/SKILL.md).

## Verification

`ai-policy-lint` checks shared policy and repository contracts.
`ai-doctor --self-test` runs the broader fixture suite. Focused commands and
recorded results belong to each task's `.delivery` evidence. Passing local
fixtures does not certify provider availability or all native runtimes.

`design-tools-test` runs the five design-tool suites; Pillow and a working
Chrome/Chromium are required for full coverage. CI requires full coverage in a
dedicated job. Missing local dependencies produce explicit coverage warnings.
