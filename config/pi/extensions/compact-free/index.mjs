/**
 * compact-free
 *
 * Saat pi auto-compact (atau /compact), summarization dialihkan ke model
 * MURAH/GRATIS via 9router, supaya tidak menghabiskan limit model utama
 * (mis. GPT-5.4 / Claude sub). Kerja utama tetap di model yang sedang dipakai.
 *
 * Urutan model compaction (free duluan, paid murah sebagai backstop; dicoba
 * berurutan, pakai yang pertama berhasil):
 *   1. 9router/oc/north-mini-code-free    (free, cepat — skip otomatis kalau upstream down)
 *   2. 9router/oc/nemotron-3-ultra-free   (free, general purpose)
 *   3. 9router/oc/deepseek-v4-flash-free  (free, reasoning)
 *   4. minimax/MiniMax-M3                 (pi.dev provider minimax — murah, backstop andal)
 *   5. opencode-go/mimo-v2.5              (pi.dev provider opencode-go — last resort)
 * (mmf/mimo-auto dibuang: upstream error 441 permanen)
 * Kalau semua gagal -> fallback ke compaction default (pakai model utama).
 *
 * Log breadcrumb: ~/.pi/compact-free.log
 */

import { appendFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { complete } from "@earendil-works/pi-ai/compat";
import { convertToLlm, serializeConversation } from "@earendil-works/pi-coding-agent";

// Daftar model compaction, dicoba berurutan
const COMPACT_MODELS = [
  { provider: "9router", id: "oc/north-mini-code-free" },
  { provider: "9router", id: "oc/nemotron-3-ultra-free" },
  { provider: "9router", id: "oc/deepseek-v4-flash-free" },
  { provider: "minimax", id: "MiniMax-M3" },
  { provider: "opencode-go", id: "mimo-v2.5" },
];

const LOG_PATH = join(homedir(), ".pi", "compact-free.log");

async function log(line) {
  try {
    await appendFile(LOG_PATH, `[${new Date().toISOString()}] ${line}\n`);
  } catch {
    /* abaikan error log */
  }
}

export default function (pi) {
  pi.on("session_before_compact", async (event, ctx) => {
    const { preparation, signal } = event;
    const {
      messagesToSummarize,
      turnPrefixMessages,
      tokensBefore,
      firstKeptEntryId,
      previousSummary,
    } = preparation;

    const allMessages = [...messagesToSummarize, ...turnPrefixMessages];
    const conversationText = serializeConversation(convertToLlm(allMessages));
    const previousContext = previousSummary
      ? `\n\nRingkasan sesi sebelumnya (konteks):\n${previousSummary}`
      : "";

    const summaryMessages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are a conversation summarizer. Create a comprehensive summary of this conversation that captures:${previousContext}

1. The main goals and objectives discussed
2. Key decisions made and their rationale
3. Important code changes, file modifications, or technical details
4. Current state of any ongoing work
5. Any blockers, issues, or open questions
6. Next steps that were planned or suggested

Be thorough but concise. The summary will replace the conversation history, so include all information needed to continue the work effectively. Format as structured markdown with clear sections.

<conversation>
${conversationText}
</conversation>`,
          },
        ],
        timestamp: Date.now(),
      },
    ];

    await log(`compaction triggered: ${allMessages.length} pesan, ~${tokensBefore} tok`);

    // Coba tiap model secara berurutan
    for (const target of COMPACT_MODELS) {
      if (signal.aborted) return;

      const model = ctx.modelRegistry.find(target.provider, target.id);
      if (!model) {
        await log(`skip ${target.provider}/${target.id}: model tidak ditemukan`);
        continue;
      }

      const auth = await ctx.modelRegistry.getApiKeyAndHeaders(model);
      if (!auth.ok || !auth.apiKey) {
        await log(`skip ${target.id}: auth gagal`);
        continue;
      }

      ctx.ui.notify(`[compact-free] summarize pakai ${model.id}…`, "info");

      try {
        const response = await complete(
          model,
          { messages: summaryMessages },
          { apiKey: auth.apiKey, headers: auth.headers, maxTokens: 8192, signal },
        );

        const summary = response.content
          .filter((c) => c.type === "text")
          .map((c) => c.text)
          .join("\n");

        if (!summary.trim()) {
          await log(`empty dari ${model.id}, coba berikutnya`);
          continue;
        }

        await log(`OK via ${model.id} (${summary.length} char)`);
        ctx.ui.notify(`[compact-free] compaction selesai via ${model.id}`, "info");
        return { compaction: { summary, firstKeptEntryId, tokensBefore } };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await log(`error ${model.id}: ${message}`);
        continue;
      }
    }

    await log(`semua model gagal -> fallback ke compaction default`);
    ctx.ui.notify(`[compact-free] semua backup gagal, pakai compaction default`, "warning");
    return; // fallback ke default (model utama)
  });
}
