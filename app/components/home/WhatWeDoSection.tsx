import type { WordPressPage } from "../../lib/wordpress-pages";
import SectionIntro from "../common/SectionIntro";
import WordPressText, { normalizeWordPressHtml } from "../common/WordPressText";

function addFeaturedTags(content: string) {
  return content.replace(/<h6\b[^>]*>([\s\S]*?)<\/h6>/i, (heading, tagContent: string) => {
    if (/<\/?[a-z][^>]*>/i.test(tagContent)) {
      return heading;
    }

    const tags = tagContent
      .split(/(?:\r?\n|<br\s*\/?>)+/i)
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (tags.length === 0) {
      return heading;
    }

    const tagMarkup = tags
      .map((tag) => {
        const safeTag = tag
          .replace(/&(?!(?:[a-z][a-z\d]+|#\d+|#x[\da-f]+);)/gi, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        return `<span>${safeTag}</span>`;
      })
      .join("");

    return `<div class="what-we-do__tags">${tagMarkup}</div>`;
  });
}

export default function HomeWhatWeDoSection({ page }: { page: WordPressPage }) {
  const acf = page.acf;
  if (!acf) {
    return null;
  }

  const metrics = Array.from({ length: 4 }, (_, index) => {
    const number = index + 1;
    return {
      value: acf[`metrics_value_${number}` as keyof typeof acf],
      title: acf[`metrics_title_${number}` as keyof typeof acf],
    };
  }).filter(
    (metric): metric is { value: string; title: string } =>
      typeof metric.value === "string" &&
      metric.value.trim() !== "" &&
      typeof metric.title === "string" &&
      metric.title.trim() !== "",
  );

  const cards = Array.from({ length: 6 }, (_, index) => {
    const value = acf[`column_${index + 1}` as keyof typeof acf];
    return typeof value === "string" && value.trim() !== ""
      ? { id: index + 1, content: value }
      : null;
  }).filter((card): card is { id: number; content: string } => card !== null);

  if (metrics.length === 0 && cards.length === 0 && !acf.title && !acf.description) {
    return null;
  }

  return (
    <section
      className="what-we-do"
      aria-labelledby={acf.title ? "what-we-do-title" : undefined}
      aria-label={acf.title ? undefined : acf.small_title || "What we do"}
    >
      {metrics.length > 0 && (
        <dl className="what-we-do__metrics">
          {metrics.map((metric, index) => (
            <div className="what-we-do__metric" key={`${metric.value}-${index}`}>
              <dt><WordPressText value={metric.title} /></dt>
              <dd><WordPressText value={metric.value} /></dd>
            </div>
          ))}
        </dl>
      )}

      <SectionIntro
        smallTitle={acf.small_title}
        title={acf.title}
        description={acf.description}
        highlight="automate"
        titleId="what-we-do-title"
      />

      {cards.length > 0 && (
        <div className="what-we-do__grid">
          {cards.map((card) => (
            <article
              className={`what-we-do__card${card.id === 1 ? " what-we-do__card--featured" : ""}`}
              key={card.id}
              dangerouslySetInnerHTML={{
                __html: normalizeWordPressHtml(
                  card.id === 1 ? addFeaturedTags(card.content) : card.content,
                ),
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
