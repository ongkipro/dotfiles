---
name: Auto-deploy after push
description: GitHub Actions auto-deploys on push to main; only SSH manually if Actions fails
type: feedback
originSessionId: 2cf54083-cda3-4a22-980a-76f90d4bb2c3
---
After `git push origin main`, **GitHub Actions deploys automatically** via `.github/workflows/deploy.yml` — no need to SSH manually after every push.

**Why:** The repo has an auto-deploy workflow that triggers on every push to main, runs `deploy.sh` on the production server. The user explicitly said "kedepan nya langsung kamu deploy sendiri" — they don't want to copy-paste deploy commands. The right answer is "let GH Actions handle it" (the system already does), not "I'll SSH every time."

**How to apply:**
- After `git push origin main`, do NOT run `ssh ... bash deploy.sh` manually unless something is wrong.
- To verify a push deployed successfully:
  - `gh run list --workflow=deploy.yml --limit 3` (needs `gh auth login` once)
  - Or: tell the user "watching GH Actions" and let them confirm green/red.
- If Actions fails (red), then SSH manually to debug:
  - `ssh irwansyah10@103.93.161.104 'cd ~/kelola && bash deploy.sh'`
  - Or fetch the Action's failed log via `gh run view --log-failed <run-id>`.
- For non-code config (env vars, GPG keys, DB rows) GH Actions can't help — still walk the user through manual server steps.
