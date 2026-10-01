#!/usr/bin/env python3
"""WCAG 2.x contrast checker (stdlib only).

Usage:
  contrast.py FG BG [--size PX] [--bold] [--level AA|AAA] [--over BASE]
  contrast.py "FG on BG" ["FG on BG" ...] [options]
  contrast.py --file pairs.txt [options]     # one "FG on BG" per line; a '#'
                                             # followed by a space starts a comment
Colors: #rgb, #rgba, #rrggbb, #rrggbbaa, rgb()/rgba() (comma or space syntax,
alpha as 0-1 or %). A translucent BG is composited over --over (required then);
a translucent FG is composited over the resulting BG.
Large text = >=24px regular or >=18.66px bold (18pt / 14pt bold). Thresholds:
AA 4.5 (large 3), AAA 7 (large 4.5). Ratios are floored to 2 decimals for
display; pass/fail uses the unrounded value.
Exit 0 = all pairs pass the chosen level, 1 = at least one fails, 2 = bad input.
"""
import argparse, math, re, sys

HEX = re.compile(r"#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$", re.I)
FUNC = re.compile(r"rgba?\(\s*([^)]*)\)$", re.I)


def parse(color):
    c = color.strip()
    m = HEX.match(c)
    if m:
        h = m.group(1)
        if len(h) in (3, 4):
            h = "".join(ch * 2 for ch in h)
        vals = [int(h[i:i + 2], 16) for i in range(0, len(h), 2)]
        return (*vals[:3], vals[3] / 255 if len(vals) == 4 else 1.0)
    m = FUNC.match(c)
    if m:
        parts = [p for p in re.split(r"[\s,/]+", m.group(1).strip()) if p]
        if len(parts) in (3, 4):
            rgb = [_channel(p) for p in parts[:3]]
            a = _alpha(parts[3]) if len(parts) == 4 else 1.0
            return (*rgb, a)
    raise ValueError(f"unrecognised color: {color!r}")


def _channel(p):
    v = float(p[:-1]) * 2.55 if p.endswith("%") else float(p)
    if not 0 <= v <= 255:
        raise ValueError(f"channel out of range: {p}")
    return v


def _alpha(p):
    v = float(p[:-1]) / 100 if p.endswith("%") else float(p)
    if not 0 <= v <= 1:
        raise ValueError(f"alpha out of range: {p}")
    return v


def over(top, base):
    """Composite a (possibly translucent) color over an opaque base."""
    a = top[3]
    return tuple(top[i] * a + base[i] * (1 - a) for i in range(3)) + (1.0,)


def luminance(c):
    def lin(v):
        v /= 255
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (lin(v) for v in c[:3])
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(fg, bg, base=None):
    if bg[3] < 1:
        if base is None:
            raise ValueError("background is translucent: pass --over BASE")
        if base[3] < 1:
            raise ValueError("--over base must be opaque")
        bg = over(bg, base)
    if fg[3] < 1:
        fg = over(fg, bg)
    l1, l2 = sorted((luminance(fg), luminance(bg)), reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)


def is_large(size, bold):
    return size is not None and (size >= 24 or (bold and size >= 18.66))


def threshold(level, large):
    return {("AA", False): 4.5, ("AA", True): 3.0,
            ("AAA", False): 7.0, ("AAA", True): 4.5}[(level, large)]


def split_pair(text):
    parts = re.split(r"\s+on\s+", text.strip(), maxsplit=1, flags=re.I)
    if len(parts) != 2:
        raise ValueError(f"expected 'FG on BG', got {text!r}")
    return parts


def main(argv):
    ap = argparse.ArgumentParser(description="WCAG 2.x contrast checker")
    ap.add_argument("items", nargs="*")
    ap.add_argument("--file")
    ap.add_argument("--size", type=float, help="text size in CSS px")
    ap.add_argument("--bold", action="store_true")
    ap.add_argument("--level", choices=["AA", "AAA"], default="AA")
    ap.add_argument("--over", help="opaque base under a translucent background")
    a = ap.parse_args(argv)
    try:
        pairs = []
        if a.file:
            with open(a.file) as fh:
                for line in fh:
                    line = re.split(r"#(?=\s|$)", line, maxsplit=1)[0].strip()
                    if line:
                        pairs.append(split_pair(line))
        if len(a.items) == 2 and not any(re.search(r"\son\s", i, re.I) for i in a.items):
            pairs.append(a.items)
        else:
            pairs += [split_pair(i) for i in a.items]
        if not pairs:
            ap.error("no color pairs given")
        base = parse(a.over) if a.over else None
        large = is_large(a.size, a.bold)
        need = threshold(a.level, large)
        failed = 0
        for fg, bg in pairs:
            r = ratio(parse(fg), parse(bg), base)
            ok = r >= need
            failed += not ok
            shown = math.floor(r * 100) / 100
            print(f"{fg} on {bg}: {shown:.2f}:1 {'PASS' if ok else 'FAIL'} "
                  f"{a.level} {'large' if large else 'normal'} text (needs {need}:1)")
    except (ValueError, OSError) as e:
        print(f"error: {e}", file=sys.stderr)
        return 2
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
