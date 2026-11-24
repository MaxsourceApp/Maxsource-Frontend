import type { WordPressPage } from "../../lib/wordpress-pages";
import SectionIntro from "../common/SectionIntro";
import {
  normalizeWordPressHtml,
  stripWordPressTagsPreservingBreaks,
} from "../common/WordPressText";
import "./PartnershipSection.css";

interface BenefitCard {
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt: string;
}

function getPlainText(value: string) {
  return stripWordPressTagsPreservingBreaks(normalizeWordPressHtml(value))
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;|&#0*160;/gi, " ");
}

function getAttribute(tag: string, name: string) {
  const match = new RegExp(
    `\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "i",
  ).exec(tag);
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

function parseTitle(content: string) {
  const normalizedContent = normalizeWordPressHtml(content);
  const headingMatch = /<h2\b[^>]*>([\s\S]*?)<\/h2>/i.exec(normalizedContent);
  const description = headingMatch
    ? normalizedContent.slice(headingMatch.index + headingMatch[0].length)
    : "";

  return {
    smallTitle: headingMatch
      ? getPlainText(normalizedContent.slice(0, headingMatch.index))
      : "",
    title: headingMatch ? getPlainText(headingMatch[1]) : "",
    description: getPlainText(description),
  };
}

function parseBenefitCard(content?: string): BenefitCard | null {
  if (!content?.trim()) {
    return null;
  }

  const normalizedContent = normalizeWordPressHtml(content).replace(
    /\b(src|href)=(["'])http:\/\//gi,
    "$1=$2https://",
  );
  const imageTag = /<img\b[^>]*>/i.exec(normalizedContent)?.[0];
  const headingMatch = /<h4\b[^>]*>([\s\S]*?)<\/h4>/i.exec(normalizedContent);
  const description = headingMatch
    ? normalizedContent.slice(headingMatch.index + headingMatch[0].length)
    : normalizedContent;
  const title = headingMatch ? getPlainText(headingMatch[1]) : "";

  return {
    title,
    description: getPlainText(description),
    imageUrl: imageTag ? getAttribute(imageTag, "src") : undefined,
    imageAlt: imageTag ? getAttribute(imageTag, "alt") ?? "" : "",
  };
}

function BenefitIcon({ src, alt }: { src: string; alt: string }) {
  // WordPress stores these remote SVG icons.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="partnership-benefits__icon" src={src} alt={alt} />;
}

export default function PartnershipBenefitsSection({
  page,
}: {
  page: WordPressPage;
}) {
  const acf = page.acf;
  const intro = parseTitle(acf?.partnership_benefits_title?.trim() ?? "");
  const cards = [
    acf?.partnership_benefits_column_1,
    acf?.partnership_benefits_column_2,
    acf?.partnership_benefits_column_3,
    acf?.partnership_benefits_column_4,
  ]
    .map(parseBenefitCard)
    .filter((card): card is BenefitCard => card !== null);

  if (!intro.smallTitle && !intro.title && !intro.description && cards.length === 0) {
    return null;
  }

  const sectionId = `partnership-benefits-${page.id}`;

  return (
    <section
      className="partnership-benefits"
      aria-labelledby={intro.title ? sectionId : undefined}
      aria-label={intro.title ? undefined : intro.smallTitle || "Partnership benefits"}
    >
      <div className="partnership-benefits__inner">
        <SectionIntro
          className="section-intro--stacked"
          smallTitle={intro.smallTitle}
          title={intro.title}
          description={intro.description}
          highlight="partnering"
          titleId={sectionId}
        />
        {cards.length > 0 && (
          <div className="partnership-benefits__grid">
            {cards.map((card, index) => (
              <article
                className="partnership-benefits__card"
                key={`${page.id}-partnership-benefit-${index}`}
              >
                {card.imageUrl && (
                  <BenefitIcon src={card.imageUrl} alt={card.imageAlt} />
                )}
                {card.title && <h3>{card.title}</h3>}
                {card.description && <p>{card.description}</p>}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
