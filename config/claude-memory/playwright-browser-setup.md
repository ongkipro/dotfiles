---
name: playwright-browser-setup
description: "Browser automation stack on this Linux box — agent-browser, Playwright, system Chrome; what's installed and how to launch"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 85298ebc-bb43-4139-914e-5b92de5e7aea
---

Browser automation for pi.dev + general CLI use, set up 2026-06-25. See [[pi-9router-setup]].

**Installed (global, nvm node v24.16.0):**
- `agent-browser` **0.30.1** — engine for pi's `agent_browser` tool (pkg `pi-agent-browser-native`). Was 0.28.0, bumped to 0.30.1 to clear the wrapper's "version drift" doctor error. Drives the SYSTEM browser, has zero npm deps, does NOT need Playwright.
- `playwright` + `@playwright/test` **1.61.1** (global). NOTE: global install means the `playwright` CLI works everywhere, but scripts doing `require('playwright')` need `NODE_PATH=$(npm root -g)` (node won't auto-resolve global modules for import/require).
- Playwright browsers in `~/.cache/ms-playwright/`: `chromium-1228`, `chromium_headless_shell-1228`, `ffmpeg-1011`. Both bundled headless launch AND system-Chrome channel verified working (open example.com).

**System browsers (pre-existing):** Google Chrome 149 (`/usr/bin/google-chrome`), Chromium 149 (snap). 

**How to launch (two options):**
- System Chrome (PREFERRED — real Chrome 149, all fonts/codecs present, no extra install): `chromium.launch({ channel: 'chrome' })`.
- Bundled chromium (fallback): `chromium.launch({ headless: true })`.

**install-deps:** `playwright install-deps` reports 59 missing libs (CJK/Thai fonts, gstreamer, video codecs) but these are OPTIONAL — bundled chromium still launches & renders pages without them. Only needed for CJK-font screenshots or in-page audio/video. Requires sudo PASSWORD (passwordless sudo NOT available here), so Claude can't run it; user must: `sudo env PATH=$PATH playwright install-deps chromium`. Not done as of 2026-06-25.
