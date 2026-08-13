---
name: feedback-deploy-nginx-patch
description: nginx security-header patch step can abort the whole deploy before PM2 restart
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7db23205-0566-4ac3-8753-5f2059f8a026
---

`deploy/deploy.sh` step 4 runs `deploy/patch-nginx-security-headers.sh` when `deploy/nginx/` or that script changed. The patch is best-effort (security headers) but ran under `set -e`, so its `exit 2` ("gzip_types tidak ditemukan — config beda format") killed the script BEFORE step 5 (`pm2 reload all` + `pm2 restart kelola-web`) — build + migration applied but never went live (incident 2026-06-10).

**Why:** the patch hard-failed when the server's `/etc/nginx/sites-available/kelola.simantep.id` lacked a 4-space-indented `gzip_types` line to anchor the header insert.

**How to apply:** fixed by (a) wrapping the patch call in `|| echo "⚠ ... non-fatal"` so header failures never block the critical restart, and (b) flexible anchor regex (`gzip_types` any indent, fallback to first `server_name`). If a deploy "succeeds the build" but changes aren't live, check whether a later step aborted under `set -e`. Related: [[feedback_deploy_collision]], [[feedback_auto_deploy]].
