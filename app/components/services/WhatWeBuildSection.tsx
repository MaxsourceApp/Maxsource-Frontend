import Link from "next/link";
import type { WordPressPage } from "../../lib/wordpress-pages";
import SectionIntro from "../common/SectionIntro";
import {
  normalizeWordPressHtml,
  stripWordPressTagsPreservingBreaks,
  wrapBareTextInParagraphs,
} from "../common/WordPressText";

const headingPattern = /<h2\b[^>]*>([\s\S]*?)<\/h2>/i;

export default function WhatWeBuildSection({ page }: { page: WordPressPage }) {
  const acf = page.acf;
  if (!acf) {
    return null;
  }

  const cards = Array.from({ length: 6 }, (_, index) => {
    const value = acf[`what_we_build_column_${index + 1}` as keyof typeof acf];
    return typeof value === "string" && value.trim()
      ? { id: index + 1, content: value }
      : null;
  }).filter((card): card is { id: number; content: string } => card !== null);

  const titleContent = acf.what_we_build_title?.trim() ?? "";
  if (!titleContent && cards.length === 0) {
    return null;
  }

  const normalizedTitle = normalizeWordPressHtml(titleContent);
  const headingMatch = headingPattern.exec(normalizedTitle);
  const heading = headingMatch?.[1];
  const eyebrow = headingMatch
    ? stripWordPressTagsPreservingBreaks(normalizedTitle.slice(0, headingMatch.index)) || "What We Build"
    : "What We Build";
  const description = headingMatch
    ? normalizedTitle.slice(headingMatch.index + headingMatch[0].length).trim()
    : "";
  const sectionId = `what-we-build-${page.id}`;

  return (
    <section
      className="what-we-build"
      aria-labelledby={heading ? sectionId : undefined}
      aria-label={heading ? undefined : eyebrow}
    >
      <div className="what-we-build__inner">
        <div className="what-we-build__intro">
          <SectionIntro
            smallTitle={eyebrow}
            title={heading ? stripWordPressTagsPreservingBreaks(heading) : undefined}
            description={description ? stripWordPressTagsPreservingBreaks(description) : undefined}
            highlight={page.slug.split("-")[0]}
            titleId={heading ? sectionId : undefined}
          />
        </div>

        {cards.length > 0 && (
          <div className="what-we-build__grid">
            {cards.map((card) => (
              <article
                className="what-we-build__card"
                key={card.id}
                dangerouslySetInnerHTML={{
                  __html: normalizeWordPressHtml(
                    wrapBareTextInParagraphs(
                      card.content,
                      "what-we-build__card-description",
                    ),
                  ),
                }}
              />
            ))}
          </div>
        )}

        <div className="what-we-build__action">
          <Link className="button" href="/contact">
            Schedule a Free Call
          </Link>
        </div>
      </div>
    </section>
  );
}
