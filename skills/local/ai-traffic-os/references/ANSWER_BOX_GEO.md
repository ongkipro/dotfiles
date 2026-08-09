# AnswerBox & GEO Passage Extraction Standards

Generative Engines (Gemini in Google AI Overviews, OpenAI in ChatGPT Search, Perplexity) extract self-contained text blocks to answer user queries directly.

## 2026 Passage Chunking Rules

1. **Target Word Density**: **134–167 words** per direct answer paragraph.
2. **First-Sentence Directness**: The first sentence under an H2/H3 header MUST answer the core question directly.
3. **No Pronoun Ambiguity**: Avoid vague references like *"as mentioned earlier"* or *"in the previous section"*. The passage must be 100% self-contained if extracted out of context.
4. **Data Attributes**: Include `data-citation-unit="true"` and `data-answer-body="true"` to signal structured passage boundaries to AI parsers.

---

## Astro Implementation: `AnswerBox.astro`

```astro
---
// src/components/AnswerBox.astro

interface Source {
  name: string;
  url: string;
}

interface Props {
  question: string;
  answer: string;
  sources?: Source[];
  topicEntity?: string;
}

const {
  question,
  answer,
  sources = [],
  topicEntity
} = Astro.props;
---

<section
  class="answer-box my-6 rounded-xl border border-blue-200 bg-blue-50/60 p-6 dark:border-blue-900/50 dark:bg-blue-950/20"
  aria-labelledby="direct-answer-heading"
  data-citation-unit="true"
  data-entity={topicEntity}
>
  <h2 id="direct-answer-heading" class="text-xl font-bold text-gray-900 dark:text-gray-100">
    {question}
  </h2>

  <!-- Direct Answer Paragraph: 134–167 words self-contained answer for LLM parsers -->
  <p class="mt-3 text-base leading-relaxed text-gray-800 dark:text-gray-200" data-answer-body="true">
    {answer}
  </p>

  {sources.length > 0 && (
    <footer class="mt-4 border-t border-blue-200/60 pt-3 text-xs text-gray-600 dark:border-blue-900/40 dark:text-gray-400">
      <span class="font-medium">Verified Sources:</span>
      <ul class="inline-flex flex-wrap gap-2 ml-2">
        {sources.map(source => (
          <li>
            <a href={source.url} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline dark:text-blue-400">
              {source.name}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  )}
</section>
```
