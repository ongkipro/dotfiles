# Status — OMP Integration

Updated: 2026-08-26
Status: OMP is upstream-native; dotfiles provides shared curated context and
owned skills only.

## Active ownership

| Surface | Owner |
|---|---|
| `~/.omp/agent/config.yml` and profiles | OMP |
| Models, providers, fallbacks, bundled agents, and task concurrency | OMP |
| Auth, sessions, cache, updates, and workspace behavior | OMP |
| `~/.omp/agent/AGENTS.md` | dotfiles shared memory |
| `~/.config/ai/memory/` | dotfiles curated cross-device memory |
| Reviewed lesson candidates from OMP work | `ai-learn` lifecycle |
| `~/.omp/agent/skills` | dotfiles owned skills |
| Project MCP configuration | each repository |
| User MCP configuration | OMP native path; currently absent |

Dotfiles does not wrap the `omp` command, set `PI_CONFIG_FILES`, or install
`config.yml`, `models.yml`, or `agents/` into OMP's agent directory. Installers
remove only legacy symlinks that point exactly at this repository and preserve
all unmanaged or OMP-owned files.

The active device keeps OMP's separate native memory backend off. Dotfiles
memory reaches OMP through `AGENTS.md`; verified reusable outcomes from OMP may
return through `ai-learn capture`, review, and explicit promotion. This is one
curated cross-CLI lifecycle, not bidirectional raw session synchronization.

## Verification

- `omp-routing-test` guards the ownership boundary and live managed links.
- `omp-workspace-test` proves shell startup preserves OMP arguments and config
  discovery.
- `omp-effective-routing-test` resolves OMP's native settings schema in an
  isolated agent directory.
- `installer-link-test` proves migration removes managed legacy links while
  preserving unmanaged runtime state.

The historical custom routing files remain under this directory temporarily as
reviewable evidence. They are not active configuration and must not be used to
seed a native profile. Device-local role and fallback choices remain in OMP's
native configuration only.
