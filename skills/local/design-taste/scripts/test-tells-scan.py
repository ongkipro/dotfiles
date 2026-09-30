#!/usr/bin/env python3
import subprocess, sys, tempfile
from pathlib import Path

S = str(Path(__file__).with_name("tells-scan.py"))
def run(*a): return subprocess.run([sys.executable, S, *a], capture_output=True, text=True)

with tempfile.TemporaryDirectory() as d:
    Path(d, "a.html").write_text('<p>LIS 14:23</p><div style="width:99.9%"></div><p>Real price $20</p>')
    Path(d, "b.tsx").write_text('<img alt="Acme dashboard" /><h1>Seamlessly elevate</h1>')
    r = run(d)
    assert r.returncode == 0, r.stderr
    assert "locale-clock" in r.stdout and "placeholder-name" in r.stdout and "filler-verb" in r.stdout
    assert "false-precision" not in r.stdout, "style attribute must not count as copy"
    assert "Real price" not in r.stdout
with tempfile.TemporaryDirectory() as d:
    Path(d, "data.ts").write_text("export const x = 'John Doe'")
    r = run(d)
    assert r.returncode == 2 and "NOT CHECKED" in r.stdout
print("PASS")
