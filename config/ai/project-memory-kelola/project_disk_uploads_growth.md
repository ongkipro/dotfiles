---
name: disk-uploads-growth
description: "Prod uploads (24G, mostly video) now live on additional 60G volume /dev/sdb mounted at /data; backend/uploads is a symlink; volume must stay renewed (expire 29 Aug 2026)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4f4914ea-7c75-4398-b8ed-ea2a10af6730
---

2026-07-29 prod (103.93.161.104) hit 100% disk (58G). Root cause: `~/kelola/backend/uploads` = 24G, ~22G user-uploaded video (`doc_*.mp4`/`.mov`, 80–115MB each). Fixed same day in two steps:

1. **Cache cleanup freed ~8.5G:** `rm -rf ~/.cache/ffmpeg-static-nodejs` (4.4G), `pm2 flush` (1.4G), `rm -rf ~/.npm/_cacache` (1.9G), `sudo journalctl --vacuum-size=200M` (~1G).
2. **Uploads moved to new 60G volume** (panel "Additional Disk" `diskkelola`): formatted `/dev/sdb` ext4, mounted at `/data` (fstab by UUID, `nofail`), rsync'd 24G, then during a ~10s `pm2 stop kelola-backend` window did final `rsync --delete` + swapped `~/kelola/backend/uploads` → **symlink to `/data/uploads`**. Verified 5072 files / bytes identical, deleted old copy. Result: `/` at 44%, `/data` at 42%.

**⚠️ The volume is billed separately and shows Expire Date 29 Aug 2026** — if it lapses, ALL uploads disappear. It must be auto-renewed/paid.

**Why:** uploads keep growing; main disk alone (58G) filled in ~2 months.
**How to apply:** new deploys/backups shouldn't copy uploads (it's a symlink now — `git reset --hard` doesn't touch it, but any script doing `rm -rf backend/*` or dereferencing rsync `-L` would). If `/data` fills too, revisit object storage (R2) or retention limits. Disk checks: `df -h / /data`. See [[deploy-command]].
