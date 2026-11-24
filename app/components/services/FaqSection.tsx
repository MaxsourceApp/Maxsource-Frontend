"use client";

import { useState } from "react";
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
  const [openIndex, setOpenIndex] = useState<number | null>(0);
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
            {items.map((item, index) => {
              const isOpen = openIndex === index;
              const answerId = `${sectionId}-answer-${index}`;

              return (
                <div className="faq-section__item" key={`${item.question}-${index}`}>
                  <button
                    className="faq-section__question"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <WordPressText value={item.question} />
                  </button>
                  <div
                    className={`faq-section__answer-wrap${isOpen ? " faq-section__answer-wrap--open" : ""}`}
                    id={answerId}
                    aria-hidden={!isOpen}
                    inert={!isOpen}
                  >
                    {item.answer && (
                      <div className="faq-section__answer">
                        <div
                          className="faq-section__answer-content"
                          dangerouslySetInnerHTML={{
                            __html: normalizeWordPressHtml(
                              wrapBareTextInParagraphs(
                                item.answer,
                                "faq-section__answer-text",
                              ),
                            ),
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
