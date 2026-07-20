---
name: skills-vs-memory-boundary
description: "Konteks project (Volumup, TokoΦ, dst) TETAP di memori — jangan pernah dijadikan skill"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 5d5ae19e-dfd5-45e1-bce7-c56c1c868e3c
  modified: 2026-07-20T14:46:11.536Z
---

Konteks spesifik-project — Volumup, TokoΦ, Petani Sejahtera, AUSSIE, Kamus — **selalu jadi memori (`~/.claude/projects/-Users-ongki/memory/`), tidak pernah jadi skill di `~/dotfiles/skills/local/`.**

**Why:** skill itu pengetahuan **reusable lintas-project** yang dimuat on-demand (cara pakai GSAP, aturan copywriting, native-first per-stack). Memori itu **fakta satu project** yang berubah seiring waktu. Menjadikan project sebagai skill akan: (1) mengotori daftar skill keempat CLI dengan hal yang cuma relevan di satu repo, (2) menciptakan sumber kedua yang bertentangan dengan `STATUS.md`/`BUILD-LOG` di repo itu sendiri — padahal aturannya **disk menang**.

**How to apply:** kalau Ongki cerita soal progres/keputusan sebuah project → tulis/-update file memori project-nya, jangan bikin `SKILL.md`. Progres kode tetap dibaca dari `STATUS.md` di repo; memori hanya menyimpan konteks bisnis/legal/keputusan yang TIDAK bisa disimpulkan dari kode atau git history. Lihat [[volumup]], [[skill-plumbing]].
