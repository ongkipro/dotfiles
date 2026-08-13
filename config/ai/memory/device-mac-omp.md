# Setup OMP Khusus Mac (ongkis-MacBook-Air)

> **Status:** Catatan Backup / Referensi
> File ini sengaja dibuat agar konfigurasi khusus Mac ini (Minimax + OpenCode Go) ikut ter-backup ke GitHub, tanpa menabrak konfigurasi default global di perangkat lain.

Mesin Mac ini (`ongkis-MacBook-Air`) memiliki keistimewaan login akun Minimax yang **unlimited**. Oleh karena itu, otak OMP di mesin ini secara khusus diganti (*override*) menggunakan *local overlay*.

## Cara Kerja
Fungsi `omp()` di `shell-tools.sh` / `zshrc.tools.sh` telah diatur agar mengecek keberadaan file rahasia di:
`~/.config/ai-local/omp-overlay.yml`

Jika file tersebut ada, OMP akan membacanya untuk menggantikan Antigravity, **khusus untuk sesi chat utama**. (Perintah seperti `omp models` atau `omp agents` akan tetap menggunakan default global agar tidak *crash*).

## Backup Konfigurasi Overlay
Jika suatu saat mesin Mac ini di-reset atau di-install ulang, cukup *copy-paste* blok YAML di bawah ini, dan simpan kembali ke `~/.config/ai-local/omp-overlay.yml`.

```yaml
# Overlay OMP Khusus Device (ongkis-MacBook-Air)
# Tujuan: Development murni menggunakan MiniMax (Native) dan OpenCode Go

modelRoles:
  # --- Lane Ringan & Cepat ---
  tiny: minimax-code/MiniMax-M2.5-lightning:low
  smol: minimax-code/MiniMax-M2.7-highspeed:medium

  # --- Lane Development Utama ---
  default: minimax-code/MiniMax-M3:medium
  task: minimax-code/MiniMax-M3:medium
  plan: minimax-code/MiniMax-M3:high
  
  # Logic Berat (Precision/Slow Lane) 
  slow: minimax-code/MiniMax-M3:high

  # --- Lane Visual (Image Support) ---
  vision: minimax-code/MiniMax-M3:high
  designer: minimax-code/MiniMax-M3:high

  # --- Lane Research & Review ---
  research: minimax-code/MiniMax-M3:high
  
  # --- Lane Advisor (Independent Judgement) ---
  # Advisor standar dialihkan ke Minimax (gratis/unlimited)
  advisor: minimax-code/MiniMax-M3:high
  
  # Tetap menggunakan ekosistem OpenCode Go untuk level nalar absolut
  advisor-xhigh: opencode-go/deepseek-v4-pro:xhigh
  advisor-max: opencode-go/deepseek-v4-pro:max

modelProviderOrder:
  - minimax-code
  - opencode-go
  - openai-codex
  - anthropic

cycleOrder:
  - smol
  - default
  - slow
```

**Kredensial yang dibutuhkan:**
Pastikan `MINIMAX_API_KEY` dan `OPENCODE_API_KEY` juga sudah dimasukkan ke dalam `~/.config/ai-local/secrets.env`.
