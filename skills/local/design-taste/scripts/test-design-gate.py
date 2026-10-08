#!/usr/bin/env python3
import os, subprocess, sys, tempfile, time
from pathlib import Path

S = str(Path(__file__).with_name("design-gate.py"))
def run(*a): return subprocess.run([sys.executable, S, *a], capture_output=True, text=True)

SLOP = """---
const x = "a // b";
---
<section class="bg-slate-900">
  <span class="font-mono text-xs uppercase tracking-widest text-blue-500">
    Spesialis Atap // Wilayah Jogja
  </span>
  <p class="font-mono uppercase tracking-wider">03 / Analitik</p>
  <p class="font-mono uppercase tracking-wider">Layanan 01</p>
  <p class="font-mono uppercase tracking-wider">Layanan 02</p>
  <p class="font-mono uppercase tracking-wider">Gambar Kerja // Detail</p>
  <a class="bg-blue-600 border-blue-600 ring-blue-500 text-indigo-600 from-violet-600 to-blue-700">x</a>
  <i class="font-mono"></i><i class="font-mono"></i><i class="font-mono"></i><i class="font-mono"></i>
</section>
<script>// comment // in code is not displayed text</script>
"""
CLEAN = """<section>
  <h2>Survei lokasi gratis</h2>
  <ol><li><span>01</span> Survei</li><li><span>02</span> RAB</li><li>Step 03</li></ol>
  <a class="bg-[--accent]" href="https://example.org/a//b">Minta survei</a>
</section>
"""

with tempfile.TemporaryDirectory() as d:
    root = Path(d)
    (root / "src").mkdir()
    (root / "src/Slop.astro").write_text(SLOP)
    (root / "DESIGN.md").write_text("# Design\n\nReferences: `design/refs/a/`\n")
    r = run(d)
    assert r.returncode == 1, r.stdout
    for tag in ("refs", "critique", "mono", "slash", "numbered", "accent", "labels"):
        assert f"FAIL    {tag}:" in r.stdout, f"missing {tag}\n{r.stdout}"
    assert "slash: 2 " in r.stdout, "frontmatter and <script> are not displayed text\n" + r.stdout
    assert "Slop.astro:6" in r.stdout, "multi-line text reports its own line\n" + r.stdout

    # Brief asked for the look: allowed, reported, not hidden.
    (root / "DESIGN.md").write_text("# Design\ngate-allow: mono - terminal brand asked for by owner\n")
    r = run(d)
    assert "ALLOWED mono:" in r.stdout and r.returncode == 1, r.stdout

    # Clean source with real captures and fresh screenshots passes.
    (root / "src/Slop.astro").unlink()
    (root / "src/Clean.astro").write_text(CLEAN)
    for ref in ("a", "b"):
        (root / "design/refs" / ref).mkdir(parents=True)
        (root / "design/refs" / ref / "ref.json").write_text("{}")
    (root / "shots").mkdir()
    for w in ("390", "1440"):
        (root / f"shots/{w}.png").write_bytes(b"png")
    (root / "DESIGN.md").write_text(
        "# Design\n\n## References\n\n| a | `design/refs/a/` |\n| b | [b](design/refs/b) |\n\n"
        "## Render critique\n\n- shots/390.png: ok\n- shots/1440.png: ok\n\n## Next\n- shots/old.png\n")
    r = run(d)
    assert r.returncode == 0, r.stdout
    assert "2 ui-ref capture dir(s)" in r.stdout and "2 existing screenshot(s)" in r.stdout, r.stdout

    # Source edited after the critique: screenshots are stale.
    past = time.time() - 60
    for w in ("390", "1440"):
        os.utime(root / f"shots/{w}.png", (past, past))
    r = run(d)
    assert r.returncode == 1 and "older than the source" in r.stdout, r.stdout

    # Not applicable.
    (root / "DESIGN.md").unlink()
    assert run(d).returncode == 2
print("PASS")
