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
  maxEmptyPass: judge({ max: 3 }, []).status === 'pass',
  forbidFail: judge({ forbid: true }, v(1)).status === 'fail',
  forbidEmptyPass: judge({ forbid: true }, []).status === 'pass',
  distinctFail: judge({ distinctMax: 1 }, v('a', 'b', 'a')).offenders.length === 2,
  distinctPass: judge({ distinctMax: 2 }, v('a', 'b', 'a')).status === 'pass',
  warnNeverFails: judge({ warnBelow: 44 }, v(16)).status === 'warn',
  scope: applies('desktop', 1366) && !applies('desktop', 390) && applies('mobile', 390) && applies('all', 800) && !applies('mobile', 800),
}));
" 2>&1)" || bad "module failed to load: $u"
for k in allowedPass allowedFail emptyNotChecked maxFail maxEmptyPass forbidFail forbidEmptyPass distinctFail distinctPass warnNeverFails scope; do
  grep -q "\"$k\":true" <<<"$u" && ok "judge: $k" || bad "judge: $k ($u)"
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
<main><div class=card><div class=tile><svg width=16 height=16><circle cx=8 cy=8 r=6 fill="#7c3aed"/></svg></div>Revenue</div></main></div></body></html>
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
  for id in header-height radius shadow gradient icon-tile; do
    grep -q "^- FAIL 1366px $id " "$TMP/sloppy.md" && ok "sloppy: detects $id" || bad "sloppy: missed $id ($(grep " $id " "$TMP/sloppy.md"))"
  done
  grep -q "^- FAIL 1366px button-height" "$TMP/sloppy.md" && ok "sloppy: detects oversized button" || bad "sloppy: missed button-height"
fi

[ "$fails" -eq 0 ] && echo "admin-geometry: all checks passed" || { echo "admin-geometry: $fails failure(s)"; exit 1; }
