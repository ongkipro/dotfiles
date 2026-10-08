# Supply-chain install hardening

Use when an agent or a developer adds, upgrades, or installs JavaScript dependencies. Keep the project's existing package manager, lockfile, and policy; add only the controls the repository accepts. Setting names below come from Supabase's npm security guide (paraphrased; [supabase.com/docs/guides/security/npm-security](https://supabase.com/docs/guides/security/npm-security), checked 2026-10-08). pnpm versions and defaults below are from pnpm.io/settings (checked 2026-10-08); npm options are documented in the npm v11 config reference without version notes. Check the installed version before relying on a setting and confirm the effect with a dry install.

## Install policy

| Control | pnpm (`pnpm-workspace.yaml`) | npm (`.npmrc` / CLI) | Why |
| --- | --- | --- | --- |
| Quarantine fresh releases | `minimumReleaseAge` (minutes; since v10.16.0; default `1440` = 1 day from v11, `0` before), e.g. `10080` = 7 days; `minimumReleaseAgeExclude` for internal scopes | `min-release-age` (days), or `before` for an absolute date | Most malicious versions are found and pulled within days. |
| Default-deny install scripts | `allowBuilds` map of package → `true`/`false` (since v10.26.0; `strictDepBuilds` defaults to `true`). `onlyBuiltDependencies`, `neverBuiltDependencies`, and `ignoredBuiltDependencies` were removed in v11 | `--ignore-scripts`, then run the needed build step deliberately | Lifecycle scripts run arbitrary code with the installer's credentials. |
| Block non-registry transitive deps | `blockExoticSubdeps: true` (since v10.26.0, default `true`) | `allow-git=root` (also `allow-remote`, `allow-file`, `allow-directory` = `root`) | A transitive git/tarball/file dependency bypasses registry provenance and audits. |
| Provenance and trust | `trustPolicy: no-downgrade` (since v10.21.0, default `off`; fails when a package's trust level drops versus earlier releases) | `npm audit signatures` after install | Detects a tampered or downgraded publish path. |
| Pin the package manager | `"packageManager": "pnpm@<version>+sha512.<hash>"` in `package.json` | same field | The installer itself is part of the supply chain. |
| Frozen installs in CI | `pnpm install --frozen-lockfile` | `npm ci` | CI must install exactly what review approved. |

- Treat `npx pkg@latest` (or `pnpm dlx`, `bunx` without a version) like `curl | bash`: pin an exact version and run it only when needed.
- Never run install or build scripts of an unreviewed package in a shell holding production credentials or the user's secret store.

## New package gate

LLMs, including the agent itself, suggest package names that do not exist; attackers register them ("slopsquatting"). Spracklen et al. (USENIX Security 2025) measured hallucinated package rates of at least 5.2% for commercial and 21.7% for open-source models ([arXiv 2406.10279](https://arxiv.org/abs/2406.10279)). Before adding a dependency:

- Confirm the exact name exists in the registry and matches the intended project: publisher/maintainers, linked source repository, release history and age, weekly downloads, and that the repository links back to the same package name.
- Reject near-miss names (typos, scope swaps, `-js`/`-node` suffixes) and packages that are days old with no history unless the user confirms them.
- Prefer a native feature or existing dependency first (`native-first`).

## Evidence discipline

Paraphrasing the Trail of Bits `supply-chain-risk-auditor` rules (github.com/trailofbits/skills, CC BY-SA 4.0): data you could not collect is neither proof of risk nor proof of safety, so label each criterion assessed-clean, assessed-flagged, or not assessable (with the reason); a check that measured nothing is a failed check, never a clean verdict. Report advisory, age, or score signals with reachability context; they are not exploit proof by themselves.
