# AI Memory Sync — Linux + macOS

Tujuan: bikin `~/dotfiles` jadi **source of truth** untuk memori bersama, aturan kerja, dan config AI lintas device.

## Prinsip

- Repo: `github.com/ongkipro/dotfiles`
- Semua AI boleh **read** memory/config dari repo ini.
- Perubahan **durable** boleh ditulis ke repo.
- Sync model: **semi-auto** → review singkat, commit lokal, lalu push opsional.
- Jangan pernah commit secret, token, credential, session, cache, atau artefak sementara.

## Struktur utama

- `config/ai/AGENTS.md` → context ringkas global
- `config/ai/memory/*.md` → memory lintas sesi/device
- `skills/local/` → local skills untuk semua AI CLI
- `bin/dotsync` → helper sync lintas Linux/macOS

## Flow yang disarankan

### Di device aktif
1. AI atau user update file penting di `~/dotfiles`
2. Jalankan `dotsync status`
3. Jalankan `dotsync sync`
4. Review staged preview
5. Konfirmasi commit
6. Pilih push sekarang atau nanti

### Di device lain
- Jalankan `dotsync pull`
- atau `cd ~/dotfiles && git pull --ff-only`

Karena live config memakai symlink ke repo, perubahan yang ter-pull langsung aktif.

## Command utama

```bash
dotsync status              # lihat perubahan
dotsync commit              # commit lokal dengan konfirmasi
dotsync commit "memory: update workflow"
dotsync push                # push dengan konfirmasi
dotsync pull                # pull ff-only dengan konfirmasi
dotsync sync                # commit lalu tanya push
dotsync doctor              # cek path penting + status repo
```

Kalau butuh non-interaktif (mis. dipanggil tool setelah approval eksplisit):

```bash
dotsync --yes commit "memory: sync"
dotsync --yes push
```

## Kenapa aman untuk macOS juga?

Script `bin/dotsync`:
- pakai `bash` portable
- tidak bergantung pada `systemd`
- tidak memakai GNU-only flags yang rawan beda di macOS
- snapshot file yang ada saja (`.bashrc`, `.zshrc`, VS Code settings Linux/macOS)

## Semi-auto policy untuk AI

AI boleh menawarkan sync jika:
- perubahan durable
- bukan secret
- relevan lintas sesi/device

AI **tidak** boleh push diam-diam tanpa approval user.

Template approval:

> Ada perubahan durable di dotfiles/shared memory. Mau saya buat commit lokal dulu? Push bisa menyusul setelah kamu review.

## Scheduler opsional

Kalau nanti mau otomatis ringan:

- Linux: `systemd --user` timer atau shell login hook
- macOS: `launchd` atau shell login hook

Tetap sarankan **auto-pull only** untuk background sync. Auto-commit/push sebaiknya tetap butuh approval.

## Guardrails

Masukkan ke `.gitignore` atau jaga tetap untracked:
- `.env*`
- `*auth*.json`
- token / credential files
- session folders
- cache, logs, screenshots, temporary exports

## Rekomendasi operasional

- Default harian: `dotsync sync`
- Device baru: clone repo, jalankan `install.sh`, lalu `dotsync doctor`
- Kalau AI update memory penting, commit ke dotfiles di hari yang sama biar device lain tetap sinkron
