# TASK-170 — completed

Moved from `TASKS.md` when it finished (2026-11-01).

### TASK-170: Locked owner rules (form of address, dotads and dotuiux names)
- **Requirement:** REQ-LOCKED-RULES (owner 2026-11-01: the address "Paduka Ongki" and the meanings of "dotads" and "dotuiux" must hold on every device and every AI that uses these dotfiles; a local rename such as "Paduka Olan" or "Olan" is replaced automatically; only a password-holder can change a locked rule).
- **Risk Level:** R2.
- **Allowed Paths:** `config/ai/locked-rules.json`, `bin/ai-rule-lock`, `bin/ai-rule-lock-test`, `bin/ai-memory-link`, `config/ai/runtime-commands.txt`, `config/ai/CORE.md`, `config/ai/context/*.md`, `config/ai/memory/{identity,preferences,meta-ads,skills}.md`, `config/ai/memory-router.json`, `config/ai/README.md`, `.github/workflows/core-runtime.yml`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/TASKS-170-completed.md`, `docs/DOTFILES_SITEMAP.md`, `bin/system-map-test`.
- **Canonical Contract Owners:** `config/ai/locked-rules.json` (rule text and signature); `bin/ai-rule-lock` (check/repair/sign/verify).
- **Accepted Invariants:** the password is never stored, printed or committed (only a salted scrypt-derived HMAC signature is tracked, and the verification secret lives in GitHub Actions); repair rewrites only the declared rule slots; rendering stays a pure function of the tracked sources; CORE ≤ 8 KB and context ≤ 10 KB; device-local `~/.config/ai-local/` is never read or rewritten.
- **Regression Checks:** `bin/ai-rule-lock-test` (drift detected, rename repaired, deleted slot fails, unsigned canonical change fails verification); `bin/ai-memory-link-test`; `bin/ai-policy-lint`; `bin/system-map --check`; CI signature step.
- **Reopen Conditions:** a rename survives `ai-memory-link`; a rule change without the password passes CI; the password appears in any tracked file.
- **Escalation Conditions:** required status checks or admin enforcement on `main`; reading or rewriting device-local files.
- **Non-Scope:** project-level CLAUDE.md/AGENTS.md in other repositories; device-local private notes; required status checks that would block straight-to-main pushes.
- **Review:** three independent rounds. Round 1 returned REVISE with seven confirmed defects:
  - a dangling marker let block repair delete file content;
  - repair errors were hidden on devices;
  - markdown, upper-case and hyphenated renames were missed;
  - the forbid regex crossed lines and ate words;
  - same-repository PRs skipped verification;
  - repair replaced symlinks with regular files;
  - the KDF was weak.

  Round 2 found that CRLF was lost on repaired lines and that a period-less rename swallowed the next sentence. Round 3 found short trailing text was still swallowed. Each finding became a regression case in `bin/ai-rule-lock-test`, and hand mutations of every fix are killed.
- **Ledger:** `RUN-20261101T104954Z-7e053d4e` finished **BLOCKED**, not PASS: the boundary failed only because a concurrent session edited the unrelated `config/ai/project-memory/adsbookcms-install-fleet.md`; that file is not part of this commit.
- **Known limits (documented in `config/ai/README.md`):**
  - detection in CI, not prevention of a push;
  - lower-case names and bare names outside the declared slots are not detected;
  - a rename in a file that upstream also changed waits for a fast-forward;
  - the signature becomes valid only after the owner runs `ai-rule-lock sign` and sets `AI_RULE_LOCK_KEY`.
