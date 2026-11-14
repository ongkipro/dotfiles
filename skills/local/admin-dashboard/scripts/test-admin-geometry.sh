#!/usr/bin/env bash
# Tests admin-geometry.mjs: pure judge() rules, then (when a Chrome/Chromium
# exists) a clean and a sloppy local fixture measured against compact.json.
# Without a browser it says NOT CHECKED rather than pretending to pass.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
TMP="$(mktemp -d)"; SRV=""; trap '[ -n "$SRV" ] && kill "$SRV" 2>/dev/null; rm -rf "$TMP"' EXIT
fails=0
ok()  { printf '  ok   %s\n' "$1"; }
bad() { printf '  FAIL %s\n' "$1"; fails=$((fails + 1)); }

# Part 1: judge() without a browser.
u="$(node --input-type=module -e "
import { judge, applies } from '$HERE/admin-geometry.mjs';
const v = (...xs) => xs.map((x) => ({ v: x, el: 'x' }));
console.log(JSON.stringify({
  allowedPass: judge({ allowed: [32, 36] }, v(32, 36.5)).status === 'pass',
  allowedFail: judge({ allowed: [32, 36] }, v(32, 34)).offenders.length === 1,
  emptyNotChecked: judge({ allowed: [32] }, []).status === 'not-checked',
  maxFail: judge({ max: 3 }, v(2, 10)).status === 'fail',
  minFail: judge({ min: 14 }, v(16, 12)).offenders.length === 1 && judge({ min: 12 }, v(11.5)).status === 'fail',
  minEmptyNotChecked: judge({ min: 14 }, []).status === 'not-checked',
  maxEmptyPass: judge({ max: 3 }, []).status === 'pass',
  forbidFail: judge({ forbid: true }, v(1)).status === 'fail',
  forbidEmptyPass: judge({ forbid: true }, []).status === 'pass',
  distinctFail: judge({ distinctMax: 1 }, v('a', 'b', 'a')).offenders.length === 2,
  distinctPass: judge({ distinctMax: 2 }, v('a', 'b', 'a')).status === 'pass',
  warnNeverFails: judge({ warnBelow: 44 }, v(16)).status === 'warn',
  scope: applies('desktop', 1366) && !applies('desktop', 390) && applies('mobile', 390) && applies('all', 800) && !applies('mobile', 800),
}));
" 2>&1)" || bad "module failed to load: $u"
for k in allowedPass allowedFail emptyNotChecked minFail minEmptyNotChecked maxFail maxEmptyPass forbidFail forbidEmptyPass distinctFail distinctPass warnNeverFails scope; do
  grep -q "\"$k\":true" <<<"$u" && ok "judge: $k" || bad "judge: $k ($u)"
done

for c in "$HERE"/../assets/size-contracts/*.json; do
  node -e 'const c=JSON.parse(require("fs").readFileSync(process.argv[1]));if(!c.name||!c.checks.every(k=>k.id&&k.selector&&k.prop))process.exit(1)' "$c" && ok "contract valid: $(basename "$c")" || bad "contract invalid: $c"
done

# Part 2: real browser against fixtures.
mkdir -p "$TMP/site"
cat > "$TMP/site/clean.html" <<'HTML'
<!doctype html><html><head><meta name=viewport content="width=device-width"><style>
body{margin:0;font:14px system-ui;display:grid;grid-template-columns:240px 1fr}
aside{height:100vh;border-right:1px solid #e5e5e5} header{height:48px;border-bottom:1px solid #e5e5e5;display:flex;align-items:center;gap:8px;padding:0 16px}
button{height:32px;font-size:14px;border:1px solid #e5e5e5;border-radius:6px;background:#fff;padding:0 12px}
input{height:32px;font-size:14px;border:1px solid #e5e5e5;border-radius:6px;padding:0 8px;box-sizing:border-box}
table{border-collapse:collapse;width:100%} th{height:32px;padding:0 8px;box-sizing:border-box;font-size:12px;text-align:left} td{font-size:14px;padding:6px 8px;border-top:1px solid #e5e5e5}
.ok{background:#dcfce7;color:#166534;border-radius:9999px;padding:2px 8px;font-size:12px}
@media (max-width:767px){body{grid-template-columns:1fr} aside{display:none} input{font-size:16px}}
</style></head><body><aside data-shell=sidebar></aside><div><header><input placeholder=Search><button>Export</button></header>
<main style="padding:16px"><table><tr><th>Order</th><th>Status</th></tr><tr><td>#1001</td><td><span class=ok>Paid</span></td></tr></table></main></div></body></html>
HTML
cat > "$TMP/site/sloppy.html" <<'HTML'
<!doctype html><html><head><meta name=viewport content="width=device-width"><style>
body{margin:0;font:14px system-ui;display:grid;grid-template-columns:240px 1fr}
aside{height:100vh;background:linear-gradient(#4f46e5,#9333ea)} header{height:72px;display:flex;align-items:center;gap:8px;padding:0 16px}
button{height:44px;font-size:14px;border:0;border-radius:24px 24px 24px 24px;background:#4f46e5;color:#fff;padding:0 12px;width:160px}
.card{border:1px solid #eee;border-radius:24px;box-shadow:0 10px 30px rgba(0,0,0,.15);padding:24px;margin:16px}
.tile{width:40px;height:40px;border-radius:12px;background:#ede9fe;display:grid;place-items:center}
</style></head><body><aside data-shell=sidebar></aside><div><header><button>Export</button></header>
<main><span class=sr style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);font-size:10px">Toggle sidebar</span><div style="opacity:0"><span style="font-size:9px">hidden</span></div>__FILLER__<small style="font-size:11.84px">Updated 2m ago</small><div class=card><div class=tile><svg width=16 height=16><circle cx=8 cy=8 r=6 fill="#7c3aed"/></svg></div>Revenue</div></main></div></body></html>
HTML
FILLER="$(for i in $(seq 1 500); do printf '<p>row %s</p>' "$i"; done)"
python3 - "$TMP/site/sloppy.html" "$FILLER" <<'PY'
import sys; p, f = sys.argv[1], sys.argv[2]; s = open(p).read(); open(p, "w").write(s.replace("__FILLER__", f))
PY
cat > "$TMP/site/svg.html" <<'HTML'
<!doctype html><html><head><meta name=viewport content="width=device-width"></head><body style="margin:0;font:16px system-ui">
<svg width=400 height=200 viewBox="0 0 400 200"><text x=100 y=100 font-size=16 transform="rotate(-45 100 100)">tick 45</text>
<text x=200 y=150 font-size=16 transform="rotate(-90 200 150)">axis title</text></svg>
<svg width=200 height=100 viewBox="0 0 400 200"><text x=10 y=50 font-size=16>shrunk</text></svg>
</body></html>
HTML
PORT=$((20000 + RANDOM % 20000))
python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$TMP/site" >/dev/null 2>&1 & SRV=$!
sleep 1
C="$HERE/../assets/size-contracts/compact.json"
node "$HERE/admin-geometry.mjs" "http://127.0.0.1:$PORT/clean.html" --contract "$C" --viewports 390,1366 >"$TMP/clean.md" 2>&1; rc=$?
if [ "$rc" -eq 3 ]; then
  echo "  NOT CHECKED browser measurement: no working Chrome/Chromium on this device"
else
  [ "$rc" -eq 0 ] && ok "clean fixture passes compact contract" || bad "clean fixture exit $rc: $(grep -E 'FAIL' -A3 "$TMP/clean.md")"
  node "$HERE/admin-geometry.mjs" "http://127.0.0.1:$PORT/sloppy.html" --contract "$C" --viewports 1366 >"$TMP/sloppy.md" 2>&1; rc=$?
  [ "$rc" -eq 1 ] && ok "sloppy fixture fails" || bad "sloppy fixture exit $rc"
  for id in header-height radius shadow gradient icon-tile text-floor; do
    grep -q "^- FAIL 1366px $id " "$TMP/sloppy.md" && ok "sloppy: detects $id" || bad "sloppy: missed $id ($(grep " $id " "$TMP/sloppy.md"))"
  done
  grep -A3 "^- FAIL 1366px text-floor" "$TMP/sloppy.md" | grep -q '11.84 small' && ok "text-floor: 11.84px after 500 rows fails (no cap, no rounding)" || bad "text-floor: 11.84px offender missing ($(grep -A3 text-floor "$TMP/sloppy.md"))"
  grep -A6 "^- FAIL 1366px text-floor" "$TMP/sloppy.md" | grep -qE 'Toggle sidebar|"hidden"' && bad "text-floor: sr-only or opacity-0 text counted" || ok "text-floor: sr-only and opacity-0 text ignored"
  node "$HERE/admin-geometry.mjs" "http://127.0.0.1:$PORT/svg.html" --contract "$C" --viewports 1366 >"$TMP/svg.md" 2>&1
  printf '<!doctype html><html><head><meta name=viewport content="width=device-width"></head><body>%s<button data-slot=button style="height:50px">late</button></body></html>' "$(for i in $(seq 1 450); do printf '<button data-slot=button style="height:36px">b%s</button>' "$i"; done)" > "$TMP/site/cap.html"
  node "$HERE/admin-geometry.mjs" "http://127.0.0.1:$PORT/cap.html" --contract "$HERE/../assets/size-contracts/volum-default.json" --viewports 1366 >"$TMP/cap.md" 2>&1
  grep -A2 "^- FAIL 1366px button-height" "$TMP/cap.md" | grep -q '"late"' && ok "allowed check keeps an offender past 400 matches" || bad "cap: late offender dropped ($(grep button-height "$TMP/cap.md"))"
  f="$(grep -A4 "text-floor" "$TMP/svg.md")"
  grep -q '"shrunk"' <<<"$f" && ! grep -qE 'tick 45|axis title' <<<"$f" && ok "text-floor: rotated SVG ticks keep 16px; viewBox-shrunk 8px text fails" || bad "text-floor svg: $f"
  grep -q "^- FAIL 1366px button-height" "$TMP/sloppy.md" && ok "sloppy: detects oversized button" || bad "sloppy: missed button-height"
fi

[ "$fails" -eq 0 ] && echo "admin-geometry: all checks passed" || { echo "admin-geometry: $fails failure(s)"; exit 1; }
