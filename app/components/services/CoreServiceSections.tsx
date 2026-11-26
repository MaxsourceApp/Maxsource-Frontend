import Link from "next/link";
import type { WordPressPage } from "../../lib/wordpress-pages";
import SectionIntro from "../common/SectionIntro";
import {
  normalizeWordPressHtml,
  stripWordPressTagsPreservingBreaks,
} from "../common/WordPressText";
import "./CoreServiceSections.css";

const headingPattern = /<h2\b[^>]*>([\s\S]*?)<\/h2>/i;
const serviceHeadingPattern = /<h4\b[^>]*>([\s\S]*?)<\/h4>/i;
const reasonHeadingPattern = /<h5\b[^>]*>([\s\S]*?)<\/h5>/gi;

function decodeTextEntities(value: string) {
  return value
    .replace(/&nbsp;|&#0*160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&rsquo;|&#0*8217;/gi, "’")
    .replace(/&quot;/gi, '"');
}

function getPlainText(value: string) {
  return decodeTextEntities(
    stripWordPressTagsPreservingBreaks(value)
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function getSectionIntro(content = "") {
  const normalizedContent = normalizeWordPressHtml(content);
  const headingMatch = headingPattern.exec(normalizedContent);

  if (!headingMatch) {
    return {
      eyebrow: "",
      title: "",
      description: getPlainText(normalizedContent),
    };
  }

  return {
    eyebrow:
      getPlainText(normalizedContent.slice(0, headingMatch.index)) ||
      "Our Services",
    title: getPlainText(headingMatch[1]),
    description: getPlainText(
      normalizedContent.slice(headingMatch.index + headingMatch[0].length),
    ),
  };
}

function getCoreServiceCards(content: string) {
  const normalizedContent = normalizeWordPressHtml(content);
  const headings = Array.from(
    normalizedContent.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi),
  );

  return headings.flatMap((heading, index) => {
    const headingStart = heading.index ?? 0;
    const contentStart = headingStart + heading[0].length;
    const contentEnd = headings[index + 1]?.index ?? normalizedContent.length;
    const cardContent = normalizedContent.slice(contentStart, contentEnd);
    const titleMatch = serviceHeadingPattern.exec(cardContent);
    serviceHeadingPattern.lastIndex = 0;

    if (!titleMatch) {
      return [];
    }

    return [
      {
        number: getPlainText(heading[1]),
        category: getPlainText(cardContent.slice(0, titleMatch.index)),
        title: getPlainText(titleMatch[1]),
        description: getPlainText(
          cardContent.slice(titleMatch.index + titleMatch[0].length),
        ),
      },
    ];
  });
}

function getWhyCards(content: string) {
  const normalizedContent = normalizeWordPressHtml(content);
  const headings = Array.from(normalizedContent.matchAll(reasonHeadingPattern));
  reasonHeadingPattern.lastIndex = 0;

  return headings.map((heading, index) => {
    const headingStart = heading.index ?? 0;
    const previousHeading = headings[index - 1];
    const start = previousHeading
      ? (previousHeading.index ?? 0) + previousHeading[0].length
      : 0;
    const end = headings[index + 1]?.index ?? normalizedContent.length;
    const number = getPlainText(normalizedContent.slice(start, headingStart))
      .match(/\d+\s*$/)?.[0]
      ?.trim();
    const description = getPlainText(
      normalizedContent.slice(headingStart + heading[0].length, end),
    ).replace(/\s+\d+\s*$/, "");

    return {
      number: number || String(index + 1).padStart(2, "0"),
      title: getPlainText(heading[1]),
      description,
    };
  });
}

export function CoreOurServicesSection({ page }: { page: WordPressPage }) {
  const intro = getSectionIntro(page.acf?.core_our_services_title);
  const cards = getCoreServiceCards(page.acf?.our_core_services ?? "");

  if (!intro.title && cards.length === 0) {
    return null;
  }

  const sectionId = `core-our-services-${page.id}`;

  return (
    <section
      className="core-our-services"
      aria-labelledby={intro.title ? sectionId : undefined}
      aria-label={intro.title ? undefined : intro.eyebrow || "Our services"}
    >
      <div className="core-our-services__inner">
        <SectionIntro
          className="section-intro--centered"
          smallTitle={intro.eyebrow}
          title={intro.title}
          description={intro.description}
          highlight={page.slug.split("-")[0]}
          titleId={sectionId}
        />

        {cards.length > 0 && (
          <div className="core-our-services__grid">
            {cards.map((card, index) => (
              <article
                className="core-our-services__card"
                key={`${page.id}-core-service-${index}`}
              >
                {card.category && (
                  <span className="core-our-services__category">
                    {card.category}
                  </span>
                )}
                <span className="core-our-services__number" aria-hidden="true">
                  {card.number}
                </span>
                {card.title && <h3>{card.title}</h3>}
                {card.description && <p>{card.description}</p>}
              </article>
            ))}
          </div>
        )}

        {cards.length > 0 && (
          <div className="core-our-services__action">
            <Link className="button" href="/contact">
              Talk To Our Expert
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function CoreServiceWhySection({ page }: { page: WordPressPage }) {
  const intro = getSectionIntro(page.acf?.core_service_why_maxsource_title);
  const cards = getWhyCards(page.acf?.core_service_why_maxsource ?? "");

  if (!intro.title && cards.length === 0) {
    return null;
  }

  const sectionId = `core-service-why-${page.id}`;

  return (
    <section
      className="core-service-why"
      aria-labelledby={intro.title ? sectionId : undefined}
      aria-label={intro.title ? undefined : intro.eyebrow || "Why choose Maxsource"}
    >
      <div className="core-service-why__inner">
        <SectionIntro
          className="section-intro--centered"
          smallTitle={intro.eyebrow}
          title={intro.title}
          description={intro.description}
          highlight={getPlainText(page.title.rendered)}
          titleId={sectionId}
        />

        {cards.length > 0 && (
          <div className="core-service-why__grid">
            {cards.map((card, index) => (
              <article
                className="core-service-why__card"
                key={`${page.id}-core-service-why-${index}`}
              >
                <span className="core-service-why__number">{card.number}</span>
                <div>
                  {card.title && <h3>{card.title}</h3>}
                  {card.description && <p>{card.description}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
