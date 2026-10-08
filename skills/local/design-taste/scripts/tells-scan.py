#!/usr/bin/env python3
"""Flag invented-information and template tells (see references/invented-info-tells.md).

Usage: tells-scan.py [--css] PATH [PATH...]
Default (text) mode scans .html/.astro/.jsx/.tsx/.vue/.svelte/.liquid for text
between tags plus alt/aria-label/placeholder/title, emoji in headings/buttons,
one action intent shown under several button/link labels, a trailing `→` on
labels, and `A · B · C` meta strings.
--css mode scans .css/.scss/.astro/.jsx/.tsx/.vue/.svelte/.html source for style
habits: uppercase tracked micro-labels vs sections, 100vh/h-screen, outline
removal without :focus-visible, fixed-px grid columns, pulse/infinite
animation, scroll listeners, overflow-x hidden on html/body/main, and the
cream/terracotta generated-look hex values (#F4F1EA, #D97757).
Findings are QUESTIONS for the brief, not defects. The scan is line-based:
multi-line elements and copy held in JS/TS/JSON/CMS data are not seen.
Exit 0 = ran (findings or clean), 2 = not applicable (no scannable files): report
that as "not checked", never as passed.
"""
import re, sys
from collections import defaultdict
from pathlib import Path

TEXT_EXT = {".html", ".astro", ".jsx", ".tsx", ".vue", ".svelte", ".liquid"}
CSS_EXT = {".css", ".scss", ".astro", ".jsx", ".tsx", ".vue", ".svelte", ".html"}
TELLS = {
    "locale-clock": r"\b[A-Z]{3}\s*\d{1,2}:\d{2}\b|\bGMT\s*[+-]\d",
    "fake-build": r"\bv\d+\.\d+\.\d+(?:-[\w.]+)?\b|last sync\b|\bBuild\s+\d{3,}\b",
    "heritage": r"\bEST(?:D)?\.?\s*(?:19|20)\d{2}\b",
    "section-code": r"\bSEC-\d+\b|\bMK\.[IVX]+\b|\bPlate\s+\d+\b",
    "step-label": r"\b(?:Step|Phase)\s+(?:0?\d|[IVX]+)\b",
    "tile-pager": r"\b0\d\s*/\s*0?\d\b",
    "placeholder-name": r"\bJohn Doe\b|\bJane Doe\b|\bAcme\b|\bLorem ipsum\b",
    "placeholder-contact": r"\b(?:john|jane)doe@|@example\.(?:com|org|net)\b|\bexample\.com\b"
                           r"|\(555\)\s*\d{3}|\b555[-.\s]\d{4}\b",
    "false-precision": r"\b99\.9+%|\b\d+x\b|\b\d+\.\d%",
    "filler-word": r"\b(?:elevate|seamless(?:ly)?|unleash|supercharge|empower|next-gen"
                   r"|revolutionary|cutting-edge|game[- ]changer|AI-powered)\b",
    "unsourced-badge": r"\bMost popular\b|\bBest[- ]?seller\b|\bTerlaris\b|\bPaling (?:laris|populer)\b",
    "scroll-cue": r"^\s*scroll(?:\s+down)?\s*[↓⌄]?\s*$|\bscroll to (?:explore|discover|continue)\b",
    "arrow-label": r"\S\s*→\s*$",
    "middot-meta": r"\S\s+·\s+[^·]+\s+·\s+\S",
}
NOCASE = {"filler-word", "unsourced-badge", "scroll-cue", "placeholder-contact"}
TEXT = re.compile(r">([^<>{}]+)<|(?:alt|aria-label|placeholder|title)=\"([^\"]+)\"", re.I)
EMOJI = re.compile("[\U0001F300-\U0001FAFF☀-➿⭐⬆↔-⇿]")
HEAD_BTN = re.compile(r"<(h[1-6]|button)\b[^>]*>([^<]*)", re.I)
ACTION = re.compile(r"<(a|button)\b[^>]*>\s*([^<>{}]{2,40}?)\s*</\1>", re.I)
INTENTS = {
    "start/sign-up": r"get started|start (?:free|now|your)|free trial|sign ?up|create (?:an )?account"
                     r"|try (?:it )?(?:free|now)|join now|daftar|coba gratis|mulai",
    "contact/sales": r"contact|talk to|book a (?:demo|call)|request a demo|get in touch|hubungi|konsultasi",
    "buy/order": r"buy|shop now|order|checkout|add to cart|beli|pesan|keranjang",
}
CSS_RULES = {
    "full-height": (r"\b100vh\b|\b(?:min-)?h-screen\b", "full viewport height: is it needed? prefer svh/dvh"),
    "pulse-infinite": (r"\banimate-(?:pulse|ping|bounce)\b|\binfinite\b", "looping motion: does it report live state?"),
    "scroll-listener": (r"addEventListener\(\s*['\"]scroll['\"]", "scroll listener: IntersectionObserver or scroll-driven CSS?"),
    "default-look-palette": (r"(?i)#(?:f4f1ea|d97757)\b", "cream/terracotta generated-look hex: chosen for this brief?"),
}
OUTLINE_OFF = re.compile(r"outline\s*:\s*(?:none|0)\b|\boutline-(?:none|0)\b")
GRID_PX = re.compile(r"grid-template-columns\s*:([^;}\n]*)|grid-cols-\[([^\]]*)\]")
CSS_BLOCK = re.compile(r"([^{}]+)\{([^{}]*)\}")
UPPER_TRACKED_CLASS = re.compile(r"class(?:Name)?=[\"'{`][^\"'`}]*\buppercase\b[^\"'`}]*\btracking-", re.I)
UPPER_TRACKED_CLASS2 = re.compile(r"class(?:Name)?=[\"'{`][^\"'`}]*\btracking-[^\"'`}]*\buppercase\b", re.I)


def files(paths, ext):
    for p in map(Path, paths):
        yield from (f for f in ([p] if p.is_file() else p.rglob("*"))
                    if f.is_file() and f.suffix in ext and "node_modules" not in f.parts)


def scan_text(paths):
    scanned, hits, dashes = 0, 0, 0
    intents = defaultdict(lambda: defaultdict(list))
    for f in files(paths, TEXT_EXT):
        scanned += 1
        for n, line in enumerate(f.read_text(errors="ignore").splitlines(), 1):
            for m in TEXT.finditer(line):
                text = m.group(1) or m.group(2)
                dashes += text.count("—")
                for name, rx in TELLS.items():
                    if re.search(rx, text, re.I if name in NOCASE else 0):
                        hits += 1
                        print(f"{f}:{n}: {name}: {text.strip()[:80]}")
            for m in HEAD_BTN.finditer(line):
                if EMOJI.search(m.group(2)):
                    hits += 1
                    kind = "button" if m.group(1).lower() == "button" else "heading"
                    print(f"{f}:{n}: emoji-in-{kind}: {m.group(2).strip()[:80]}")
            for m in ACTION.finditer(line):
                label = " ".join(m.group(2).split())
                for intent, rx in INTENTS.items():
                    if re.search(rx, label, re.I):
                        intents[intent][label.lower()].append(f"{f}:{n}")
                        break
    for intent, labels in intents.items():
        if len(labels) > 1:
            hits += 1
            shown = "; ".join(f'"{k}" ({v[0]})' for k, v in labels.items())
            print(f"cta-intent: one {intent} intent under {len(labels)} labels: {shown}")
    if dashes:
        print(f"info: {dashes} em-dash(es) in displayed text; optional punctuation "
              "preference, not a tell (not counted)")
    return scanned, hits


def grid_has_fixed_px(value):
    value = re.sub(r"(?:minmax|clamp|min|max|fit-content)\([^()]*\)", "", value)
    return re.search(r"\b\d+(?:\.\d+)?px\b", value) is not None


def scan_css(paths):
    scanned, hits = 0, 0
    def report(f, n, name, note, snippet=""):
        nonlocal hits
        hits += 1
        where = f"{f}:{n}" if n else str(f)
        print(f"{where}: {name}: {note}" + (f": {snippet.strip()[:60]}" if snippet else ""))
    for f in files(paths, CSS_EXT):
        scanned += 1
        src = f.read_text(errors="ignore")
        lines = src.splitlines()
        labels = sections = 0
        for n, line in enumerate(lines, 1):
            sections += len(re.findall(r"<section\b", line, re.I))
            labels += len(UPPER_TRACKED_CLASS.findall(line)) or len(UPPER_TRACKED_CLASS2.findall(line))
            for name, (rx, note) in CSS_RULES.items():
                if re.search(rx, line):
                    report(f, n, name, note, line)
            for m in GRID_PX.finditer(line):
                if grid_has_fixed_px(m.group(1) or m.group(2)):
                    report(f, n, "fixed-grid-px", "fixed px columns: do they shrink on narrow screens?", line)
            if re.search(r"<(?:body|main)\b[^>]*\boverflow-x-hidden\b", line):
                report(f, n, "overflow-x-hidden", "masks overflow on body/main: find the widest element", line)
        for m in CSS_BLOCK.finditer(src):
            sel, body = m.group(1), m.group(2)
            n = src.count("\n", 0, m.start(2)) + 1
            if re.search(r"text-transform\s*:\s*uppercase", body) and re.search(r"letter-spacing\s*:", body):
                labels += 1
            if re.search(r"(?:^|[\s,>])(?:html|body|main)\b", sel.strip().splitlines()[-1] if sel.strip() else "") \
                    and re.search(r"overflow-x\s*:\s*hidden", body):
                report(f, n, "overflow-x-hidden", "masks overflow on html/body/main: find the widest element")
        if OUTLINE_OFF.search(src) and "focus-visible" not in src:
            n = next(i for i, l in enumerate(lines, 1) if OUTLINE_OFF.search(l))
            report(f, n, "outline-removed", "outline removed and no :focus-visible style in this file")
        if labels:
            report(f, None, "micro-labels", f"{labels} uppercase tracked label(s) vs {sections} <section>(s): "
                   "does each one tell the reader something?")
    return scanned, hits


def main(argv):
    css = "--css" in argv
    paths = [a for a in argv if a != "--css"] or ["."]
    scanned, hits = (scan_css if css else scan_text)(paths)
    if not scanned:
        print("not applicable: no scannable files (report as NOT CHECKED)")
        return 2
    print(f"scanned {scanned} file(s), {hits} question(s) for the brief")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
