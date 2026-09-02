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
  validates selectors, thinking levels, and visual-role image capability under
  every provider present in the **ambient** model registry. Selectors for a
  provider the device does not authenticate are reported as `unjudged`, not
  passed or failed; the portable reference must not force a Mac to have the
  Linux provider set. That registry check is deliberately not isolated: an
  isolated agent directory has no provider auth and answers with zero models.
  Without an authenticated registry the gate prints an explicit SKIP rather
  than passing quietly.
- `installer-link-test` proves migration removes managed legacy links while
  preserving unmanaged runtime state.
- `omp-effective-routing-test` also validates `config/omp/overlays/*.yml`, one
  profile per provider shape. It splits on the provider: a model or thinking
  level that does not hold up under a provider this device *does* authenticate is
  a defect and fails; selectors under a provider it does not have are counted and
  reported as unjudged, never as health. Requiring every overlay to resolve on
  every device would be the same mistake as requiring the Mac to match this
  config.
- `ai-doctor --runtime` (`bin/omp-runtime-report`) answers the question
  enforcement cannot: what each role resolves to *here*, which agent uses it,
  and whether this device can actually reach it. Exits non-zero on an
  unreachable selector, an undeclared thinking level, or a visual role on a
  model that takes no image. Run on the Mac it reports that device's real defect
  and exits 1; run here it exits 0.

The historical custom routing files remain under this directory temporarily as
reviewable evidence. Only `config.yml` is the current executable reference; it
is not active unless explicitly selected. Device-local state remains in OMP's
native configuration.

The native `~/.omp/agent/config.yml` is intentionally device-specific and may
diverge substantially from the tracked reference. `omp-effective-routing-test`
does not compare the two files: demanding a match would push this Mac, whose
authenticated registry is Google Antigravity plus its configured reserve path,
toward direct providers it cannot reach. The gate instead proves both facts
that matter: each native selector is usable on this device, and each portable
selector is sound wherever its provider is available.

What every device must satisfy is narrower, and as of 2026-08-31 the test also
checks **this device's own native config** against **its own registry**: every
selector resolves, every effort is a level that model declares, and `vision` and
`designer` — roles and fallbacks alike — accept image input. Device adaptation
stays free; incoherence does not. Pointing those three rules at the Mac found a
real defect on the first try: its `vision` fallback is
`9router-fantastico/cx/gpt-5.6-sol`, which takes no image, so a failed visual
primary fell back to a model that cannot see.

The visual lane is two roles: `designer` (Gemini 3.8 Flash High) by default,
escalating to `vision` (Opus 5 High) for material redesign. Both are pinned in
three places — `bin/omp-effective-routing-test`, `bin/ai-policy-lint`, and
`config/ai/AGENTS.md` — so changing one alone fails the suite.
