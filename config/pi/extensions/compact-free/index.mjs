/**
 * Route compaction through the configured 9router-fantastico Gemini models,
 * in order, then fall back to Pi's active model. Only a complete successful
 * summary may replace conversation history. No credentials or provider errors
 * are persisted in the breadcrumb log.
 */

import { appendFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { convertToLlm, serializeConversation } from "@earendil-works/pi-coding-agent";

// Keep provider/model selection explicit; no automatic catalog substitutions.
const COMPACT_MODELS = [
  { provider: "9router-fantastico", id: "ag/gemini-3.8-flash" },
  { provider: "9router-fantastico", id: "ag/gemini-3.8-flash-high" },
  { provider: "9router-fantastico", id: "ag/gemini-pro-agent" },
  { provider: "9router-fantastico", id: "ag/gemini-3.1-pro-low" },
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

      try {
        const model = ctx.modelRegistry.find(target.provider, target.id);
        if (!model) {
          await log(`skip ${target.provider}/${target.id}: model unavailable`);
          continue;
        }
        ctx.ui.notify(`[compact-free] summarize via ${model.id}…`, "info");
        // Pi owns provider authentication and header resolution, including
        // failures. Keep that whole operation inside the per-model fallback.
        const response = await ctx.modelRegistry.complete(
          model,
          { messages: summaryMessages },
          { maxTokens: 8192, signal },
        );
        if (signal.aborted) return;
        if (response.stopReason !== "stop") {
          await log(`incomplete response from ${model.id}; trying next model`);
          continue;
        }

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
        if (signal.aborted) return;
        await log(`request failed for ${target.id}; trying next model`);
        continue;
      }
    }

    await log(`semua model gagal -> fallback ke compaction default`);
    ctx.ui.notify(`[compact-free] semua backup gagal, pakai compaction default`, "warning");
    return; // fallback ke default (model utama)
  });
}
