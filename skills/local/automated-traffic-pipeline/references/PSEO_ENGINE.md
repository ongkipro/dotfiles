# Programmatic SEO (pSEO) Engine Architecture

Programmatic SEO allows you to automatically generate hundreds or thousands of high-intent, long-tail landing pages using structured database data (PostgreSQL, Drizzle, Cloudflare D1, or JSON/CSV datasets).

---

## 1. Anti-Doorway & Information Gain Requirements

Google and AI search engines penalize thin, programmatic doorway pages. Every generated page MUST pass the **Information Gain Criteria**:

- **Unique Data Points**: Specific pricing, specs, availability, or location-specific metrics.
- **Custom Comparison / Tables**: Dynamic comparison tables contrasting options.
- **Interactive Component / Calculator**: A lightweight calculator or diagnostic tool.
- **Unique FAQs**: Contextual Q&A specific to the page's exact data row.

---

## 2. Astro Dynamic Route Implementation (`src/pages/[topic]/[slug].astro`)

```astro
---
// src/pages/[topic]/[slug].astro
import BaseLayout from "@/layouts/BaseLayout.astro";
import AnswerBox from "@/components/AnswerBox.astro";
import JsonLd from "@/components/JsonLd.astro";
import { getTopicData, getAllSlugs } from "@/lib/db";

export async function getStaticPaths() {
  const items = await getAllSlugs();
  return items.map((item) => ({
    params: { topic: item.topic, slug: item.slug },
    props: { item }
  }));
}

const { item } = Astro.props;
const data = await getTopicData(item.slug);
---

<BaseLayout title={data.metaTitle} description={data.metaDescription}>
  <article class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold">{data.heading}</h1>
    
    <!-- AnswerBox Component for GEO/AEO Extraction -->
    <AnswerBox
      question={data.primaryQuestion}
      answer={data.directAnswer}
      sources={data.sources}
    />

    <!-- Dynamic Data Table (Information Gain) -->
    <section class="my-8">
      <h2 class="text-xl font-semibold mb-4">Specifications & Comparison</h2>
      <table class="w-full border-collapse border border-gray-200">
        <thead>
          <tr class="bg-gray-50">
            <th class="p-3 border">Feature</th>
            <th class="p-3 border">{data.name}</th>
            <th class="p-3 border">Industry Benchmark</th>
          </tr>
        </thead>
        <tbody>
          {data.specs.map(s => (
            <tr>
              <td class="p-3 border font-medium">{s.label}</td>
              <td class="p-3 border text-blue-600 font-semibold">{s.value}</td>
              <td class="p-3 border text-gray-500">{s.benchmark}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  </article>

  <!-- Structured Data -->
  <JsonLd data={data.schema} />
</BaseLayout>
```
