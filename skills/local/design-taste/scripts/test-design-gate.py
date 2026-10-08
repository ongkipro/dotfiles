#!/usr/bin/env python3
import os, subprocess, sys, tempfile, time
from pathlib import Path

S = str(Path(__file__).with_name("design-gate.py"))
V = str(Path(__file__).with_name("visual-review.py"))
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
  <h1 class="text-5xl">Atap presisi di
    <span class="text-amber-400">Yogyakarta</span></h1>
  <div class="text-2xl sm:text-3xl font-bold">
    [Placeholder: 450+]
  </div>
</section>
<script>// comment // in code is not displayed text</script>
"""
CLEAN = """<section>
  <h2 class="text-balance">Survei lokasi <span class="text-nowrap">gratis</span></h2>
  <p class="text-3xl">Rp 0</p><p class="text-sm">[Placeholder: alamat]</p>
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
    for tag in ("refs", "critique", "review", "mono", "slash", "numbered", "accent", "labels",
                "headline", "stat"):
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
        "## Render critique\nAuthor: agy/gemini\n\n- shots/390.png: ok\n- shots/1440.png: ok\n\n## Next\n- shots/old.png\n")
    # The review comes from visual-review.py through ai-ask; a stub stands in for the CLI.
    stub = root / "bin"
    stub.mkdir()
    (stub / "ai-ask").write_text("#!/bin/sh\necho \"1. Hero | authored | none | keep\"\n"
                                 "echo \"Verdict: $(cat \"$VERDICT_FILE\")\"\n")
    (stub / "ai-ask").chmod(0o755)
    env = dict(os.environ, PATH=f"{stub}:{os.environ['PATH']}", VERDICT_FILE=str(root / "v"))
    def review(who, verdict):
        (root / "v").write_text(verdict)
        return subprocess.run([sys.executable, V, d, "--reviewer", who], capture_output=True, text=True, env=env)
    r = review("agy", "PASS")
    assert r.returncode == 2 and "another family" in r.stdout, r.stdout
    r = review("claude", "REVISE")
    assert r.returncode == 1 and "Verdict: REVISE" in r.stdout, r.stdout + r.stderr
    r = run(d)
    assert r.returncode == 1 and "verdict REVISE" in r.stdout, r.stdout
    r = review("claude", "PASS")
    assert r.returncode == 0, r.stdout + r.stderr
    r = run(d)
    assert r.returncode == 0, r.stdout
    assert "2 ui-ref capture dir(s)" in r.stdout and "2 existing screenshot(s)" in r.stdout, r.stdout

    # Hand edits and hand-written reviews do not pass; a re-render needs a re-review.
    rv = root / "design/review.md"
    good = rv.read_text()
    rv.write_text(good.replace("Verdict: PASS", "Verdict: PASS\nAll sections authored."))
    assert "not written by scripts/visual-review.py" in run(d).stdout
    rv.write_text("Reviewer: claude\nScreenshots: shots/390.png, shots/1440.png\n\nVerdict: PASS\n")
    assert "not written by scripts/visual-review.py" in run(d).stdout
    rv.write_text(good)
    (root / "shots/390.png").write_bytes(b"png2")
    assert "screenshots changed after the review" in run(d).stdout
    (root / "shots/390.png").write_bytes(b"png")
    assert run(d).returncode == 0

    # The round cap stops endless REVISE loops.
    for _ in range(3):
        review("claude", "REVISE")
    r = review("claude", "PASS")
    assert r.returncode == 2 and "cap 5" in r.stdout, r.stdout
    assert len((root / "design/review-rounds.log").read_text().splitlines()) == 5

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
