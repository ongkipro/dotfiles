#!/usr/bin/env python3
import subprocess, sys, tempfile
from pathlib import Path

S = str(Path(__file__).with_name("tells-scan.py"))
def run(*a): return subprocess.run([sys.executable, S, *a], capture_output=True, text=True)

# Text mode: existing and new copy tells.
with tempfile.TemporaryDirectory() as d:
    Path(d, "a.html").write_text(
        '<p>LIS 14:23</p><div style="width:99.9%"></div><p>Real price $20</p>\n'
        '<p>Email johndoe@example.com or call (555) 123-4567</p>\n'
        '<p>A revolutionary, AI-powered game-changer</p>\n'
        '<span>Most popular</span><span>Scroll to explore</span>\n'
        '<h2>🚀 Launch faster</h2><button>Buy ✨</button>\n'
        '<p>Harga Rp 555.000 — siap kirim</p>\n'
        '<a href="/s">Get started</a> <button>Start free trial</button> <a href="/j">Sign up</a>\n'
        '<a href="/c">Contact us</a>\n'
        '<a href="/w">Read the case study →</a><p>Jakarta · B2B · Since 2019</p>\n'
        '<p>Price · per month</p>\n')
    Path(d, "b.tsx").write_text('<img alt="Acme dashboard" /><h1>Seamlessly elevate</h1>')
    r = run(d)
    out = r.stdout
    assert r.returncode == 0, r.stderr
    for tag in ("locale-clock", "placeholder-name", "filler-word", "placeholder-contact",
                "unsourced-badge", "scroll-cue", "emoji-in-heading", "emoji-in-button",
                "arrow-label", "middot-meta"):
        assert tag in out, f"missing {tag}\n{out}"
    assert "cta-intent: one start/sign-up intent under 3 labels" in out, out
    assert "contact/sales" not in out, "a single label per intent is not a finding"
    assert out.count("placeholder-contact") == 1, "price 555.000 must not count as a 555 phone"
    assert "false-precision" not in out, "style attribute must not count as copy"
    assert "Real price" not in out
    assert out.count(": middot-meta:") == 1, "a single middot is not a meta string"
    assert "info: 1 em-dash" in out and "em-dash:" not in out, "em-dash is info only, not a tell"

# CSS mode.
with tempfile.TemporaryDirectory() as d:
    Path(d, "site.css").write_text(
        "html, body { overflow-x: hidden; }\n"
        ".eyebrow { text-transform: uppercase; letter-spacing: .2em; }\n"
        ".hero { min-height: 100vh; }\n"
        ".grid { grid-template-columns: 320px 1fr; }\n"
        ".ok { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }\n"
        ".dot { animation: blink 1s infinite; }\n"
        "button:focus { outline: none; }\n"
        ":root { --bg: #F4F1EA; --accent: #d97757; --ink: #1a1a1a; }\n")
    Path(d, "Page.astro").write_text(
        '<main class="overflow-x-hidden"><section class="h-screen">\n'
        '<p class="text-xs uppercase tracking-widest">Field notes</p></section>\n'
        '<section><p class="tracking-wide uppercase">Index</p></section></main>\n'
        "<script>window.addEventListener('scroll', f)</script>\n")
    Path(d, "Good.tsx").write_text(
        '<button className="outline-none focus-visible:ring-2">Ok</button>\n')
    r = run("--css", d)
    out = r.stdout
    assert r.returncode == 0, r.stderr
    for tag in ("overflow-x-hidden", "full-height", "fixed-grid-px", "pulse-infinite",
                "outline-removed", "scroll-listener", "micro-labels", "default-look-palette"):
        assert tag in out, f"missing {tag}\n{out}"
    assert out.count(": fixed-grid-px:") == 1, "minmax() tracks must not count as fixed px"
    assert out.count(": overflow-x-hidden:") == 2, out
    assert "2 uppercase tracked label(s) vs 2 <section>(s)" in out, out
    assert "Good.tsx" not in out, "outline removal with focus-visible in the same file is fine"
    assert out.count(": outline-removed:") == 1

# Not applicable.
with tempfile.TemporaryDirectory() as d:
    Path(d, "data.ts").write_text("export const x = 'John Doe'")
    r = run(d)
    assert r.returncode == 2 and "NOT CHECKED" in r.stdout
    r = run("--css", d)
    assert r.returncode == 2 and "NOT CHECKED" in r.stdout
print("PASS")
