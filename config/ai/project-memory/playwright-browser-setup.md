---
name: playwright-browser-setup
description: "Browser automation stack on this Linux box — agent-browser, Playwright, system Chrome; what's installed and how to launch"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 85298ebc-bb43-4139-914e-5b92de5e7aea
---

Browser automation stack on Linux (`rich`, headless `multi-user.target`). See [[pi-9router-setup]].

## Active invariants

- **Single system browser:** Google Chrome `.deb` at `/usr/bin/google-chrome` (Google apt repo; `/snap/bin/chromium` was purged). Suites that set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` must point to `/usr/bin/google-chrome`.
- **How to launch Playwright:** prefer system Chrome (`chromium.launch({ channel: 'chrome' })`) for full fonts/codecs (CJK + emoji verified); bundled Chromium (`chromium.launch({ headless: true })`) is fallback.
- **Playwright packages & cache:** there is no global `playwright` npm module on `rich` (`require('playwright')` from global root fails; use project-local or scratch `playwright-core` with `executablePath` if driving programmatically). Cached Playwright browsers in `~/.cache/ms-playwright/` include `chromium-1228` (projects pinning 1.61.1) and `chromium-1248` (1.64.1).
- **Playwright MCP:** registered once in `config/ai/mcp-servers.json` (`@playwright/mcp --browser chrome --headless --isolated`) and synced across runtimes by `ai-mcp-sync`. `pi` has built-in MCP (`pi mcp list`), so `pi-mcp-adapter` is not needed.
- **`chrome-devtools-mcp` profile lock:** refuses to attach whenever another Chrome instance holds `~/.cache/chrome-devtools-mcp/chrome-profile`.
- **`agent-browser` AppArmor invariant:** `agent-browser` (>= 0.43.0 for `pi-agent-browser-native`) must use `/usr/bin/google-chrome` via `config/agent-browser/config.json` -> `~/.agent-browser/config.json`. Downloaded Chrome for Testing fails under Ubuntu `kernel.apparmor_restrict_unprivileged_userns = 1` (`No usable sandbox`); only `/opt/google/chrome/chrome` has an AppArmor profile (`/etc/apparmor.d/chrome`). Upgrade Chrome via `sudo apt install --only-upgrade google-chrome-stable`, not `agent-browser install`.
- **`playwright install-deps`:** optional (only for extra CJK/Thai/gstreamer libs) and requires interactive `sudo`.

---

## Timeline (recent verifications)

- **2026-11-18 (`rich`):** `agent-browser` 0.43.0 pinned to system Chrome 157.0.8103.78; unused Chrome for Testing (408 MB) moved to `/data/backups/agent-browser-cft-20261118/`.
- **2026-11-03 (`rich`):** GNOME/gdm/xorg and snapd (snap Chromium) purged; `/usr/bin/google-chrome` verified with `playwright screenshot --channel chrome` (CJK + emoji).
- **2026-11-02:** Playwright MCP standardized in `config/ai/mcp-servers.json` via `ai-mcp-sync`.
- **2026-10-29 (`99ribu`):** mise node 24.22.1 with `@playwright/test` 1.64.1 (`chromium-1248`, `webkit-2370`).
