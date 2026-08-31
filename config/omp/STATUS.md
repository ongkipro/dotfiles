# Status — OMP Integration

Updated: 2026-08-31
Status: OMP is upstream-native; dotfiles provides shared curated context and
owned skills plus an explicit secret-free default reference.

## Active ownership

| Surface | Owner |
|---|---|
| `~/.omp/agent/config.yml` and profiles | OMP |
| Recommended cross-device role graph (`config/omp/config.yml`) | dotfiles reference only |
| Models, providers, fallbacks, bundled agents, and task concurrency | OMP |
| Auth, sessions, cache, updates, and workspace behavior | OMP |
| `~/.omp/agent/AGENTS.md` | dotfiles shared memory |
| `~/.config/ai/memory/` | dotfiles curated cross-device memory |
| Reviewed lesson candidates from OMP work | `ai-learn` lifecycle |
| `~/.omp/agent/skills` | dotfiles owned skills |
| Project MCP configuration | each repository |
| User MCP configuration | OMP native path; currently absent |

Dotfiles does not wrap the `omp` command, set `PI_CONFIG_FILES`, or install
`config.yml`, `models.yml`, or `agents/` into OMP's agent directory. The
reference is loaded only by an explicit `omp --config
~/dotfiles/config/omp/config.yml` invocation. Installers remove only legacy
symlinks that point exactly at this repository and preserve all unmanaged or
OMP-owned files.

The active device keeps OMP's separate native memory backend off. Dotfiles
memory reaches OMP through `AGENTS.md`; verified reusable outcomes from OMP may
return through `ai-learn capture`, review, and explicit promotion. This is one
curated cross-CLI lifecycle, not bidirectional raw session synchronization.

## Verification

- `omp-routing-test` guards the ownership boundary and live managed links.
- `omp-workspace-test` proves shell startup preserves OMP arguments and config
  discovery.
- `omp-effective-routing-test` resolves both OMP's native settings schema and
  the explicit cross-device reference in isolated agent directories, then
  validates every selector, thinking level, and visual-role image capability
  against the **ambient** model registry. That last part is deliberately not
  isolated: an agent directory with no authenticated provider answers with zero
  models, which — together with a missing `jq -e` — is what left this check
  unable to fail at all until 2026-08-31. Without an authenticated registry it
  now prints an explicit SKIP instead of passing quietly.
- `installer-link-test` proves migration removes managed legacy links while
  preserving unmanaged runtime state.

The historical custom routing files remain under this directory temporarily as
reviewable evidence. Only `config.yml` is the current executable reference; it
is not active unless explicitly selected. Device-local state remains in OMP's
native configuration.

Worth stating plainly, because the sentence above invites the wrong inference:
on this device the native `~/.omp/agent/config.yml` and the tracked reference
are **functionally identical** — a diff shows only the reference's header
comment and an empty-array formatting difference. So the recommended role graph
is in fact what a plain `omp` resolves here. That is a property of this device
having been configured to match, not of any linking or wrapping, and nothing
enforces it staying true. `omp-effective-routing-test` guards the tracked
reference; it does not compare the two files. A device whose native config
drifts would not be caught by any check in this repository.

The visual lane is two roles: `designer` (Gemini 3.7 Flash High) by default,
escalating to `vision` (Opus 5 High) for material redesign. Both are pinned in
three places — `bin/omp-effective-routing-test`, `bin/ai-policy-lint`, and
`config/ai/AGENTS.md` — so changing one alone fails the suite.
