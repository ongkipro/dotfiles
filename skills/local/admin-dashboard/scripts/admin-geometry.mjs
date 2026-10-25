#!/usr/bin/env node
// admin-geometry — measure an admin page against a numeric size and surface contract.
//
// Admin screens drift "too small / too big / not precise" and pick up AI-template
// ornament (colored rounded icon tiles, gradients, soft shadows on every card,
// random radii, a rainbow of tinted chips) when sizes and surfaces are chosen per
// screen and judged from screenshots. This reads computed geometry and styles at
// fixed CSS viewports and fails when a visible element breaks the contract.
// No dependencies: reuses design-taste's ui-ref DevTools client and any installed
// Chrome/Chromium ($CHROME_BIN overrides).
//
//   node admin-geometry.mjs URL [--contract FILE] [--viewports 390,1366,1536] [--out DIR]
//
// Exit 0 within contract, 1 drift, 2 usage, 3 no working browser.
// Read-only: it only loads pages. A size check that matches no element is
// reported NOT CHECKED, never passed.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { withBrowser } from "../../design-taste/scripts/ui-ref.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CONTRACT = join(HERE, "..", "assets", "size-contracts", "volum-default.json");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const within = (p, ms) => Promise.race([p, sleep(ms).then(() => null)]);

// A check applies to "desktop" (>= 1024), "mobile" (< 768), or "all" widths.
export const applies = (scope = "all", w) =>
  scope === "all" || (scope === "desktop" && w >= 1024) || (scope === "mobile" && w < 768);

// Pure: judge the measured values of one check.
//   allowed     exact set (± tol): sizes, radii          — no elements = not checked
//   max         upper bound: shadow blur                 — no elements = pass
//   forbid      any match is a defect: gradients, tiles  — no elements = pass
//   distinctMax how many different values may appear: accent surfaces
//   warnBelow   advisory minimum, never fails: touch targets
export function judge(check, values) {
  const tol = check.tol ?? 1;
  if (check.forbid) return { status: values.length ? "fail" : "pass", offenders: values };
  if (check.max != null) {
    const offenders = values.filter((v) => v.v > check.max + tol);
    return { status: offenders.length ? "fail" : "pass", offenders };
  }
  if (check.distinctMax != null) {
    const seen = new Map(); for (const v of values) if (!seen.has(v.v)) seen.set(v.v, v);
    return { status: seen.size > check.distinctMax ? "fail" : "pass", offenders: seen.size > check.distinctMax ? [...seen.values()] : [] };
  }
  if (!values.length) return { status: "not-checked", offenders: [] };
  if (check.allowed) {
    const offenders = values.filter((v) => !check.allowed.some((a) => Math.abs(v.v - a) <= tol));
    return { status: offenders.length ? "fail" : "pass", offenders };
  }
  if (check.warnBelow != null) {
    const offenders = values.filter((v) => v.v < check.warnBelow - tol);
    return { status: offenders.length ? "warn" : "pass", offenders };
  }
  return { status: "not-checked", offenders: [] };
}

// Runs inside the page: geometry and computed styles only, plus a short label
// per element so a finding can be located. No cookies, storage, or form values.
// A probe returns a value, or null when the element is not relevant to the check.
const measure = (checks) => String.raw`(() => {
  const checks = ${JSON.stringify(checks)};
  const visible = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0; };
  const label = (el) => (el.tagName.toLowerCase() + (el.dataset.slot ? '[' + el.dataset.slot + ']' : '') + ' "' +
    ((el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30)) + '"');
  // Saturated colour test across rgb()/oklch()/oklab() computed forms; transparent is never colourful.
  // Pastel tints (violet-100, blue-50) count — they are the usual icon-tile fill; neutral greys
  // and slate-tinted greys (slate-100) do not.
  const colourful = (c) => { const n = (c.match(/-?[\d.]+/g) || []).map(Number);
    if (c.startsWith('rgb')) { if ((n[3] ?? 1) <= 0.1) return false;
      const mx = Math.max(n[0], n[1], n[2]) / 255, mn = Math.min(n[0], n[1], n[2]) / 255, l = (mx + mn) / 2;
      const sat = mx === mn ? 0 : (mx - mn) / (1 - Math.abs(2 * l - 1));
      return (mx - mn) * 255 > 12 && sat > 0.5; }
    const alpha = c.includes('/') ? n[n.length - 1] : 1; if (alpha <= 0.1) return false;
    if (c.startsWith('oklch')) return n[1] > 0.02;
    if (c.startsWith('oklab')) return Math.hypot(n[1], n[2]) > 0.02;
    return false; };
  const painted = (s) => (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && !/\/ 0\)|, 0\)$/.test(s.backgroundColor)) || parseFloat(s.borderTopWidth) > 0;
  const blur = (s) => s === 'none' ? 0 : Math.max(0, ...s.split(/,(?![^(]*\))/).map((p) =>
    parseFloat(p.replace(/[a-z]+\([^)]*\)|inset/g, '').trim().split(/\s+/)[2]) || 0));
  const interactive = (el) => !!el.closest('button, a[href], input, select, textarea, [role=button], [role=tab], [role=menuitem], [role=option]');
  const probes = {
    height: (el, r) => r.height, width: (el, r) => r.width,
    minSide: (el, r) => Math.min(r.width, r.height),
    fontSize: (el, r, s) => parseFloat(s.fontSize),
    // Full radius is allowed for avatars, dots, switches, and status badges, but a
    // wide pill-shaped button is an ornament and is measured like any other radius.
    borderRadius: (el, r, s, c) => { const v = parseFloat(s.borderTopLeftRadius); if (!v || !painted(s)) return null;
      const pill = v >= Math.min(r.width, r.height) / 2 - 1;
      const pillButton = r.width > r.height * 1.5 && el.matches('button:not([role=switch]), a[href], [role=button]');
      return c.allowPill && pill && !pillButton ? null : v; },
    // Surfaces only: a glow on a thin progress bar (route loading indicator) is not a card shadow.
    shadowBlur: (el, r, s) => r.height < 6 ? null : blur(s.boxShadow) || null,
    gradient: (el, r, s) => s.backgroundImage.includes('gradient') ? 1 : null,
    // The generated-admin tell: a small, square, colour-filled, rounded box holding only an icon.
    iconTile: (el, r, s) => r.width >= 20 && r.width <= 64 && Math.abs(r.width - r.height) <= 4 &&
      parseFloat(s.borderTopLeftRadius) > 0 && colourful(s.backgroundColor) && el.querySelector('svg') &&
      !(el.textContent || '').trim() && !interactive(el) ? r.width : null,
    accentSurface: (el, r, s) => !interactive(el) && colourful(s.backgroundColor) ? s.backgroundColor : null,
  };
  const out = {};
  for (const c of checks) {
    const ignore = c.ignore ? [...document.querySelectorAll(c.ignore)] : [];
    const vals = [];
    for (const el of document.querySelectorAll(c.selector)) {
      if (vals.length >= 400) break;
      if (!visible(el) || ignore.some((i) => i === el || i.contains(el))) continue;
      const r = el.getBoundingClientRect(); const v = probes[c.prop](el, r, getComputedStyle(el), c);
      if (v != null) vals.push({ v: typeof v === 'number' ? Math.round(v * 2) / 2 : v, el: label(el) });
    }
    out[c.id] = vals;
  }
  return out;
})()`;

export async function run(url, contract, widths) {
  const results = [];
  await withBrowser(async ({ send, once }) => {
    for (const w of widths) {
      const touch = w < 768;
      await send("Emulation.setDeviceMetricsOverride", { width: w, height: touch ? 844 : 900, deviceScaleFactor: 1, mobile: touch });
      // Makes (pointer: coarse) match on narrow widths, so touch sizing rules apply.
      await send("Emulation.setTouchEmulationEnabled", touch ? { enabled: true, maxTouchPoints: 5 } : { enabled: false });
      const loaded = once("Page.loadEventFired", 30000);
      await within(send("Page.navigate", { url }), 30000);
      if (!(await loaded)) process.stderr.write(`admin-geometry: ${w}px load event not seen in 30s; measuring what rendered\n`);
      await sleep(contract.settleMs ?? 1200);
      const checks = contract.checks.filter((c) => applies(c.viewports, w));
      const { result, exceptionDetails } = await send("Runtime.evaluate", { expression: measure(checks), returnByValue: true });
      if (exceptionDetails) throw new Error(`measurement failed at ${w}px: ${exceptionDetails.exception?.description ?? exceptionDetails.text}`);
      for (const c of checks) results.push({ width: w, check: c, values: result.value[c.id], ...judge(c, result.value[c.id]) });
    }
  });
  return results;
}

const rule = (c) => c.allowed ? `allowed ${c.allowed.join("/")}` : c.max != null ? `max ${c.max}` : c.forbid ? "forbidden"
  : c.distinctMax != null ? `≤ ${c.distinctMax} distinct` : `advisory ≥ ${c.warnBelow}`;

export function report(url, contract, results) {
  const lines = [`# admin-geometry: ${contract.name}`, "", `URL: ${url}`, ""];
  const seen = (vs) => { const u = [...new Set(vs.map((x) => x.v))]; return (u.every((x) => typeof x === "number") ? u.sort((a, b) => a - b) : u).slice(0, 8).join(", "); };
  for (const r of results) {
    lines.push(`- ${r.status.toUpperCase()} ${r.width}px ${r.check.id} (${r.check.prop}; ${rule(r.check)}; seen ${seen(r.values) || "none"})`);
    for (const o of r.offenders.slice(0, 5)) lines.push(`  - ${o.v} ${o.el}`);
    if (r.offenders.length > 5) lines.push(`  - … ${r.offenders.length - 5} more`);
  }
  return lines.join("\n") + "\n";
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const args = process.argv.slice(2);
  const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : d; };
  const contractPath = opt("--contract", DEFAULT_CONTRACT);
  const widths = opt("--viewports", "390,1366,1536").split(",").map(Number);
  const out = opt("--out");
  const [url] = args;
  if (!url || widths.some((w) => !w)) { console.error("usage: admin-geometry.mjs URL [--contract FILE] [--viewports 390,1366,1536] [--out DIR]"); process.exit(2); }
  const contract = JSON.parse(readFileSync(contractPath, "utf8"));
  const results = await run(url, contract, widths);
  const md = report(url, contract, results);
  process.stdout.write(md);
  if (out) { mkdirSync(out, { recursive: true }); writeFileSync(join(out, "geometry.md"), md);
    writeFileSync(join(out, "geometry.json"), JSON.stringify(results.map(({ check, ...r }) => ({ id: check.id, ...r })), null, 2)); }
  process.exit(results.some((r) => r.status === "fail") ? 1 : 0);
}
