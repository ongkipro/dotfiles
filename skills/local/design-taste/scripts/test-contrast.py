#!/usr/bin/env python3
import importlib.util, subprocess, sys, tempfile
from pathlib import Path

S = Path(__file__).with_name("contrast.py")
spec = importlib.util.spec_from_file_location("contrast", S)
c = importlib.util.module_from_spec(spec); spec.loader.exec_module(c)
def run(*a): return subprocess.run([sys.executable, str(S), *a], capture_output=True, text=True)

# Known reference values.
assert abs(c.ratio(c.parse("#000"), c.parse("#fff")) - 21) < 1e-9
assert abs(c.ratio(c.parse("#fff"), c.parse("#fff")) - 1) < 1e-9
assert round(c.ratio(c.parse("#767676"), c.parse("#ffffff")), 2) == 4.54
assert round(c.ratio(c.parse("#777777"), c.parse("#ffffff")), 2) == 4.48
assert c.parse("rgb(255 0 0 / 50%)") == (255, 0, 0, 0.5)
assert c.parse("rgba(0, 0, 0, .5)") == (0, 0, 0, 0.5)
assert c.parse("#0008")[3] == 0x88 / 255

# Alpha compositing: 50% black over white = rgb(127.5) gray.
mid = c.ratio(c.parse("#000"), c.parse("rgba(0,0,0,0.5)"), c.parse("#fff"))
assert abs(mid - c.ratio(c.parse("#000"), (127.5, 127.5, 127.5, 1.0))) < 1e-9
assert c.ratio(c.parse("rgba(0,0,0,0.5)"), c.parse("#fff")) < 21  # translucent FG composited

# Large-text thresholds.
assert c.is_large(24, False) and not c.is_large(23.9, False)
assert c.is_large(18.66, True) and not c.is_large(18.66, False) and not c.is_large(18, True)
assert c.threshold("AA", True) == 3 and c.threshold("AAA", False) == 7 and c.threshold("AAA", True) == 4.5

# CLI: single pair, size handling, batch file, errors.
assert run("#767676", "#fff").returncode == 0
r = run("#777777", "#fff"); assert r.returncode == 1 and "4.47:1 FAIL" in r.stdout  # floored, never rounded up
assert run("#777777", "#fff", "--size", "24").returncode == 0
assert run("#777777", "#fff", "--size", "19", "--bold").returncode == 0
assert run("#777777", "#fff", "--size", "19").returncode == 1
assert run("#767676", "#fff", "--level", "AAA").returncode == 1
with tempfile.TemporaryDirectory() as d:
    f = Path(d, "pairs.txt")
    f.write_text("# tokens\n#000 on #fff  # body\nrgb(0 0 0 / 60%) on #fff\n\n")
    r = run("--file", str(f)); assert r.returncode == 0 and r.stdout.count("PASS") == 2, r.stdout
r = run("#000", "rgba(255,255,255,0.5)"); assert r.returncode == 2 and "--over" in r.stderr
assert run("#000 on rgba(255,255,255,0.5)", "--over", "#000").returncode == 0
assert run("#zzz", "#fff").returncode == 2
assert run().returncode == 2
print("PASS")
