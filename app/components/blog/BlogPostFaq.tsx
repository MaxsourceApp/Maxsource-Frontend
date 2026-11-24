"use client";

import { useState } from "react";
import {
  normalizeWordPressHtml,
  stripWordPressTagsPreservingBreaks,
  wrapBareTextInParagraphs,
} from "../common/WordPressText";

interface BlogPostFaqProps {
  smallTitle: string;
  title: string;
  content: string;
}

function parseFaqItems(content: string) {
  const faqItemPattern = /<h4\b[^>]*>([\s\S]*?)<\/h4>([\s\S]*?)(?=<h4\b|$)/gi;
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

export default function BlogPostFaq({
  smallTitle,
  title,
  content,
}: BlogPostFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = parseFaqItems(content);
  if (!smallTitle && !title && items.length === 0) return null;

  return (
    <section className="blog-post-faq" id="faqs" aria-labelledby="blog-post-faq-title">
      <div className="blog-post-faq__heading">
        {smallTitle && <p>{smallTitle}</p>}
        <h2 id="blog-post-faq-title">{title || "FAQs"}</h2>
      </div>
      {items.length > 0 && (
        <div className="blog-post-faq__list">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `blog-post-faq-answer-${index}`;
            return (
              <div className="blog-post-faq__item" key={`${item.question}-${index}`}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  {item.question}
                </button>
                <div
                  className={`blog-post-faq__answer-wrap${isOpen ? " is-open" : ""}`}
                  id={answerId}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                >
                  {item.answer && (
                    <div className="blog-post-faq__answer">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: normalizeWordPressHtml(
                            wrapBareTextInParagraphs(item.answer),
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
    </section>
  );
}
