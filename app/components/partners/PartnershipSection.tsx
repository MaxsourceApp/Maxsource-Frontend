import Link from "next/link";
import type { WordPressPage } from "../../lib/wordpress-pages";
import SectionIntro from "../common/SectionIntro";
import {
  normalizeWordPressHtml,
  stripWordPressTagsPreservingBreaks,
} from "../common/WordPressText";
import "./PartnershipSection.css";

function getPlainText(value: string) {
  return stripWordPressTagsPreservingBreaks(normalizeWordPressHtml(value))
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;|&#0*160;/gi, " ");
}

function parsePartnershipIntro(value: string) {
  const content = normalizeWordPressHtml(value);
  const headingMatch = /<h2\b[^>]*>([\s\S]*?)<\/h2>/i.exec(content);
  const afterHeading = headingMatch
    ? content.slice(headingMatch.index + headingMatch[0].length)
    : "";
  const linkMatch = /<a\b([^>]*)>([\s\S]*?)<\/a>/i.exec(afterHeading);
  const hrefMatch = linkMatch
    ? /\bhref=(["'])(.*?)\1/i.exec(linkMatch[1])
    : null;

  return {
    eyebrow: headingMatch
      ? getPlainText(content.slice(0, headingMatch.index))
      : "Become a partner",
    title: headingMatch ? getPlainText(headingMatch[1]) : "",
    description: headingMatch
      ? getPlainText(
          linkMatch
            ? afterHeading.replace(linkMatch[0], "")
            : afterHeading,
        )
      : "",
    actionLabel: linkMatch ? getPlainText(linkMatch[2]) : "",
    actionHref:
      hrefMatch?.[2] && hrefMatch[2] !== "#" && hrefMatch[2].startsWith("/")
        ? hrefMatch[2]
        : "/contact/",
  };
}

export default function PartnershipSection({ page }: { page: WordPressPage }) {
  const content = page.acf?.partnership_title?.trim() ?? "";
  const items = (page.acf?.partnership_count ?? "")
    .split(/\r?\n+/)
    .map(getPlainText)
    .filter(Boolean);

  if (!content && items.length === 0) {
    return null;
  }

  const intro = parsePartnershipIntro(content);
  const sectionId = `partnership-${page.id}`;

  return (
    <section
      className="partnership-section"
      aria-labelledby={intro.title ? sectionId : undefined}
      aria-label={intro.title ? undefined : intro.eyebrow || "Partnership"}
    >
      <div className="partnership-section__inner">
        <div className="partnership-section__copy">
          <SectionIntro
            className="partnership-section__intro"
            tone="dark"
            smallTitle={intro.eyebrow || "Become a partner"}
            title={intro.title}
            description={intro.description}
            highlight="success"
            titleId={sectionId}
          />
          {intro.actionLabel && (
            <div className="partnership-section__action">
              <Link className="button" href={intro.actionHref}>
                {intro.actionLabel}
              </Link>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="partnership-section__types">
            <p className="partnership-section__types-title">Partnership types</p>
            <ol>
              {items.map((item, index) => (
                <li key={`${page.id}-partnership-${index}`}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
