import Link from "next/link";
import type { WordPressPage } from "../../lib/wordpress-pages";
import SectionIntro from "../common/SectionIntro";
import {
  normalizeWordPressHtml,
  wrapBareTextInParagraphs,
} from "../common/WordPressText";

function secureImageUrls(content: string) {
  return content.replace(
    /(<img\b[^>]*\bsrc=["'])http:\/\//gi,
    "$1https://",
  );
}

export default function OurStrengthsSection({ page }: { page: WordPressPage }) {
  const acf = page.acf;
  if (!acf) {
    return null;
  }

  const cards = Array.from({ length: 3 }, (_, index) => {
    const value = acf[`our_strengths_column_${index + 1}` as keyof typeof acf];
    return typeof value === "string" && value.trim()
      ? { id: index + 1, content: value }
      : null;
  }).filter((card): card is { id: number; content: string } => card !== null);
  const title = acf.our_strengths_title?.trim() ?? "";
  const smallTitle = acf.our_strengths_small_title?.trim() ?? "";

  if (!title && !smallTitle && cards.length === 0) {
    return null;
  }

  const sectionId = `our-strengths-${page.id}`;

  return (
    <section
      className="our-strengths"
      aria-labelledby={title ? sectionId : undefined}
      aria-label={title ? undefined : smallTitle || "Our Strengths"}
    >
      <div className="our-strengths__inner">
        <SectionIntro
          className="section-intro--centered"
          smallTitle={smallTitle}
          title={title}
          highlight={page.slug.replace(/-/g, " ")}
          titleId={sectionId}
        />

        {cards.length > 0 && (
          <div className="our-strengths__grid">
            {cards.map((card) => (
              <article
                className="our-strengths__card"
                key={card.id}
                dangerouslySetInnerHTML={{
                  __html: normalizeWordPressHtml(
                    wrapBareTextInParagraphs(
                      secureImageUrls(card.content),
                      "our-strengths__description",
                    ),
                  ),
                }}
              />
            ))}
          </div>
        )}

        {cards.length > 0 && (
          <div className="our-strengths__action">
            <Link className="button" href="/contact">
              Schedule a Free Call
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
