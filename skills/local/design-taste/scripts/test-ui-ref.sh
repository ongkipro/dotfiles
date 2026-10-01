#!/usr/bin/env bash
# test-ui-ref.sh — regression check for ui-ref.mjs.
# Part 1 (always): the comparison rules, as a pure function, no browser.
# Part 2 (when a working Chrome/Chromium exists): capture + compare against two
# local fixture pages served over 127.0.0.1. Without a browser it says
# NOT CHECKED rather than pretending to pass.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
TMP="$(mktemp -d)"; trap 'kill "$SRV" 2>/dev/null; rm -rf "$TMP"' EXIT
fails=0; browser=""
ok()  { printf '  ok   %s\n' "$1"; }
bad() { printf '  FAIL %s\n' "$1"; fails=$((fails + 1)); }

node --input-type=module -e "
import { compareViewports } from '$HERE/ui-ref.mjs';
const v = (o = {}) => ({ height: 2000, sections: [{ h: 600, cols: 1, bg: 'rgb(255, 255, 255)', heading: { size: '56px' } }, { h: 400, cols: 3, bg: 'rgb(243, 236, 228)', heading: null }],
  type: { roles: { h1: { size: '56px', weight: '400', family: 'Georgia' }, p: { size: '18px', weight: '400', family: 'Georgia' } } },
  color: { background: [{ v: 'rgb(255, 255, 255)' }, { v: 'rgb(243, 236, 228)' }] }, radius: [{ v: '12px' }], ...o });
const same = compareViewports(v(), v());
const diff = compareViewports(v(), v({ sections: [{ h: 600, cols: 1, bg: 'rgb(255, 255, 255)', heading: { size: '40px' } }, { h: 900, cols: 2, bg: 'rgb(20, 20, 20)', heading: null }],
  type: { roles: { h1: { size: '40px', weight: '700', family: 'Arial' }, p: { size: '18px', weight: '400', family: 'Georgia' } } } }));
const has = (w) => diff.some((f) => f.what === w);
const transparent = compareViewports(v(), v({ sections: [{ h: 600, cols: 1, bg: 'rgba(0, 0, 0, 0)', heading: { size: '56px' } }, { h: 400, cols: 3, bg: 'rgb(243, 236, 228)', heading: null }] }));
const head = compareViewports(v({ headingMax: 64 }), v({ headingMax: 40 }));
console.log(JSON.stringify({ same: same.length, cols: has('section 2 columns'), height: has('section 2 height'), h1: has('h1 size'), fam: has('h1 font family'), bg: has('section 2 background'), weight: has('h1 weight'), transparentOk: transparent.length === 0, maxHeading: head.some((f) => f.what === 'largest heading') }));
" > "$TMP/unit.json" 2>&1 || { bad "comparison module failed to load: $(cat "$TMP/unit.json")"; }
u="$(cat "$TMP/unit.json")"
grep -q '"same":0' <<<"$u" && ok "identical measurements give no findings" || bad "identical gave findings: $u"
for k in cols height h1 fam bg weight transparentOk maxHeading; do grep -q "\"$k\":true" <<<"$u" && ok "detects $k difference" || bad "missed $k difference"; done

# Part 2: real browser against local fixtures.
mkdir -p "$TMP/site"
cat > "$TMP/site/a.html" <<'HTML'
<!doctype html><html><head><meta name=viewport content="width=device-width"><style>
body{margin:0;font-family:Georgia,serif} header{height:72px} .hero{height:560px;background:#f3ece4;display:grid;grid-template-columns:1fr 1fr;padding:40px}
h1{font-size:56px;font-weight:400;margin:0} .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding:48px}
.card{height:300px;background:#eee;border-radius:12px} footer{height:200px;background:#1d1d1d;color:#fff}
@media(max-width:600px){.hero,.grid{grid-template-columns:1fr}.hero{height:auto}}
</style></head><body><header>Logo</header><main><section class=hero><div><h1>Glow serum</h1><p>Copy</p></div><div class=card></div></section>
<section class=grid><div class=card><h2>One</h2></div><div class=card>b</div><div class=card>c</div></section></main><footer>Footer</footer></body></html>
HTML
sed -e 's/repeat(3,1fr)/repeat(2,1fr)/' -e 's/font-size:56px/font-size:40px/' "$TMP/site/a.html" > "$TMP/site/b.html"
PORT=$((20000 + RANDOM % 20000))
python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$TMP/site" >/dev/null 2>&1 & SRV=$!
sleep 1
node "$HERE/ui-ref.mjs" capture "http://127.0.0.1:$PORT/a.html" --out "$TMP/ref" --viewports 390,1440 >"$TMP/cap.log" 2>&1; rc=$?
if [ "$rc" -eq 3 ]; then
  echo "  NOT CHECKED browser capture: no working Chrome/Chromium on this device ($(tail -1 "$TMP/cap.log"))"
  browser="NOT CHECKED"
else
  [ "$rc" -eq 0 ] && ok "capture succeeds" || bad "capture exit $rc: $(tail -2 "$TMP/cap.log")"
  grep -q '1440px: 4 sections' "$TMP/cap.log" && ok "finds header, two sections inside <main>, footer" || bad "section detection: $(cat "$TMP/cap.log")"
  [ -s "$TMP/ref/1440.png" ] && [ -s "$TMP/ref/ref.json" ] && ok "writes screenshots and ref.json" || bad "artifacts missing"
  node "$HERE/ui-ref.mjs" compare "$TMP/ref" "http://127.0.0.1:$PORT/a.html" --out "$TMP/same" >/dev/null 2>&1
  [ $? -eq 0 ] && ok "same page compares within tolerance" || bad "same page reported differences"
  node "$HERE/ui-ref.mjs" compare "$TMP/ref" "http://127.0.0.1:$PORT/b.html" --out "$TMP/diff" >/dev/null 2>&1
  [ $? -eq 1 ] && ok "changed page fails the comparison" || bad "changed page passed"
  grep -q 'section 3 columns: reference 3, build 2' "$TMP/diff/report.md" && grep -q 'h1 size: reference 56px, build 40px' "$TMP/diff/report.md" \
    && ok "report names the column and type-scale drift" || bad "report content: $(head -30 "$TMP/diff/report.md")"
fi
node "$HERE/ui-ref.mjs" bogus >/dev/null 2>&1; [ $? -eq 2 ] && ok "unknown command is a usage error" || bad "unknown command accepted"

[ "$fails" -eq 0 ] && { echo "test-ui-ref: PASS${browser:+ (unit only; browser part $browser)}"; exit 0; }
echo "test-ui-ref: $fails failed"; exit 1
