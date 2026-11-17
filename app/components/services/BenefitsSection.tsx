import Link from "next/link";
import type { WordPressPage } from "../../lib/wordpress-pages";
import SectionIntro from "../common/SectionIntro";
import WordPressText, {
  normalizeWordPressHtml,
  stripWordPressTagsPreservingBreaks,
} from "../common/WordPressText";

const headingPattern = /<h2\b[^>]*>([\s\S]*?)<\/h2>/i;
const linkPattern = /<a\b[^>]*>([\s\S]*?)<\/a>/i;

export default function BenefitsSection({ page }: { page: WordPressPage }) {
  const titleContent = page.acf?.benefits_title?.trim() ?? "";
  const benefitsContent = page.acf?.benefits_count?.trim() ?? "";
  if (!titleContent && !benefitsContent) {
    return null;
  }

  const normalizedTitle = normalizeWordPressHtml(titleContent);
  const headingMatch = headingPattern.exec(normalizedTitle);
  const heading = headingMatch?.[1];
  const eyebrow = headingMatch
    ? stripWordPressTagsPreservingBreaks(normalizedTitle.slice(0, headingMatch.index)) || "Benefits"
    : "Benefits";
  const trailingContent = headingMatch
    ? normalizedTitle.slice(headingMatch.index + headingMatch[0].length).trim()
    : normalizedTitle;
  const linkMatch = linkPattern.exec(trailingContent);
  const description = linkMatch
    ? trailingContent.replace(linkPattern, "").trim()
    : trailingContent;
  const buttonLabel = linkMatch ? stripWordPressTagsPreservingBreaks(linkMatch[1]) : "";
  const benefits = benefitsContent
    .split(/\r?\n+/)
    .map(stripWordPressTagsPreservingBreaks)
    .filter(Boolean);
  const sectionId = `benefits-section-${page.id}`;

  return (
    <section
      className="benefits-section"
      aria-labelledby={heading ? sectionId : undefined}
      aria-label={heading ? undefined : eyebrow}
    >
      <div className="benefits-section__inner">
        <div className="benefits-section__intro">
          <SectionIntro
            className="section-intro--stacked"
            smallTitle={eyebrow}
            title={heading ? stripWordPressTagsPreservingBreaks(heading) : undefined}
            description={description ? stripWordPressTagsPreservingBreaks(description) : undefined}
            highlight="benefits"
            titleId={heading ? sectionId : undefined}
          />
          {buttonLabel && (
            <div className="benefits-section__action">
              <Link className="button" href="/contact">
                <WordPressText value={buttonLabel} />
              </Link>
            </div>
          )}
        </div>

        {benefits.length > 0 && (
          <ol className="benefits-section__list">
            {benefits.map((benefit, index) => (
              <li className="benefits-section__item" key={`${benefit}-${index}`}>
                <span className="benefits-section__number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span><WordPressText value={benefit} /></span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
