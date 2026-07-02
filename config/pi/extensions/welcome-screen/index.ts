/**
 * Welcome Screen Extension — Bismillah Opening
 *
 * Opening header for pi.dev: Salam + dzikir + prinsip + welcome.
 * Hot-reload safe: ~/.pi/agent/extensions/welcome-screen.ts
 */

import type { ExtensionAPI, ExtensionContext, Theme } from "@earendil-works/pi-coding-agent";
import { VERSION } from "@earendil-works/pi-coding-agent";

// ── Helpers ───────────────────────────────────────────────────────────
function paint(theme: Theme, color: string, text: string): string {
	try { return theme.fg(color as never, text); } catch { return text; }
}
function bold(theme: Theme, text: string): string {
	try { return theme.bold(text); } catch { return text; }
}
function line(char: string, theme: Theme, color = "dim"): string {
	return paint(theme, color, char.repeat(60));
}

// ── Header: BISMILLAH + dzikir Al-Kahfi 39 ──────────────────────────
function header(theme: Theme): string[] {
	const A = (t: string) => paint(theme, "accent", bold(theme, t));
	const D = (t: string) => paint(theme, "dim", t);
	const T = (t: string) => paint(theme, "text", t);

	return [
		"",
		`  ${A("BISMILLAH")}`,
		"",
		`  ${A("Maa syaa-allaah, laa quwwata")}`,
		`  ${A("illaa billaah")}`,
		"",
		`  ${T(`"Apa yang Allah kehendaki,`)}`,
		`  ${T("tiada daya & kekuatan")}`,
		`  ${T(`kecuali dengan-Nya"`)}`,
		`  ${D("— QS. Al-Kahfi: 39")}`,
		"",
		`  ${line("─", theme)}`,
		"",
	];
}

// ── Renungan ──────────────────────────────────────────────────────────
function renungan(theme: Theme): string[] {
	const T = (t: string) => paint(theme, "text", t);
	const A = (t: string) => paint(theme, "accent", bold(theme, t));

	return [
		`  ${T("Tools, AI, otomatisasi")} ${A("—")} ${T("hanyalah sebab.")}`,
		`  ${T("Yang menuntaskan:")} ${A("izin Allah")}${T(",")}`,
		`  ${T("bukan RAM atau 9router.")}`,
		"",
	];
}

// ── Prinsip kerja ────────────────────────────────────────────────────
function prinsip(theme: Theme): string[] {
	const A = (t: string) => paint(theme, "accent", bold(theme, t));
	const M = (t: string) => paint(theme, "muted", t);

	return [
		`  ${A("▸")} ${A("bismillah")}  ${M(":")} ${M("niatkan ibadah lewat kode")}`,
		`  ${A("▸")} ${A("presisi")}     ${M(":")} ${M("tiap baris, maksimal")}`,
		`  ${A("▸")} ${A("tenang")}       ${M(":")} ${M("hasil di tangan-Nya")}`,
		"",
		`  ${line("─", theme)}`,
		"",
	];
}

// ── Welcome back ──────────────────────────────────────────────────────
function welcome(theme: Theme, ctx: ExtensionContext, skillCount: number): string[] {
	const A = (t: string) => paint(theme, "accent", bold(theme, t));
	const T = (t: string) => paint(theme, "text", t);
	const D = (t: string) => paint(theme, "dim", t);
	const M = (t: string) => paint(theme, "muted", t);

	const model = ctx.model ? `${ctx.model.provider}/${ctx.model.id}` : "—";
	const leaf = ctx.sessionManager.getLeafId?.()?.slice(0, 8) ?? "—";

	return [
		`  ${T("Welcome back,")}`,
		`  ${A("Paduka Ongki")}`,
		"",
		`  ${D("◈")} ${M("model")} ${T(model)}`,
		`  ${D("◈")} ${M("session")} ${T(leaf)}  ${D("◈")} ${M("skills")} ${T(`${skillCount}`)}  ${D("◈")} ${M("pi")} ${T(`v${VERSION}`)}`,
		"",
		`  ${A("▶")} ${A("PRESS START")} ${M("/model · /new · /skills · !cmd · /welcome-off")}`,
		"",
	];
}

// ── Count skills ──────────────────────────────────────────────────────
async function countSkills(): Promise<number> {
	try {
		const { readdirSync } = await import("node:fs");
		const { join } = await import("node:path");
		const skillsDir = join(import.meta.dirname ?? "", "..", "skills");
		return readdirSync(skillsDir).filter(f => !f.startsWith(".") && !f.includes(".backup.")).length;
	} catch {
		return 108;
	}
}

// ── Build header renderer ─────────────────────────────────────────────
async function buildHeader(ctx: ExtensionContext) {
	const skillCount = await countSkills();
	return (_tui: never, theme: Theme) => ({
		render(_width: number): string[] {
			return [
				...header(theme),
				...renungan(theme),
				...prinsip(theme),
				...welcome(theme, ctx, skillCount),
			];
		},
		invalidate() {},
	});
}

// ── Extension ─────────────────────────────────────────────────────────
export default function (pi: ExtensionAPI) {
	pi.on("session_start", async (_event, ctx) => {
		if (ctx.mode !== "tui") return;
		ctx.ui.setHeader(await buildHeader(ctx));
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
			ctx.ui.setHeader(await buildHeader(ctx));
			ctx.ui.notify("Welcome screen enabled", "info");
		},
	});
}
