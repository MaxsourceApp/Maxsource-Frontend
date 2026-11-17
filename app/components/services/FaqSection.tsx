import type { WordPressPage } from "../../lib/wordpress-pages";
import SectionIntro from "../common/SectionIntro";
import WordPressText, {
  normalizeWordPressHtml,
  stripWordPressTagsPreservingBreaks,
  wrapBareTextInParagraphs,
} from "../common/WordPressText";

function parseFaqItems(content: string) {
  const faqItemPattern =
    /<h4\b[^>]*>([\s\S]*?)<\/h4>([\s\S]*?)(?=<h4\b|$)/gi;
  const items: { question: string; answer: string }[] = [];
  let match: RegExpExecArray | null;

  while ((match = faqItemPattern.exec(content)) !== null) {
    const question = stripWordPressTagsPreservingBreaks(match[1]);
    const answer = match[2].trim();
    if (question) {
      items.push({ question, answer });
    }
  }

  return items;
}

export default function FaqSection({ page }: { page: WordPressPage }) {
  const acf = page.acf;
  if (!acf) {
    return null;
  }

  const smallTitle = acf.faq_small_title?.trim() ?? "";
  const title = acf.faq_title?.trim() ?? "";
  const items = typeof acf.faq === "string" ? parseFaqItems(acf.faq) : [];
  if (!smallTitle && !title && items.length === 0) {
    return null;
  }

  const sectionId = `faq-${page.id}`;

  return (
    <section
      className="faq-section"
      aria-labelledby={title ? sectionId : undefined}
      aria-label={title ? undefined : smallTitle || "Frequently asked questions"}
    >
      <div className="faq-section__inner">
        <SectionIntro
          className="section-intro--faq"
          smallTitle={smallTitle}
          title={title}
          titleId={sectionId}
        />
        {items.length > 0 && (
          <div className="faq-section__list">
            {items.map((item, index) => (
              <details
                className="faq-section__item"
                key={`${item.question}-${index}`}
                open={index === 0}
              >
                <summary className="faq-section__question">
                  <WordPressText value={item.question} />
                </summary>
                {item.answer && (
                  <div
                    className="faq-section__answer"
                    dangerouslySetInnerHTML={{
                      __html: normalizeWordPressHtml(
                        wrapBareTextInParagraphs(
                          item.answer,
                          "faq-section__answer-text",
                        ),
                      ),
                    }}
                  />
                )}
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
