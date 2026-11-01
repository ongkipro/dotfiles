# TASK-171 — completed

Moved from `TASKS.md` when it finished (2026-11-01).

### TASK-171: Device-side enforcement of the owner-locked rules
- **Requirement:** REQ-LOCKED-RULES (owner 2026-11-01: after a pull, on every device, the locked name must not change unless the owner's password is used).
- **Risk Level:** R2.
- **Allowed Paths:** `bin/ai-rule-lock`, `bin/ai-rule-lock-test`, `config/ai/locked-rules.json`, `config/ai/README.md`, `.github/workflows/core-runtime.yml`, `CHANGELOG.md`, `TASKS.md`, `docs/archive/TASKS-171-completed.md`, `docs/DOTFILES_SITEMAP.md`.
- **Canonical Contract Owners:** `bin/ai-rule-lock` (Ed25519 sign/verify, device pin, rotation); `config/ai/locked-rules.json`.
- **Done:**
  - The TASK-170 HMAC signature, which a device could not check without the password, is replaced by Ed25519 (stdlib implementation of RFC 8032, verified against test vectors 1 and 2), keyed by scrypt(password, salt).
  - Each device pins the owner's public key and the signed rule set in `~/.config/ai-local/locked-rules.pinned.json` (0600) on first contact.
  - An edited, unsigned, or foreign-signed rule set is rejected. The device restores the tracked file to the last signed version, keeps enforcing "Paduka Ongki", and exits non-zero.
  - A new password is accepted only when the previous password endorses the new key.
  - CI derives the key from `AI_RULE_LOCK_KEY` and requires it to equal the signed key.
- **Accepted Invariants:**
  - The password is never stored or printed.
  - Verification on a device needs no secret.
  - Only the pin file in `~/.config/ai-local/` is read or written.
  - Tests use a temporary pin (`AI_RULE_LOCK_PIN`).
- **Review:**
  - Round 1 returned REVISE, and every item was fixed:
    - a tampered set was still enforced when the pin was forged, unreadable, or absent with an invalid signature;
    - a rollback to an older set signed by the same key was accepted (now refused by a signed monotonic serial);
    - deleting the lock file switched enforcement off (now restored from the pin);
    - the identity or another small-order key verified any message (now refused);
    - rotation covered one hop only (now a signed key chain).
  - Each fix has a regression case, and a mutation that leaves the serial unsigned is killed.
- **Ledger:** `RUN-20261101T115148Z-86627391` finished **BLOCKED**: a concurrent session's uncommitted project-memory edits made the boundary, policy lint and system map fail; none of those files are in this commit.
- **Regression Checks:** `bin/ai-rule-lock-test` (adds: an edit without the password, a rule set re-signed with another password, a stripped signature, the owner's re-sign, endorsed rotation, rotation refused without the old password, a forged pin); seven hand mutations of the trust and signing logic are all killed.
- **Reopen Conditions:** a device accepts a rule set not signed by the pinned or endorsed key; the password reaches any file.
- **Escalation Conditions:** a dependency on non-stdlib crypto; reading other device-local files.
- **Non-Scope:** preventing a person with full device control from editing the tool or the pin.
