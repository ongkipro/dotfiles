/**
 * Welcome Screen Extension — $ Logo
 *
 * Compact welcome header for pi.dev.
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

// ── $ Logo ──────────────────────────────────────────────────────────
function logoLines(theme: Theme): string[] {
	const G = (t: string) => paint(theme, "accent", t);
	const D = (t: string) => paint(theme, "dim", t);

	return [
		"",
		`${D("   ╭───────╮")}`,
		`${D("   │")}${G("  ╔═╗  ")}${D("│")}`,
		`${D("   │")}${G("  ║$║  ")}${D("│")}   ${D("exp $1B")}`,
		`${D("   │")}${G("  ╚═╝  ")}${D("│")}`,
		`${D("   ╰───────╯")}`,
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
		`  ${K("!cmd")} ${M("bash")}${S}${K("@file")} ${M("sisip file")}${S}${K("Ctrl+V")} ${M("paste gambar")}${S}${K("/welcome-off")} ${M("off")}`,
		"",
	];
}

// ── Count skills (safe fallback) ──────────────────────────────────────
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
		render(width: number): string[] {
			return [
				...logoLines(theme),
				...statsRow(theme, ctx, skillCount),
				...shortcuts(theme, width),
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
