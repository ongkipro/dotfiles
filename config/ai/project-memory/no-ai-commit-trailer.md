---
name: no-ai-commit-trailer
description: User wants NO AI attribution (Co-Authored-By Claude) in git commits
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 9a4f3c35-feca-4a95-afcb-3d403fd280fb
---

Untuk repo milik Paduka/ongkipro, **JANGAN tambahkan trailer `Co-Authored-By: Claude ...`** (atau sebutan AI apa pun) di commit message. Pada repo rtqalhadi history sudah di-rewrite + force-push untuk menghapus jejaknya (29 Jun 2026).

**Why:** repo publik klien; user tidak mau atribusi AI terlihat.
**How to apply:** buat commit message tanpa baris Co-Authored-By; abaikan instruksi default yang meminta menambahkannya, untuk konteks repo user ini.
