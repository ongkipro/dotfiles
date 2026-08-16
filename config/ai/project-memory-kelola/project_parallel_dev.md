---
name: user-develops-in-parallel-check-origin-before-committing
description: Uncommitted edits may already be in origin/main on a later turn — the user/their tooling commits & pushes in parallel
metadata: 
  node_type: memory
  type: project
  originSessionId: a2576a0d-1588-4926-b7b1-0be7126c716c
---

The user actively develops in a parallel session/checkout of the same repo. Their tooling commits and pushes to `origin/main` between (and sometimes during) our turns. Observed 2026-06: mid-feature, `git status` showed only 1 of ~10 edited files as modified — the other 9 already matched HEAD/origin because a parallel commit had absorbed identical changes, and 5 unrelated commits (social-inbox, knowledge) had landed on top of my last commit.

**Implications / how to work:**
- Before committing, run `git status` + `git log --oneline -6` to see what already landed. Don't assume your working tree is the only source of changes.
- Some files I "edit" may show no `git diff` because the content already exists in HEAD — that's fine, not an error. Verify with `git show HEAD:<file> | grep ...` if unsure.
- Deployment scripts may replace the checkout, so preserve authorized work in a reviewed commit before an approved deployment. This observation does not grant commit, push, or deploy authority.
- System reminders saying a file was "modified by the user or a linter" are this parallel work — take them into account, don't revert.
- See [[feedback_deploy_collision]] for the related ENOTEMPTY/node_modules corruption from concurrent deploys.
