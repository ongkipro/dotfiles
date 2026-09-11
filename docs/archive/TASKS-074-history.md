# Completed task history retained during TASK-074

Moved from the canonical root TASKS.md without changing the task records.

- **TASK-072 / REQ-TEST-EFFICACY (R2).** `mutation-sweep --subject <name>` mutates the
  subject instead of stubbing it, closing the limit recorded on 2026-09-04: stubbing asks
  whether a test asserts anything, mutating asks whether it would notice a plausible bug,
  and nine of ten tests passed the stub then fell to a hand mutation days later. Two
  operators only — a guard that stops firing, a refusal that stops refusing — because every
  defect found here was one of those two shapes and a wider set produces equivalent mutants
  that drown the signal. Opt-in and bounded: `ai-policy-lint` takes 14 seconds, so mutating
  it costs minutes. First run found real gaps — `inspect-project` 5, `dotpush` 8, `tmux-clip`
  4, `tmux-battery` 4. A subject the bash-shaped operators cannot reach reports UNMEASURED
  and fails the run; a 0 that means untested must not read as covered. It also checks the
  test passes UNMUTATED first, because a test already failing makes every mutant look killed.
  Two pre-existing bugs fixed on the way: the runner captured output through a command
  substitution, so an orphaned child kept the pipe open and a 2-second bound measured 30
  seconds; and the mutation runner did not close stdin while the stub runner did.

- **TASK-071 / REQ-TEST-EFFICACY (R2).** The last four commands with no test now have
  one: `dotpush` (commits and pushes), `vps-pgdump` (ssh, pg_dump, credentials),
  `tmux-setup` (installs), `pi-update-safe` (npm). None reaches a network, installs, or
  reads a secret — each drives a shim, and `dotpush`'s fixture repository has no remote
  so a regression past the refusal fails on that rather than pushing. Every `bin/` command
  now has a test. Five subject mutations bite, including `vps-pgdump` loosening `umask 077`
  and `tmux-setup` deleting a user's `.tmux.conf` instead of backing it up. One escaped
  first: `dotpush`'s two aborts overlap, so asserting only "it aborted" could not tell a
  missing scanner from a failing scan — different messages, different fixes, and the case
  now names which. Two of my assertions were wrong before the subjects were: `pi-update-safe`
  archives leftover `*.backup.*` artefacts, not the skills themselves, and `tmux-setup`
  fetching an unreachable TPM pin is its documented behaviour, not a violation.

