#!/usr/bin/env python3
"""Delivery gate for a new or redesigned public page (SKILL.md §8).

Usage: design-gate.py PROJECT [--design FILE] [--review FILE] [--src DIR]

Fails (exit 1) when required evidence is missing, corrupt, stale, or changed.
Style counters are advisory; appearance must be judged against the researched
direction in an independent image review, not inferred from source counts.

  refs      >= 1 inspected reference: a valid ui-ref capture or supplied image
            cited under "Reference evidence". Pillow verifies image decoding.
  critique  narrow + wide decoded screenshots, both at least as new as source
  review    design/review.md written by scripts/visual-review.py: canonical
            prompt, a separate ai-ask invocation, the exact screenshots and
            references plus current design context, and `Verdict: PASS`.
            lazy: hashes stop rewritten prompts, touch, and edited verdicts,
            not a builder who deliberately recomputes them.
  look      source-level counts for generated looks: monospace usage, `//`
            separators and numbered labels in displayed text, tracked
            uppercase labels (limit: half the sections), Tailwind default
            blue/indigo accent, a colored word inside an h1/h2, and an
            owner placeholder set as a large stat figure

`gate-allow` explains a style choice; it cannot waive missing evidence or
unsupported placeholder statistics. The gate validates artifacts, not whether
a person or model actually inspected them; record that observation honestly.
Exit 0 = pass, 1 = fail, 2 = not applicable (no design file or no source).
"""
import hashlib, json, re, sys
from pathlib import Path

SRC_EXT = {".astro", ".html", ".jsx", ".tsx", ".vue", ".svelte", ".liquid", ".css", ".scss"}
SKIP = {"node_modules", "dist", ".astro", ".next", ".git", "build", ".vercel", ".output"}
IMG = re.compile(r"[\w./-]+\.(?:png|jpe?g|webp)\b", re.I)
PATH = re.compile(r"[`(\[]?((?:\./)?[\w.-]+(?:/[\w.-]+)+/?)[`)\]]?")
TEXT = re.compile(r">([^<>{}]+)<")
CODE = re.compile(r"\A---\n.*?\n---\n|<(script|style)\b.*?</\1>|<!--.*?-->|\{[^{}]*\}", re.S)
MONO = re.compile(r"\bfont-mono\b|font-family\s*:[^;}\n]*\bmono", re.I)
TRACKED = re.compile(r"class(?:Name)?=[\"'{`][^\"'`}]*(?:\buppercase\b[^\"'`}]*\btracking-|\btracking-[^\"'`}]*\buppercase\b)")
ACCENT = re.compile(r"\b(?:bg|text|border|ring|from|to|via|fill|stroke)-(?:blue|indigo|violet)-(?:500|600|700)\b"
                    r"|#(?:2563eb|3b82f6|1d4ed8|4f46e5|6366f1|4338ca|7c3aed|8b5cf6)\b", re.I)
# "03 / Analytics" or "LAYANAN 01"; a bare "01" or "Step 01" on a real sequence is fine.
NUMBERED = re.compile(r"\b0\d\s*/\s*[^\d\s]|^\s*(?!(?:step|langkah|tahap|phase)\b)[A-Za-z]+\s+0\d\s*$", re.I)
# A colored word inside a headline; size, alignment, and wrap utilities are not color.
HEAD_ACCENT = re.compile(r"<h[12]\b[^>]*>(?:(?!</h[12]>).)*?<(?:span|em|strong|mark|b|i)\b[^>]*class=[\"'][^\"']*"
                         r"(?:\btext-(?!(?:xs|sm|base|lg|\d?xl|left|right|center|justify|balance|pretty|wrap"
                         r"|nowrap|ellipsis|clip|inherit|current)\b)[\w\[\]()/.#:-]+|\bbg-clip-text\b)", re.S | re.I)
# "[Placeholder: 450+]" set as a big stat still reads as a claim.
PH_STAT = re.compile(r"class=[\"'][^\"']*\btext-(?:[2-9]xl)\b[^\"']*[\"'][^>]*>\s*[^<]*placeholder", re.I)
LIMITS = {"mono": 8, "slash": 1, "numbered": 2, "accent": 5, "headline": 0, "stat": 0}


PROMPT_FILE = Path(__file__).resolve().parent.parent / "references" / "visual-review.md"


def review_prompt():
    """The canonical reviewer prompt; builders must not rewrite it."""
    m = re.search(r"```text\n(.*?)```", PROMPT_FILE.read_text(), re.S)
    return m.group(1)


def sha(*parts):
    h = hashlib.sha256()
    for p in parts:
        h.update(p if isinstance(p, bytes) else p.encode())
    return h.hexdigest()[:16]


def images_sha(paths):
    return sha(*(p.read_bytes() for p in sorted(paths)))


def section(doc, title):
    head = re.search(r"^(#+)\s*%s.*$" % title, doc, re.I | re.M)
    if not head:
        return None
    nxt = re.search(r"^#{1,%d}\s" % len(head.group(1)), doc[head.end():], re.M)
    return doc[head.end(): head.end() + nxt.start() if nxt else None]


def critique_shots(root, doc):
    body = section(doc, "Render critique")
    return None if body is None else sorted({root / m.group(0) for m in IMG.finditer(body)})


def image_size(path):
    from PIL import Image
    with Image.open(path) as img:
        size = img.size
        img.verify()
    # verify() checks the container; load() also checks compressed pixel data.
    with Image.open(path) as img:
        img.load()
    return size


def reference_shots(root, doc):
    body = section(doc, "Reference evidence") or section(doc, "References") or ""
    dirs = {root / m.group(1).rstrip("/") for m in PATH.finditer(body)
            if not IMG.fullmatch(m.group(1)) and
            ((root / m.group(1)).is_dir() or m.group(1).startswith("design/refs/"))}
    shots = {root / m.group(0) for m in IMG.finditer(body)}
    errors = []
    for directory in sorted(dirs):
        try:
            ref = json.loads((directory / "ref.json").read_text())
            if not isinstance(ref, dict) or not ref.get("capturedAt") or not ref.get("viewports"):
                raise ValueError("missing capturedAt or viewports")
            for width, viewport in ref["viewports"].items():
                if not isinstance(viewport, dict) or not re.match(r"https?://", str(viewport.get("url", ""))):
                    raise ValueError("missing source URL")
                shot = directory / f"{int(width)}.png"
                if image_size(shot)[0] != int(width) or viewport.get("width") != int(width):
                    raise ValueError("viewport and screenshot widths differ")
                shots.add(shot)
        except (OSError, ValueError, TypeError, AttributeError, ImportError) as error:
            errors.append(f"{directory.relative_to(root)}: {error}")
    for shot in sorted(shots):
        try:
            image_size(shot)
        except (OSError, ValueError, ImportError) as error:
            errors.append(f"{shot.relative_to(root)}: {error}")
    return sorted(shots), errors


def sources(root, dirs):
    for d in dirs:
        for f in (root / d).rglob("*"):
            if f.is_file() and f.suffix in SRC_EXT and not SKIP & set(f.relative_to(root).parts):
                yield f


def main(argv):
    if not argv or argv[0].startswith("-"):
        print(__doc__); return 2
    root = Path(argv[0]).resolve()
    opts = dict(zip(argv[1::2], argv[2::2]))
    design = root / opts.get("--design", "DESIGN.md")
    src_dirs = [opts["--src"]] if "--src" in opts else ["src"] if (root / "src").is_dir() else ["."]
    if not design.is_file():
        print(f"not applicable: {design} missing (report as NOT CHECKED)"); return 2
    files = list(sources(root, src_dirs))
    if not files:
        print("not applicable: no source files (report as NOT CHECKED)"); return 2
    doc = design.read_text(errors="ignore")
    allowed = {m.group(1).lower() for m in re.finditer(r"gate-allow:\s*(\w+)\s*[-—:]\s*\S", doc)}
    fails = []

    def check(name, ok, detail, advisory=False):
        state = "PASS" if ok else ("ALLOWED" if advisory and name in allowed else "WARN" if advisory else "FAIL")
        print(f"{state:8}{name}: {detail}")
        if state == "FAIL":
            fails.append(name)

    refs, ref_errors = reference_shots(root, doc)
    check("refs", bool(refs) and not ref_errors,
          "; ".join(ref_errors) or f"{len(refs)} decoded reference image(s) cited (need at least 1)")

    shots = critique_shots(root, doc)
    head = shots is not None
    shots = shots or []
    newest_src = max(f.stat().st_mtime for f in files)
    fresh = shots and all(p.is_file() for p in shots) and min(p.stat().st_mtime for p in shots) >= newest_src
    try:
        widths = [image_size(p)[0] for p in shots]
        responsive = bool(widths) and min(widths) < 600 and max(widths) >= 900
        shot_error = "" if responsive else "; need decoded narrow (<600px) and wide (>=900px) renders"
    except (OSError, ValueError, ImportError) as error:
        responsive, shot_error = False, f"; unreadable screenshot: {error}"
    check("critique", bool(head) and responsive and bool(fresh),
          "no 'Render critique' heading" if not head else
          f"{len(shots)} screenshot(s) cited" + shot_error + ("" if fresh or not shots else
          "; a screenshot is older than the source: re-render and re-critique"))

    review = root / opts.get("--review", "design/review.md")
    rv = review.read_text(errors="ignore") if review.is_file() else ""
    hdr, _, body = rv.partition("\n\n")
    field = lambda k: (re.search(r"^%s:\s*(.+)$" % k, hdr, re.M) or [None, ""])[1].strip()
    author = re.search(r"^\W*Author:\s*(.+)$", doc, re.M | re.I)
    reviewer = re.search(r"^Reviewer:\s*(.+)$", hdr, re.M)
    rshots = sorted({root / p.strip() for p in field("Screenshots").split(",") if p.strip()})
    verdicts = re.findall(r"^\W*Verdict:\W*(PASS|REVISE|UNVERIFIED)\b", body, re.M | re.I)
    verdict = verdicts[-1].upper() if verdicts else None
    rrefs = sorted({root / p.strip() for p in field("References").split(",") if p.strip()})
    problem = ("missing: run the independent review in references/visual-review.md" if not rv else
               "no 'Reviewer:' line" if not reviewer else
               "not written by scripts/visual-review.py (prompt or output hash missing or changed)"
               if field("Prompt-SHA") != sha(review_prompt()) or field("Output-SHA") != sha(body) else
               "missing builder Author or separate review context" if not author or
               field("Review-Context") != "separate ai-ask invocation" else
               "design context changed after review: re-review" if field("Context-SHA") != sha(doc) else
               "reviewed screenshots differ from the render critique's" if rshots != shots or len(shots) < 2 else
               "reviewed references differ from the design evidence" if rrefs != refs else
               "images changed after the review: re-run scripts/visual-review.py"
               if not all(p.is_file() for p in rshots + rrefs) or field("Images-SHA") != images_sha(rshots + rrefs) else
               "no 'Verdict: PASS|REVISE|UNVERIFIED' line" if not verdict else
               f"verdict {verdict}: resolve findings or missing inspection, then re-review" if verdict != "PASS" else "")
    check("review", not problem, problem or f"PASS by {reviewer.group(1).strip()} on {len(rshots)} screenshot(s)")

    n = {k: 0 for k in LIMITS}
    tracked = sections = 0
    where = {k: [] for k in LIMITS}
    def hit(k, f, i, v=1):
        n[k] += v
        if len(where[k]) < 3:
            where[k].append(f"{f.relative_to(root)}:{i}")

    for f in files:
        src = f.read_text(errors="ignore")
        for i, line in enumerate(src.splitlines(), 1):
            for k, rx in (("mono", MONO), ("accent", ACCENT)):
                if c := len(rx.findall(line)):
                    hit(k, f, i, c)
            tracked += len(TRACKED.findall(line))
            sections += len(re.findall(r"<section\b", line))
        for k, rx in (("headline", HEAD_ACCENT), ("stat", PH_STAT)):
            for m in rx.finditer(src):
                hit(k, f, src.count("\n", 0, m.start()) + 1)
        # Displayed text spans lines; blank out code first, keeping line numbers.
        shown = CODE.sub(lambda m: re.sub(r"[^\n]", " ", m.group(0)), src)
        for m in TEXT.finditer(shown):
            base = shown.count("\n", 0, m.start(1)) + 1
            for j, t in enumerate(m.group(1).split("\n")):
                i = base + j
                if c := len(re.findall(r"\s//\s", f" {t} ")):
                    hit("slash", f, i, c)
                if NUMBERED.search(t):
                    hit("numbered", f, i)
    notes = {"mono": "monospace beyond code/tabular data",
             "slash": "`//` separators in displayed text",
             "numbered": "numbered labels (01 /, LAYANAN 01) on non-sequences",
             "accent": "Tailwind default blue/indigo/violet accent",
             "headline": "colored word inside an h1/h2",
             "stat": "owner placeholder set as a large stat figure"}
    for k, limit in LIMITS.items():
        check(k, n[k] <= limit,
              f"{n[k]} (signal threshold {limit}) {notes[k]}" + (f" e.g. {', '.join(where[k])}" if n[k] > limit else ""),
              advisory=k != "stat")
    limit = max(2, sections // 2)
    check("labels", tracked <= limit,
          f"{tracked} tracked uppercase label(s) vs {sections} <section>(s) (signal threshold {limit})", advisory=True)

    print(f"{'FAIL' if fails else 'PASS'}: {len(fails)} failing check(s)"
          + (f" ({', '.join(fails)})" if fails else ""))
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
