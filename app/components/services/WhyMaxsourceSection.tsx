import type { WordPressPage } from "../../lib/wordpress-pages";
import SectionIntro from "../common/SectionIntro";
import {
  normalizeWordPressHtml,
  stripWordPressTagsPreservingBreaks,
} from "../common/WordPressText";

const headingPattern = /<h2\b[^>]*>([\s\S]*?)<\/h2>/i;

export default function WhyMaxsourceSection({ page }: { page: WordPressPage }) {
  const content = page.acf?.why_maxsource?.trim();
  if (!content) {
    return null;
  }

  const normalizedContent = normalizeWordPressHtml(content);
  const headingMatch = headingPattern.exec(normalizedContent);
  const heading = headingMatch?.[1];
  const eyebrow = headingMatch
    ? stripWordPressTagsPreservingBreaks(normalizedContent.slice(0, headingMatch.index)) || "Why Maxsource"
    : "Why Maxsource";
  const description = headingMatch
    ? normalizedContent.slice(headingMatch.index + headingMatch[0].length).trim()
    : normalizedContent;
  const sectionId = `why-maxsource-${page.id}`;

  return (
    <section
      className="why-maxsource"
      aria-labelledby={heading ? sectionId : undefined}
      aria-label={heading ? undefined : eyebrow}
    >
      <div className="why-maxsource__inner">
        <SectionIntro
          smallTitle={eyebrow}
          title={heading ? stripWordPressTagsPreservingBreaks(heading) : undefined}
          description={description ? stripWordPressTagsPreservingBreaks(description) : undefined}
          highlight="Maxsource"
          titleId={heading ? sectionId : undefined}
        />
      </div>
    </section>
  );
}
