# AnswerBox Editorial Pattern

An answer box is a local presentation pattern for making visible content clear to people. It is not vendor-recognized schema and does not create citation eligibility by itself. Google documents no extra technical requirement for AI Overviews or AI Mode beyond normal Search eligibility.

## Editorial guidance

1. Answer the heading's question promptly, in as many words as accuracy requires.
2. Keep necessary nouns, qualifiers, units, dates, and scope in the same section so it remains understandable when linked directly.
3. Avoid vague references such as "as mentioned earlier" when a precise referent is inexpensive.
4. Use semantic HTML and descriptive headings for accessibility and normal document structure.
5. Treat custom `data-*` attributes as application hooks only; no cited vendor source here recognizes them as ranking or citation signals.

Source: [Google, AI features and your website](https://developers.google.com/search/docs/appearance/ai-features). Retrieve the current page before turning this editorial pattern into vendor-specific guidance.

## Astro implementation: `AnswerBox.astro`

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
>
  <h2 id="direct-answer-heading" class="text-xl font-bold text-gray-900 dark:text-gray-100">
    {question}
  </h2>

  <p class="mt-3 text-base leading-relaxed text-gray-800 dark:text-gray-200">
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
