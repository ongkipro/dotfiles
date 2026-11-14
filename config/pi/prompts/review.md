---
description: Independent cross-family review of the current changes (or a named target)
argument-hint: "[target: staged | <ref> | <path> | plan] [focus]"
---
Run an independent review through the `reviewer` subagent. Target and focus: ${@:-the uncommitted changes in this repository; focus on correctness, edge cases, security and missing tests}.

1. Resolve the target before delegating. Default: `git status --short` plus `git diff HEAD` (staged and unstaged). `staged` means `git diff --cached`; a ref or range means `git diff <ref>`; a path narrows to that path; `plan` means the current plan or the planning file named in the arguments. If there is nothing to review, say so and stop. The reviewer cannot run shell commands or read committed ranges, so pass a committed range as a patch file: write it with `git diff <range> > /tmp/review-<short-sha>.patch` and name that file.
2. Pick the reviewer model from the Review pairing in `~/dotfiles/config/pi/README.md`, never the implementer's family. Claude implementer (Opus or Sonnet): leave `model` unset, so the `reviewer` override (GPT-6.1 Sol) applies, or pass `9router-fantastico/ag/gemini-4-carbon-high` for a broad plan or architecture read. GPT implementer: pass `9router-fantastico/cc/claude-opus-5-5`. Gemini implementer: pass `9router-fantastico/cc/claude-opus-5-5`. A model named in the arguments wins.
3. Call `subagent` once with `agent: "reviewer"`, `context: "fresh"`, and a task that states the repository path, the exact target (files, diff command or patch path), the intent of the change, any requirement or task ID it serves, and the focus. Ask for the reviewer's standard output: P0/P1/P2 findings with file:line evidence and a merge verdict.
4. Do not trust findings blindly. Check each P0/P1 against the code and reproduce it when cheap. Mark each one confirmed, rejected (with the reason), or unverified.
5. Report in casual Bahasa Indonesia, addressing Paduka Ongki (code, paths, identifiers and severity labels stay English): the reviewer model, the target, the findings with your verdict on each, and the merge verdict. Do not edit files in this command; propose fixes and wait for approval.
