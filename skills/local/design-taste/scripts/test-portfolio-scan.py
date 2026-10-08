#!/usr/bin/env python3
import subprocess, sys, tempfile
from pathlib import Path

S = str(Path(__file__).with_name("portfolio-scan.py"))
def run(*a): return subprocess.run([sys.executable, S, *a], capture_output=True, text=True)

with tempfile.TemporaryDirectory() as d:
    def project(name, css, extra=None):
        p = Path(d, name); (p / "src/styles").mkdir(parents=True)
        (p / "package.json").write_text('{"name": "shop-engine"}' if name in ("beta", "gamma") else "{}")
        (p / "src/styles/global.css").write_text(css)
        for rel, text in (extra or {}).items():
            (p / rel).parent.mkdir(parents=True, exist_ok=True); (p / rel).write_text(text)
    project("alpha", ":root{--radius:2px;--primary:#7a1f1f}\nbody{font-family:'Plus Jakarta Sans',system-ui,sans-serif}")
    project("beta", "body{font-family:Inter,system-ui,-apple-system,sans-serif}\n:root{--radius:2px}",
            {"DESIGN.md": "# Beta\n\n## Direction\n- Editorial type-led, left aligned\n"})
    project("gamma", "body{font-family:Inter,sans-serif}\n:root{--color-accent:#0b5}")
    project("delta", "body{font-family:system-ui,sans-serif}",
            {"src/app/layout.tsx": "import { Space_Grotesk, Inter } from 'next/font/google'\n"})
    project("eps", "@import '@fontsource-variable/bricolage-grotesque';\nbody{font-family:var(--x, serif)}",
            {"astro.config.mjs": "integrations: [{ name: 'dev-spesimen' }],\nfonts: [{ name: 'Fraunces', cssVariable: '--f' }]\n"})
    r = run(d)
    out = r.stdout
    assert r.returncode == 0, r.stderr
    assert "alpha: fonts=Plus Jakarta Sans; radius=2px; accent=#7a1f1f" in out, out
    assert "direction=Editorial type-led, left aligned" in out, out
    assert "delta: fonts=Space Grotesk, Inter" in out, "next/font imports count, system stack does not"
    assert "eps: fonts=Bricolage Grotesque, Fraunces;" in out, "only names inside fonts: [] count"
    assert "font: Inter ×3" in out, out
    assert "radius: 2px ×2" in out, out
    assert "shared template: 2 projects are package 'shop-engine'" in out, out
    assert "system-ui" not in out.split("recent")[0], "generic families are not choices"

with tempfile.TemporaryDirectory() as d:
    r = run(d)
    assert r.returncode == 2 and "NOT CHECKED" in r.stdout
print("PASS")
