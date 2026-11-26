import Link from "next/link";
import { Fragment } from "react";
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
const engagementHeadingPattern = /<h3\b[^>]*>([\s\S]*?)<\/h3>/i;
const includedHeadingPattern =
  /(?:<h[4-6]\b[^>]*>)?\s*WHAT(?:'|’|&rsquo;|&#0*39;)S\s+INCLUDED\s*(?:<\/h[4-6]>)?/i;

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

function getEngagementTab(content: string, index: number) {
  const normalizedContent = normalizeWordPressHtml(content).replace(/\r\n?/g, "\n");
  const headingMatch = engagementHeadingPattern.exec(normalizedContent);
  const initialText = getPlainText(
    normalizedContent.slice(0, headingMatch?.index ?? 0),
  );
  const initialMatch = /^(\d+)\s+(.+)$/.exec(initialText);
  const bodyStart = headingMatch
    ? headingMatch.index + headingMatch[0].length
    : 0;
  const body = normalizedContent.slice(bodyStart);
  const includedMatch = includedHeadingPattern.exec(body);
  const descriptionContent = includedMatch
    ? body.slice(0, includedMatch.index)
    : body;
  const includedContent = includedMatch
    ? body.slice(includedMatch.index + includedMatch[0].length)
    : "";
  const includedText = includedContent
    .replace(/<\/li\s*>/gi, "\n")
    .replace(/<\/p\s*>/gi, "\n")
    .replace(/<li\b[^>]*>/gi, "")
    .replace(/<p\b[^>]*>/gi, "");
  const included = stripWordPressTagsPreservingBreaks(includedText)
    .replace(/<br\s*\/?>/gi, "\n")
    .split(/\r?\n/)
    .map(getPlainText)
    .filter(Boolean);

  return {
    number: initialMatch?.[1] ?? String(index + 1).padStart(2, "0"),
    label: initialMatch?.[2] ?? getPlainText(headingMatch?.[1] ?? ""),
    title: getPlainText(headingMatch?.[1] ?? initialMatch?.[2] ?? ""),
    description: getPlainText(descriptionContent),
    included,
  };
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

export function EngagementModelsSection({ page }: { page: WordPressPage }) {
  const acf = page.acf;
  if (!acf) {
    return null;
  }

  const intro = getSectionIntro(acf.engagement_models_title);
  const tabs = [
    acf.engagement_models_tab_1,
    acf.engagement_models_tab_2,
    acf.engagement_models_tab_3,
    acf.engagement_models_tab_4,
  ]
    .filter((content): content is string => Boolean(content?.trim()))
    .map(getEngagementTab);

  if (!intro.title && tabs.length === 0) {
    return null;
  }

  const sectionId = `engagement-models-${page.id}`;
  const radioGroupName = `engagement-model-${page.id}`;

  return (
    <section
      className="engagement-models"
      aria-labelledby={intro.title ? sectionId : undefined}
      aria-label={intro.title ? undefined : intro.eyebrow || "Engagement models"}
    >
      <div className="engagement-models__inner">
        <SectionIntro
          className="section-intro--centered"
          smallTitle={intro.eyebrow}
          title={intro.title}
          description={intro.description}
          highlight="full delivery"
          titleId={sectionId}
        />

        {tabs.length > 0 && (
          <fieldset className="engagement-models__selector">
            <legend className="engagement-models__visually-hidden">
              Choose an engagement model
            </legend>
            {tabs.map((tab, index) => {
              const inputId = `${radioGroupName}-${index}`;
              return (
                <Fragment key={`${page.id}-engagement-${index}`}>
                  <input
                    className="engagement-models__input"
                    id={inputId}
                    type="radio"
                    name={radioGroupName}
                    value={index}
                    defaultChecked={index === 0}
                  />
                  <label className="engagement-models__option" htmlFor={inputId}>
                    <span>{tab.number}</span>
                    <strong>{tab.label}</strong>
                    <svg
                      className="engagement-models__arrow"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M6 14 14 6M7 6h7v7" />
                    </svg>
                  </label>
                </Fragment>
              );
            })}

            <div className="engagement-models__panels">
              {tabs.map((tab, index) => (
                <article
                  className="engagement-models__panel"
                  data-engagement-index={index}
                  key={`${page.id}-engagement-panel-${index}`}
                >
                  {tab.title && <h3>{tab.title}</h3>}
                  {tab.description && <p>{tab.description}</p>}
                  {tab.included.length > 0 && (
                    <div className="engagement-models__included">
                      <p>What&apos;s included</p>
                      <ul>
                        {tab.included.map((item, itemIndex) => (
                          <li key={`${item}-${itemIndex}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </fieldset>
        )}

        {tabs.length > 0 && (
          <div className="engagement-models__action">
            <Link className="button" href="/contact">
              Discuss Your Model
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
