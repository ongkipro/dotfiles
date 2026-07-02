/**
 * Welcome Screen Extension — Garuda Gold
 *
 * Compact Garuda-themed welcome header for pi.dev.
 * Shows model, session, skill count, shortcuts.
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

// ── Garuda Mascot ─────────────────────────────────────────────────────
function garudaLines(theme: Theme): string[] {
	const G = (t: string) => paint(theme, "accent", t);
	const D = (t: string) => paint(theme, "dim", t);
	const T = (t: string) => paint(theme, "text", t);

	return [
		"",
		`${D("        ▄▄▄▄▄▄▄▄▄▄▄▄        ")}`,
		`${D("      ▄▀")}${G("██████████████")}${D("▀▄      ")}`,
		`${D("     ▐")}${G("██")}${T("▐█▌")}${G("████████")}${T("▐█▌")}${G("██")}${D("▌     ")}`,
		`${D("     ▐")}${G("█")}${T("▐███▌")}${G("█")}${T("▄▀▀▀▀▄")}${G("█")}${T("▐███▌")}${G("█")}${D("▌     ")}`,
		`${D("     ▐")}${G("█")}${T("▐███▌")}${D("▀▄  ▄▀")}${G("█")}${T("▐███▌")}${G("█")}${D("▌     ")}`,
		`${D("     ▐")}${G("████████████████")}${D("▌     ")}`,
		`${D("      ▀▄")}${G("████████████")}${D("▄▀      ")}`,
		`${D("        ▀▀▀▀▀▀▀▀▀▀▀▀        ")}`,
		"",
	];
}

// ── Stats row: model · session · skills · version ────────────────────
function statsRow(theme: Theme, ctx: ExtensionContext, skillCount: number): string[] {
	const A = (t: string) => paint(theme, "accent", t);
	const D = (t: string) => paint(theme, "dim", t);
	const M = (t: string) => paint(theme, "muted", t);
	const T = (t: string) => paint(theme, "text", t);

	const model = ctx.model ? `${ctx.model.provider}/${ctx.model.id}` : "—";
	const leaf = ctx.sessionManager.getLeafId?.()?.slice(0, 8) ?? "—";

	return [
		`  ${A("◆")} ${T(model)}`,
		`  ${D("◈")} ${M("session")} ${T(leaf)}  ${D("◈")} ${M("skills")} ${T(`${skillCount}`)}  ${D("◈")} ${M("pi")} ${T(`v${VERSION}`)}`,
	];
}

// ── Shortcuts ─────────────────────────────────────────────────────────
function shortcuts(theme: Theme, width: number): string[] {
	const K = (k: string) => paint(theme, "accent", bold(theme, k));
	const M = (d: string) => paint(theme, "muted", d);
	const S = paint(theme, "dim", " · ");

	if (width < 80) {
		return [
			"",
			`  ${K("/model")}${M("model")}${S}${K("/new")}${M("baru")}${S}${K("/skills")}${M("skill")}${S}${K("!cmd")}${M("bash")}`,
			"",
		];
	}

	return [
		"",
		`  ${K("/model")} ${M("ganti model")}${S}${K("Ctrl+L")} ${M("picker")}${S}${K("Shift+Tab")} ${M("thinking")}${S}${K("/skills")} ${M("list skill")}`,
		`  ${K("/new")} ${M("sesi baru")}${S}${K("/resume")} ${M("lanjut")}${S}${K("/tree")} ${M("history")}${S}${K("Esc Esc")} ${M("navigasi")}`,
		`  ${K("!cmd")} ${M("bash")}${S}${K("@file")} ${M("sisip file")}${S}${K("Ctrl+V")} ${M("paste gambar")}${S}${K("welcome-off")} ${M("sembunyi")}`,
		"",
	];
}

export default function (pi: ExtensionAPI) {
	pi.on("session_start", async (_event, ctx) => {
		if (ctx.mode !== "tui") return;

		// Count active skills
		let skillCount = 0;
		try {
			const { readdirSync } = await import("node:fs");
			const { join } = await import("node:path");
			const skillsDir = join(import.meta.dirname ?? "", "..", "skills");
			skillCount = readdirSync(skillsDir).filter(f => !f.startsWith(".") && !f.includes(".backup.")).length;
		} catch { skillCount = 92; }

		ctx.ui.setHeader((_tui, theme) => ({
			render(width: number): string[] {
				return [
					...garudaLines(theme),
					...statsRow(theme, ctx, skillCount),
					...shortcuts(theme, width),
				];
			},
			invalidate() {},
		}));

		ctx.ui.setWidget("skills-overview", undefined);
	});

	pi.registerCommand("welcome-off", {
		description: "Restore pi's built-in header for this session",
		handler: async (_args, ctx) => {
			ctx.ui.setHeader(undefined);
			ctx.ui.notify("Welcome screen disabled for this session", "info");
		},
	});

	pi.registerCommand("welcome-on", {
		description: "Re-enable the Garuda welcome header",
		handler: async (_args, ctx) => {
			if (ctx.mode !== "tui") return;

			let skillCount = 0;
			try {
				const { readdirSync } = await import("node:fs");
				const { join } = await import("node:path");
				const skillsDir = join(import.meta.dirname ?? "", "..", "skills");
				skillCount = readdirSync(skillsDir).filter(f => !f.startsWith(".") && !f.includes(".backup.")).length;
			} catch { skillCount = 92; }

			ctx.ui.setHeader((_tui, theme) => ({
				render(width: number): string[] {
					return [
						...garudaLines(theme),
						...statsRow(theme, ctx, skillCount),
						...shortcuts(theme, width),
					];
				},
				invalidate() {},
			}));
			ctx.ui.notify("Garuda welcome screen enabled", "info");
		},
	});
}
