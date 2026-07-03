/**
 * Welcome Screen Extension — Ongki v2 "PRESS START"
 *
 * Arcade-style opening header for pi.dev:
 *   - rocket ASCII
 *   - B I S M I L L A H (spaced)
 *   - Al-Kahfi 39 dzikir
 *   - 3 prinsip kerja
 *   - ╔══╗ PRESS START box + blinking cursor
 *
 * No meta info (model/session/skills/pi version) — clean & playful.
 * Hot-reload safe: ~/.pi/agent/extensions/welcome-screen.ts
 */

import type { ExtensionAPI, ExtensionContext, Theme } from "@earendil-works/pi-coding-agent";

// ── Helpers ───────────────────────────────────────────────────────────
function paint(theme: Theme, color: string, text: string): string {
	try { return theme.fg(color as never, text); } catch { return text; }
}
function bold(theme: Theme, text: string): string {
	try { return theme.bold(text); } catch { return text; }
}

// ── Cursor state (blinking █) ────────────────────────────────────────
let cursorOn = true;
setInterval(() => { cursorOn = !cursorOn; }, 650);

// ── Section 1: Rocket + BISMILLAH ────────────────────────────────────
function header(theme: Theme): string[] {
	const A = (t: string) => paint(theme, "accent", bold(theme, t));
	const T = (t: string) => paint(theme, "text", t);
	const D = (t: string) => paint(theme, "dim", t);

	return [
		"",
		`                         ${A("▄   ▄")}`,
		`                         ${A("▀ █ ▀")}`,
		`                          ${A("▀▀▀")}`,
		"",
		`                   ${A("B I S M I L L A H")}`,
		"",
		`            ${T("Maa syaa-allah, laa quwwata")}`,
		`                   ${T("illaa billaah")}`,
		"",
		`           ${T(`"Apa yang Allah kehendaki,`)}`,
		`            ${T("tiada daya & kekuatan")}`,
		`               ${T(`kecuali dengan-Nya"`)}`,
		`                    ${D("— QS. Al-Kahfi: 39")}`,
		"",
	];
}

// ── Section 2: Star separator + renungan ────────────────────────────
function renungan(theme: Theme): string[] {
	const T = (t: string) => paint(theme, "text", t);
	const A = (t: string) => paint(theme, "accent", bold(theme, t));
	const D = (t: string) => paint(theme, "dim", t);

	return [
		`    ${D("──────── ⋆⋅☆⋅⋆ ─────────────────────────")}`,
		"",
		`     ${T("Tools, AI, otomatisasi")} ${A("—")} ${T("hanyalah sebab.")}`,
		`     ${T("Yang menuntaskan:")} ${A("izin Allah")}${T(",")}`,
		`     ${T("bukan RAM atau 9router.")}`,
		"",
	];
}

// ── Section 3: Prinsip kerja (· separator) ──────────────────────────
function prinsip(theme: Theme): string[] {
	const A = (t: string) => paint(theme, "accent", bold(theme, t));
	const M = (t: string) => paint(theme, "muted", t);
	const D = (t: string) => paint(theme, "dim", t);

	return [
		`     ${A("▸")} ${A("bismillah")}  ${M("·")}  ${M("niatkan ibadah lewat kode")}`,
		`     ${A("▸")} ${A("presisi")}    ${M("·")}  ${M("tiap baris, maksimal")}`,
		`     ${A("▸")} ${A("tenang")}     ${M("·")}  ${M("hasil di tangan-Nya")}`,
		"",
		`    ${D("──────── ⋆⋅☆⋅⋆ ─────────────────────────")}`,
		"",
	];
}

// ── Section 4: ╔══╗ PRESS START box + cursor ─────────────────────────
function box(theme: Theme): string[] {
	const A = (t: string) => paint(theme, "accent", bold(theme, t));
	const T = (t: string) => paint(theme, "text", t);
	const D = (t: string) => paint(theme, "dim", t);

	const cursor = cursorOn ? A("█") : D(" ");

	return [
		`          ${A("╔══════════════════════════╗")}`,
		`          ${A("║")}  ${T("Welcome back,")}           ${A("║")}`,
		`          ${A("║")}  ${A("Paduka Ongki")}            ${A("║")}`,
		`          ${A("║")}                          ${A("║")}`,
		`          ${A("║")}     ${A("▶")}  ${A("PRESS  START")}      ${A("║")}`,
		`          ${A("╚══════════════════════════╝")}`,
		"",
		`                           ${cursor}`,
		"",
	];
}

// ── Build header renderer ─────────────────────────────────────────────
function buildHeader(_ctx: ExtensionContext) {
	return (_tui: never, theme: Theme) => ({
		render(_width: number): string[] {
			return [
				...header(theme),
				...renungan(theme),
				...prinsip(theme),
				...box(theme),
			];
		},
		invalidate() {},
	});
}

// ── Extension ─────────────────────────────────────────────────────────
export default function (pi: ExtensionAPI) {
	pi.on("session_start", async (_event, ctx) => {
		if (ctx.mode !== "tui") return;
		ctx.ui.setHeader(buildHeader(ctx));
		ctx.ui.setWidget("skills-overview", undefined);
	});

	pi.registerCommand("welcome-off", {
		description: "Restore pi's built-in header for this session",
		handler: async (_args, ctx) => {
			ctx.ui.setHeader(undefined);
			ctx.ui.notify("Welcome screen disabled", "info");
		},
	});

	pi.registerCommand("welcome-on", {
		description: "Re-enable the welcome header",
		handler: async (_args, ctx) => {
			if (ctx.mode !== "tui") return;
			ctx.ui.setHeader(buildHeader(ctx));
			ctx.ui.notify("Welcome screen enabled", "info");
		},
	});
}
